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
         * 用于 携带凭证的请求的CORS.html 测试
         * 服务器和客户端都允许凭证时的 成功案例。
         */
        case "/rest/a":
            res.setHeader("Access-Control-Allow-Origin", req.headers.origin); //这里必须设置为客户端请求的origin，而不能设置为*
            res.setHeader("Access-Control-Allow-Credentials",true);
            res.write("接受响应 SUCCESS,客户端发送的cookie是:"+req.headers.cookie);
            res.end();
            break;
        /**
         * 用于 携带凭证的请求的CORS.html 测试
         * 请求中不允许凭证而响应中允许凭证 时发送cookie
         */
        case "/rest/b":
            res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
            res.setHeader("Access-Control-Allow-Credentials",true);
            res.write("接受响应 SUCCESS,客户端发送的cookie是:"+req.headers.cookie);
            res.end();
            break;
        /**
         * 用于 携带凭证的请求的CORS.html 测试
         * 请求中允许凭证而响应中不允许凭证 时发送cookie
         */
        case "/rest/c":
            res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
            res.write("接受响应 SUCCESS,客户端发送的cookie是:"+req.headers.cookie);
            res.end();
            break;
        /**
         * 用于 携带凭证的请求的CORS.html 测试
         * 请求中不允许凭证而响应中允许凭证 时服务器设置cookie
         */
        case "/rest/getcookie1":
            res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
            res.setHeader("Access-Control-Allow-Credentials",true)
            res.setHeader("Set-Cookie","user=reveur111;");
            res.write("接受响应 SUCCESS");
            res.end();
            break;
        /**
         * 用于 携带凭证的请求的CORS.html 测试
         * 请求中允许凭证而响应中不允许凭证 时服务器设置cookie
         */
        case "/rest/getcookie2":
            res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
            res.setHeader("Set-Cookie","user=reveur222;");
            res.write("接受响应 SUCCESS");
            res.end();
            break;
        /**
         * 用于 携带凭证的请求的CORS.html 测试
         * 请求中允许凭证并且响应中允许凭证 时服务器设置cookie
         */
        case "/rest/getcookie3":
            res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
            res.setHeader("Access-Control-Allow-Credentials",true)
            res.setHeader("Set-Cookie","user=reveur000;");
            res.write("接受响应 SUCCESS");
            res.end();
            break;
        /**
         * 用于 携带凭证的请求的CORS.html 测试
         * 获取此时请求中发送的cookie内容并回写客户端
         */
        case "/rest/sendcookie":
            res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
            res.setHeader("Access-Control-Allow-Credentials",true);
            res.write("接受响应 SUCCESS,客户端发送的cookie是:"+req.headers.cookie);
            res.end();
            break;
        /**
         * 用于 携带凭证的请求的CORS.html 测试
         * Access-Control-Allow-Origin 响应头设置为 * 也会导致 请求cookie发送失败
         */
        case "/rest/wrongsetting":
            res.setHeader("Access-Control-Allow-Origin", "*");
            res.setHeader("Access-Control-Allow-Credentials",true);
            res.write("接受响应 SUCCESS,客户端发送的cookie是:"+req.headers.cookie);
            res.end();
            break;
        /**
         * 用于 携带凭证的请求的CORS.html 测试
         * 对于需预检的请求的跨域发送cookie， 对预检请求的处理中也必须携带Access-Control-Allow-Credentials响应头允许凭证，
         * 并且 Access-Control-Allow-Origin不能设置为 * 了，必须设置为请求的origin
         */
        case "/rest/preflightcookie":
            console.log(req.method)
            if(req.method==="OPTIONS"){
                res.setHeader("Access-Control-Allow-Methods","PUT");
                res.setHeader("Access-Control-Allow-Origin", req.headers.origin); //不能再设置为"*"了
                res.setHeader("Access-Control-Allow-Credentials",true); //预检请求的处理中也必须允许凭证
                res.setHeader("Access-Control-Max-Age",0);
                res.end();
            }else if(req.method==="PUT"){
                res.setHeader("Access-Control-Allow-Origin", req.headers.origin);
                res.setHeader("Access-Control-Allow-Credentials",true);
                res.write("接受响应 SUCCESS,客户端发送的cookie是:"+req.headers.cookie);
                res.end();
            }
            break;
        /**
         * 用于 携带凭证的请求的CORS.html 测试
         * 利用自定义请求头发送 凭证信息。
         * 此时只需要额外处理 预检请求即可。
         */
        case "/rest/mydefinecookie":
            console.log(req.method)
            if(req.method==="OPTIONS"){
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.setHeader("Access-Control-Allow-Headers","MY-DEFINE-COOKIE");//预检请求中允许自定义的请求头。
                res.setHeader("Access-Control-Max-Age",0);
                res.end();
            }else{
                res.setHeader("Access-Control-Allow-Origin", "*");
                res.write("接受响应 SUCCESS,客户端发送的cookie是:"+req.headers["my-define-cookie"]); //获取请求头中的自定义凭证信息。
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

server.listen(8081);