const http=require("http");
const fs=require("fs");
const url=require("url");
const CodeUtil=require("./utf8_to_unicode"); //引入我们自己的 编码处理工具

var fileName=null;

const server=http.createServer(function (req,res) {
    //请求路径
    let path=decodeURIComponent(url.parse(req.url).pathname);
    switch (path) {
        /**
         * 用于 提交表单数据一一FormData类型的使用.html 中测试表单提交数据
         */
        case "/rest/formdata":
            if(req.method.toUpperCase()==="POST"){
                res.setHeader("Content-Type","text/plain;charset=utf-8");
                var str="";
                req.on("data",function (chunk) {
                    str+=chunk;
                });
                req.on("end",function () {
                    res.write("表单请求地址:"+req.url+"\n");
                    res.write("表单提交数据内容:\n"+str);
                    res.end()
                });
            }else{
                res.setHeader("Content-Type","text/plain;charset=utf-8");
                res.write("不支持POST以外的请求方式");
                res.end();
            }
            break;

        /**
         * 用于 请求的超时设定.html 中测试异步请求的超时取消
         */
        case "/rest/timeout":
            if(req.method.toUpperCase()==="POST"){
                res.setHeader("Content-Type","text/plain;charset=utf-8");
                setTimeout(function() {
                    res.write("经过三秒后,数据返回了");
                    res.end();
                }, 3000);
            }else{
                res.setHeader("Content-Type","text/plain;charset=utf-8");
                res.write("不支持POST以外的请求方式");
                res.end();
            }
            break;
        /**
         * 用于 将请求发送的数据 原封不动的返回
         */
        case "/rest/text":
        case "/rest/json":
        case "/rest/document":
            if(req.method.toUpperCase()==="POST"){
                var str="";
                req.on("data",function (chunk) {
                    str+=chunk;
                });
                req.on("end",function () {
                    res.write(str);
                    res.end()
                });
            }else{
                res.write("不支持POST以外的请求方式");
                res.end();
            }
            break;
        /**
         * 将 图片二进制数据 返回。
         */
        case "/rest/blob":
        case "/rest/arraybuffer":
            if(req.method.toUpperCase()==="POST"){
                fs.readFile("./测试图片.png",function (error,data) {
                    if(error){
                        console.log(error);
                    }else{
                        res.write(data);
                        res.end();
                    }
                })
            }else{
                res.write("不支持POST以外的请求方式");
                res.end();
            }
            break;
        /**
         *  用于 二进制数据处理.html 中 接受发送的Blob对象的二进制数据序列。
         */
        case "/rest/sendBinary":
            if(req.method.toUpperCase()==="POST"){
                var data=[];
                req.on("data",function (chunk) {
                    Array.prototype.push.apply(data,chunk);
                });
                req.on("end",function () {
                    console.log("发送的二进制数据是",data);
                    res.write(Buffer.from(data));
                    res.end();
                });
            }else{
                res.setHeader("Content-Type","text/plain;charset=utf-8");
                res.write("不支持POST以外的请求方式");
                res.end();
            }
            break;
        /**
         *  用于 二进制数据处理.html 中发送ArrayBuffer对象时 协商文件名。
         */
        case "/rest/filename":
            if(req.method.toUpperCase()==="POST"){
                var data="";
                req.on("data",function (chunk) {
                    data+=chunk;
                });
                req.on("end",function () {
                    fileName=data;
                    res.write(JSON.stringify("OK"));
                    res.end();
                });
            }else{
                res.setHeader("Content-Type","text/plain;charset=utf-8");
                res.write("不支持POST以外的请求方式");
                res.end();
            }
            break;
        /**
         *  用于 二进制数据处理.html 中发送ArrayBuffer对象时 接受二进制数据。
         */
        case "/rest/binaryUpload":
            if(req.method.toUpperCase()==="POST"){
                var data=[];
                req.on("data",function (chunk) {
                    Array.prototype.push.apply(data,chunk);
                });
                req.on("end",function () {
                    if(fileName===null){
                        res.write("失败");
                        res.end();
                        return ;
                    }
                    fs.writeFile(fileName,Buffer.from(data),function (err) {
                        if(err){
                            console.log(err);
                            res.write("写入失败:"+err);
                        }else{
                            res.write("成功")
                        }
                        res.end()
                    })
                });
            }else{
                res.setHeader("Content-Type","text/plain;charset=utf-8");
                res.write("不支持POST以外的请求方式");
                res.end();
            }
            break;

        /**
         *  用于 二进制数据处理.html 中接受 序列化的文件上传信息。
         */
        case "/rest/binaryUpload2":
            if(req.method.toUpperCase()==="POST"){
                var data="";
                req.on("data",function (chunk) {
                    data+=chunk;
                });
                req.on("end",function () {
                    data=JSON.parse(data);
                    console.log("Uint8Array对象序列化后length信息会丢失:",data.data.length===undefined)
                    var array=[];
                    for(var i=0;i<data.arraySize;i++){
                        array.push(data.data[i]);
                    }
                    fs.writeFile(data.name,Buffer.from(array),function (err) {
                        if(err){
                            console.log(err);
                            res.write(err);
                        }else{
                            res.write("成功")
                        }
                        res.end();
                    })
                });
            }else{
                res.setHeader("Content-Type","text/plain;charset=utf-8");
                res.write("不支持POST以外的请求方式");
                res.end();
            }
            break;
        /**
         *  用于 二进制数据处理.html 中接受 TypeArray对象。
         *  在这里我们自定义了一个上传文件协议，自定义了一个数据上传格式。
         */
        case "/rest/binaryUpload3":
            if(req.method.toUpperCase()==="POST"){
                var data=[];
                req.on("data",function (chunk) {
                    Array.prototype.push.apply(data,chunk);
                });
                req.on("end",function () {
                    //获取文件名称的UTF8编码长度
                    var temp1=data.splice(1);
                    var nameLength=data;
                    //获取文件的二进制数据
                    var realData=temp1.splice(nameLength);

                    //这里将文件名的UTF8编码序列转化为Unicode编码序列
                    var fileNameUnicodeArray=CodeUtil.UTF8ByteStreamToUnicodeArray(temp1);
                    //处理后获得文件名。
                    var uploadFileName=fileNameUnicodeArray.map((code)=>{
                        return String.fromCharCode(code);
                    }).join("");

                    //写入操作
                    fs.writeFile(uploadFileName,Buffer.from(realData),function (err) {
                        if(err){
                            console.log(err);
                            res.write("写入失败:"+err);
                        }else{
                            res.write("成功")
                        }
                        res.end()
                    })
                });
            }else{
                res.setHeader("Content-Type","text/plain;charset=utf-8");
                res.write("不支持POST以外的请求方式");
                res.end();
            }
            break;
        default:
            /**
             * 用于返回html页面
             */
            if (path.endsWith(".html")||path.endsWith(".js")){
                let filepath=path.substring(1,path.length); //处理路径 去掉 / 斜杠
                fs.readFile(filepath,(error,data)=>{
                    if(error){
                        console.error(error);
                        res.write("404");
                        res.end();
                    }else{
                        res.setHeader('Content-Type', 'text/html;charset=utf-8');
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