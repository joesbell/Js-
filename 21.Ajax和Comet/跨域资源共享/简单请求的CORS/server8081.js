/**
 * 提供跨域接口的服务。
 */
const http=require("http");
const fs=require("fs");
const url=require("url");

const server=http.createServer(function (req,res) {
    //请求路径
    let path=decodeURIComponent(url.parse(req.url).pathname);
    switch (path) {
        /**
         * 用于 简单请求的CORS.html 中测试简单请求的跨域
         */
        case "/rest/a":
            res.setHeader("Access-Control-Allow-Origin","*");
            res.write("接受响应 SUCCESS");
            res.end();
            break;
        /**
         * 用于 简单请求的CORS.html 中测试 xhr.upload对象添加事件监听后变成 需预检请求的过程。
         */
        case "/rest/upload":
            console.log(req.method);
            res.setHeader("Access-Control-Allow-Origin","*");
            res.write("接受响应 SUCCESS");
            res.end();
            break;
        /**
         * 用于 简单请求的CORS.html 中测试 xhr对象添加事件监听依旧是个简单请求
         */
        case "/rest/download":
            console.log(req.method);
            res.setHeader("Access-Control-Allow-Origin","*");
            res.write("接受响应 SUCCESS");
            res.end();
            break;
        /**
         * 用于 简单请求的CORS.html 中测试 简单请求的跨域是不会发送cookie的
         */
        case "/rest/cookie":
            var str=req.headers.cookie||"没有发送cookie";
            res.setHeader("Access-Control-Allow-Origin","*");
            res.write(str);
            res.end();
            break;

        /**
         * 用于 简单请求的CORS.html 中测试 简单请求的跨域在响应中无法获取所有的响应头信息。
         */
        case "/rest/responseheader":

            /**
             * 简单请求的跨域的只能获取响应头中的以下6个响应头信息
             */
            res.setHeader("Access-Control-Allow-Origin","*");
            res.setHeader("Content-Type","text/plain;charset=utf-8");
            res.setHeader("Content-Language","zh-CN,zh");
            res.setHeader("Cache-Control","nocache");
            res.setHeader("Expires",new Date().toGMTString());
            res.setHeader("Pragma","no-cache");
            res.setHeader("Last-Modified",new Date().toGMTString());

            //除此之外的响应头信息是无法获取的
            res.setHeader("REVEUR-DEFINED-HEAD","WOW");
            res.setHeader("Access-Control-Allow-Origin","*");
            res.write("接受响应 SUCCESS");
            res.end();
            break;

        /**
         * 用于 简单请求的CORS.html 中测试 服务器不允许跨域请求的情况。
         */
        case "/rest/notallowed":
            res.write("接受响应 SUCCESS");
            res.end();
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

server.listen(8081);