const http=require("http");
const fs=require("fs");
const url=require("url");
const encode_util=require("./utf8_to_unicode"); //引入UTF8编码和UNICODE编码的转码库

const server=http.createServer(function (req,res) {
    //请求路径
    let path=decodeURIComponent(url.parse(req.url).pathname);
    console.log(path);
    switch (path) {
        /**
         * 用于测试修改服务器端 manifest文件后，客户端请求的变化。
         */
        case "/rest/modify_manifest":
            /**
             * 打开manifest文件
             */
            fs.open("offline.manifest","r+",function (err,fd) {
                if(!err){
                    /**
                     * 读取文件数据
                     */
                    fs.readFile(fd,function (err,data) {
                        if(!err){
                            /**
                             * 转化utf8编码为unicode编码
                             */
                            var unicodeArray=encode_util.UTF8ByteStreamToUnicodeArray(data);
                            //转化为字符串
                            var result=unicodeArray.map((code)=>{
                                return String.fromCharCode(code);
                            }).join("");
                            var canOffLine=false;
                            /**
                             * 这里切换 manifest文件中的配置信息，来决定 1.js 文件是否应当被离线缓存。方式是通过添加 # 注释符号
                             */
                            if(result.indexOf("#1.js")===-1){
                                result=result.replace("1.js","#1.js");
                                canOffLine=false;
                            }else{
                                result=result.replace("#1.js","1.js");
                                canOffLine=true;
                            }
                            /**
                             * 将配置信息写入文件
                             */
                            fs.writeFile(fd,result,function (err) {
                                if(!err){
                                    //需要注意的是 manifest文件的响应头中 Content-Type最好设置为text/cache-manifest,否则可能无法识别。
                                    res.setHeader('Content-Type', 'text/cache-manifest;charset=utf-8');
                                    res.write(canOffLine+"");
                                    res.end();
                                }
                                /**
                                 * 写入文件后关闭文件
                                 */
                                fs.close(fd,function (err) {
                                    if(!err){
                                        console.log("关闭文件成功")
                                    }
                                })
                            })
                        }
                    });

                }else{
                    console.error(error);
                    res.write("404");
                    res.end();
                }
            });
            break;
        default:
            /**
             * 用于返回静态html文件
             */
            if (path.endsWith(".html")){
                let filepath=path.substring(1,path.length);
                fs.readFile(filepath,(error,data)=>{
                    if(error){
                        console.error(error);
                        res.write("404");
                        res.end();
                    }else{
                        res.write(data);
                        res.end();
                    }
                });
            }
            /**
             * 用于返回静态js文件
             */
            else if (path.endsWith(".js")){
                let filepath=path.substring(1,path.length);
                fs.readFile(filepath,(error,data)=>{
                    if(error){
                        console.error(error);
                        res.write("404");
                        res.end();
                    }else{
                        res.setHeader('Content-Type', 'text/javascript;charset=utf-8');
                        res.write(data);
                        res.end();
                    }
                });
            }
            /**
             * 用于返回静态css文件
             */
            else if (path.endsWith(".css")){
                let filepath=path.substring(1,path.length);
                fs.readFile(filepath,(error,data)=>{
                    if(error){
                        console.error(error);
                        res.write("404");
                        res.end();
                    }else{
                        res.setHeader('Content-Type', 'text/css;charset=utf-8');
                        res.write(data);
                        res.end();
                    }
                });
            }
            /**
             * 用于返回静态 manifest文件
             */
            else if (path.endsWith(".manifest")){
                let filepath=path.substring(1,path.length); //处理路径 去掉 / 斜杠
                fs.readFile(filepath,(error,data)=>{
                    if(error){
                        console.error(error);
                        res.write("404");
                        res.end();
                    }else{
                        res.setHeader('Content-Type', 'text/cache-manifest;charset=utf-8');
                        res.write(data);
                        res.end();
                    }
                });
            } else{
                res.write("404");
                res.end();
            }
    }
});

server.listen(8080);