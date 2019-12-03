;(function () {


    /**
     * 连接到某个数据库的封装
     * @param databasename
     * @constructor
     */
    function IDBWrapper(databasename) {
        this.version=null; //数据库版本
        this.idb=null;    //数据库引用
        this.dbname=databasename;  //数据库名
        this.updateTransaction=null; //用于保存升级版本时的事务
    }


    /**
     * 封装修改数据库表的方法。
     * @param updatePromise  一个修改表格的操作的promise
     * @returns {Promise<any>}
     */
    IDBWrapper.prototype.updateSchema = function (updatePromise) {
        var self = this; //保存引用。
        return new Promise((resolve, reject) => {
            if (this.version) {
                //version存在，说明已经初始化连接过了。
                if (this.idb) { //因此判断连接到了数据库
                    //如果连接了那么就关闭数据库连接
                    this.idb.close();
                }
                this.version++;
                //打开一个新的版本的数据库连接
                var req = indexedDB.open(this.dbname, this.version);

                //升级过程
                req.onupgradeneeded = function (event) {
                    self.idb = event.target.result; //将新的数据库保存
                    self.updateTransaction = event.target.transaction; //获取升级过程中的事务
                    //开始修改数据库的表
                    updatePromise().then((info) => {
                        resolve(info);
                    }).catch(() => {
                        reject();
                    })
                }
            } else {
                //否则就是还没连接过
                var init = false;
                var req = indexedDB.open(this.dbname);

                /**
                 * 如果是新建数据库，那么直接修改表。
                 */
                req.onupgradeneeded = function (event) {
                    self.idb = event.target.result;
                    self.version = self.idb.version;
                    init = true;//并设置初始化为true
                    self.updateTransaction = event.target.transaction;
                    updatePromise().then((info) => {
                        resolve(info);
                    }).catch(() => {
                        reject();
                    })
                };

                req.onsuccess = function (event) {
                    //如果init了，那么说明已经修改了表了。
                    if (init) {
                    } else {
                        //否则。再次调用本方法后修改表。
                        self.idb = event.target.result;
                        self.version = self.idb.version;
                        self.updateSchema(updatePromise).then((info) => {
                            resolve(info);
                        }).catch(() => {
                            reject();
                        })
                    }
                }
            }
        });
    };

    /**
     * 添加表
     * @param tableName 表名
     * @param options   创建表的设置
     * @param indexOptions  创建的索引数组
     * @returns {Promise<any>}
     */
    IDBWrapper.prototype.addTable = function (tableName, options, indexOptions) {
        var self = this;
        return new Promise((resolve, reject) => {
            //在updateSchema升级过程中修改数据库表相关内容。
            self.updateSchema(() => {
                return new Promise((resolve, reject) => {
                    //如果已经存在了该表
                    if (self.idb.objectStoreNames.contains(tableName)) {
                        //那么在升级版本事务结束后，直接reject
                        self.updateTransaction.oncomplete = function () {
                            reject();
                            return;
                        }
                    } else {
                        //否则就是新建表
                        var store = self.idb.createObjectStore(tableName, options);
                        //如果有索引数组，那么创建索引。
                        if (indexOptions) {
                            indexOptions.forEach((indexOption) => {
                                store.createIndex(indexOption.indexName, indexOption.keyPath, indexOption.option);
                            });
                        }
                        //并在升级表事务结束后resolve
                        store.transaction.oncomplete = function () {
                            resolve();
                        }
                    }
                })
            }).then(() => {
                resolve();
            }).catch(() => {
                reject()
            })
        })
    };


    /**
     * 删除表
     * @param tableName
     * @returns {Promise<any>}
     */
    IDBWrapper.prototype.deleteTable = function (tableName) {
        var self = this;
        return new Promise((resolve, reject) => {
            self.updateSchema(() => {
                return new Promise((resolve, reject) => {
                    try {
                        self.idb.deleteObjectStore(tableName);
                        resolve();
                    } catch (e) {
                        reject(e);
                    }
                })
            }).then(() => {
                resolve();
            }).catch((e) => {
                reject(e);
            })
        })
    };

    /**
     * 添加索引
     * @param tableName 表名
     * @param indexNames 索引数组
     * @param keyPaths   键名数组
     * @param options    索引的选项
     * @returns {Promise<any>}
     */
    IDBWrapper.prototype.addIndex = function (tableName, indexNames, keyPaths, options) {
        var self = this;
        return new Promise((resolve, reject) => {
            //在升级事务中新增索引
            self.updateSchema(() => {
                return new Promise((resolve, reject) => {
                    //从升级事务中获取对象仓库也就是表。
                    var store = self.updateTransaction.objectStore(tableName);
                    //对于每个索引，执行新增操作。
                    indexNames.forEach((value,index)=>{
                        store.createIndex(indexNames[index], keyPaths[index], options[index])
                    })
                    //当升级版本事务结束后，resolve
                    store.transaction.oncomplete = function () {
                        resolve();
                    }
                })
            }).then(() => {
                resolve();
            }).catch(() => {
                reject()
            })
        })
    };

    /**
     * 在表中添加数据
     * @param tableName 表名
     * @param data  数据
     * @returns {Promise<any>}
     */
    IDBWrapper.prototype.add = function (tableName, data) {
        var self = this;
        return new Promise((resolve, reject) => {
            try {
                //如果没连接数据库，那么准备初始化连接数据库并新增数据。
                if (!this.idb) {
                    var req = indexedDB.open(this.dbname);

                    //连接成功后
                    req.onsuccess = function (event) {
                        self.idb = event.target.result;
                        self.version = self.idb.version;
                        var transaction = self.idb.transaction(tableName, "readwrite");
                        var store = transaction.objectStore(tableName);
                        //添加数据
                        var req = store.add(data);

                        //在事务结束后根据事务执行结果resolve或者reject
                        transaction.oncomplete = function () {
                            resolve(data);
                        }
                        transaction.onerror = function (e) {
                            reject(e);
                        }
                    }
                } else {
                    //否则就是已经连接了数据库，那么直接添加即可。
                    var transaction = self.idb.transaction(tableName, "readwrite");
                    var store = transaction.objectStore(tableName);
                    var req = store.add(data);

                    //在事务结束后根据事务执行结果resolve或者reject
                    transaction.oncomplete = function () {
                        resolve(data);
                    }
                    transaction.onerror = function (e) {
                        reject(e);
                    }
                }
            } catch (e) {
                reject(e);
            }
        })
    };

    /**
     * 在表中添加 数组中的所有数据
     * @param tableName 表名
     * @param dataArray  数据数组
     * @returns {Promise<any>}
     */
    IDBWrapper.prototype.addAll = function (tableName, dataArray) {
        var self = this;
        return new Promise((resolve, reject) => {
            try {

                //如果没连接数据库，那么准备初始化连接数据库并新增数据。
                if (!this.idb) {
                    var req = indexedDB.open(this.dbname);
                    req.onsuccess = function (event) {
                        self.idb = event.target.result;
                        self.version = self.idb.version;

                        var transaction = self.idb.transaction(tableName, "readwrite");
                        var store = transaction.objectStore(tableName);

                        //将数组中的数组全部添加
                        dataArray.forEach((data) => {
                            store.add(data);
                        })

                        //在事务结束后根据事务执行结果resolve或者reject
                        transaction.oncomplete = function () {
                            resolve(dataArray);
                        }
                        transaction.onerror = function (e) {
                            reject(e);
                        }
                    }
                } else {
                    var transaction = self.idb.transaction(tableName, "readwrite");
                    var store = transaction.objectStore(tableName);

                    dataArray.forEach((data) => {
                        store.add(data);
                    })

                    //在事务结束后根据事务执行结果resolve或者reject
                    transaction.oncomplete = function () {
                        resolve(dataArray);
                    }
                    transaction.onerror = function (e) {
                        reject(e);
                    }
                }
            } catch (e) {
                reject(e);
            }
        })
    };

    /**
     * 获取数据库表中的所有数据
     * @param tableName
     * @returns {Promise<any>}
     */
    IDBWrapper.prototype.getAll = function (tableName) {
        var self=this;
        return new Promise((resolve, reject) => {
            try {
                //如果没连接数据库，那么准备初始化连接数据库并获取数据。
                if (!this.idb) {
                    var req = indexedDB.open(this.dbname);
                    req.onsuccess = function (event) {
                        self.idb = event.target.result;
                        self.version = self.idb.version;

                        var transaction = self.idb.transaction(tableName, "readonly");
                        var store = transaction.objectStore(tableName);

                        //调用objectStore的getAlL方法获取所有数据。
                        var req = store.getAll();
                        var result;
                        //该请求成功后，将数据放在result中。
                        req.onsuccess = function (event) {
                            result = event.target.result;
                        }
                        //随后事务结束，此时根据事务执行结果resolve或者reject
                        transaction.oncomplete = function () {
                            resolve(result);
                        }
                        transaction.onerror = function (e) {
                            reject(e);
                        }
                    }
                } else {
                    var transaction = self.idb.transaction(tableName, "readonly");
                    var store = transaction.objectStore(tableName);

                    var req = store.getAll();
                    var result;

                    //该请求成功后，将数据放在result中。
                    req.onsuccess = function (event) {
                        result = event.target.result;
                    }

                    //随后事务结束，此时根据事务执行结果resolve或者reject
                    transaction.oncomplete = function () {
                        resolve(result);
                    }
                    transaction.onerror = function (e) {
                        reject(e);
                    }
                }
            } catch (e) {
                reject(e);
            }
        })
    }

    window.IDBWrapper=IDBWrapper;

}());