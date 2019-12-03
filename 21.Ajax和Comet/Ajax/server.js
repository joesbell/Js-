const http=require("http");
const fs=require("fs");
const url=require("url");

const server=http.createServer(function (req,res) {
    //请求路径
    let path=decodeURIComponent(url.parse(req.url).pathname);

    switch (path) {
        /**
         * 用于 xhr的readyState属性.html 测试的接口
         */
        case "/rest/readyState":
            setTimeout(()=>{
                //用于防止中文乱码
                res.setHeader("Content-Type","text/plain;charset=utf-8");
                res.write("一些信息");
                res.end();
            },1000);
            break;
        /**
         * 用于 XMLHttpRequest对象.html 中测试同步请求的接口
         */
        case "/rest/a":
            let obj={
                data:"服务器对同步的Ajax请求返回的响应数据"
            };
            res.write(JSON.stringify(obj));
            res.end();
            break;
        /**
         * 用于 XMLHttpRequest对象.html 中测试异步请求的接口
         */
        case "/rest/b":
            let obj2={
                data:"服务器对异步的Ajax请求返回的响应数据"
            };
            res.write(JSON.stringify(obj2));
            res.end();
            break;
        /**
         * 用于 XMLHttpRequest对象.html 中测试 终止异步请求的接口
         */
        case "/rest/c":
            console.log("这个接口的请求会被主动中止");
            setTimeout(()=>{
                let obj3={
                    data:"会被中止的Ajax异步请求"
                };
                res.write(JSON.stringify(obj3));
                res.end();
            },1000);
            break;
        /**
         * 用于 HTTP头部信息.html 中测试 当前请求头信息
         */
        case "/rest/requesthead":
            res.setHeader("Content-Type","application/json;charset=utf-8");
            res.write(JSON.stringify(req.headers));
            res.end();
            break;
        /**
         * 用于 HTTP头部信息.html 中测试 当前响应头信息
         */
        case "/rest/responsehead":
            res.setHeader("Content-Type","application/json;charset=utf-8");
            res.end();
            break;
        /**
         * 用于GET请求和POST请求.html 中测试 GET请求
         */
        case "/rest/get":
            if(req.method.toUpperCase()==="GET"){
                res.setHeader("Content-Type","application/json;charset=utf-8");
                res.write("GET请求地址:"+req.url+"\n");
                res.write("GET请求参数信息:\n"+JSON.stringify(url.parse(req.url,true).query));
                res.end();
            }else{
                res.write("不支持GET以外的请求方式");
                res.end();
            }
            break;
        /**
         * 用于GET请求和POST请求.html 中测试 POST请求
         */
        case "/rest/post":
            if(req.method.toUpperCase()==="POST"){
                res.setHeader("Content-Type","application/json;charset=utf-8");
                var str="";
                req.on("data",function (chunk) {
                    str+=chunk;
                });
                req.on("end",function () {
                    res.write("POST请求地址:"+req.url+"\n");
                    res.write("POST请求消息体内容:\n"+str);
                    res.end()
                });
            }else{
                res.write("不支持POST以外的请求方式");
                res.end();
            }
            break;
        default:
            /**
             * 用于返回html页面
             */
            if (path.endsWith(".html")){
                let filepath=path.substring(1,path.length); //处理路径 去掉 / 斜杠
                fs.readFile(filepath,(error,data)=>{
                    if(error){
                        console.error(error);
                    }else{
                        res.setHeader('Content-Type', 'text/html;charset=utf-8');
                        res.write(data);
                        res.end();
                    }
                });
            } else{

            }
    }
});

server.listen(8080);