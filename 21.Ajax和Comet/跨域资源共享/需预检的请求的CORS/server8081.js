/**
 * 提供跨域接口的服务。
 */
const http=require("http");
const fs=require("fs");
const url=require("url");

var access_time=1; //用于记录没有对预检请求进行优化的接口，在实际请求时的实际数据返回次数。
var access_time2=1; //用于记录对预检请求进行优化后的接口，在实际请求时的实际数据返回次数。
var access_time3=1; //用于记录对预检请求进行优化后的接口，在实际请求时的实际数据返回次数。
var preMethod=null; //用于记录接口上次的请求方式。

const server=http.createServer(function (req,res) {
    //请求路径
    let path=decodeURIComponent(url.parse(req.url).pathname);
    switch (path) {
        /**
         * 用于 需预检的请求的CORS.html 中 测试
         * 对于需预检的请求，光是允许跨域是不够的，还必须设置专门用于预检的响应头信息。
         */
        case "/rest/notallow":
            console.log(req.method)
            res.setHeader("Access-Control-Allow-Origin","*");
            res.write("接受响应 SUCCESS");
            res.end();
            break;
        /**
         * 用于 需预检的请求的CORS.html 中 测试
         * 设置了用于预检的响应头信息后，需预检的请求脚本就可以接受到响应信息了。
         */
        case "/rest/a":
            console.log(req.method)
            res.setHeader("Access-Control-Allow-Origin","*");
            res.setHeader("Access-Control-Allow-Methods","DELETE,PUT");
            res.setHeader("Access-Control-Max-Age","0");
            res.write("接受响应 SUCCESS");
            res.end();
            break;
        /**
         * 用于 需预检的请求的CORS.html 中 测试
         * 对于原本就需要预检的请求类型(不是GET POST HEAD)，必须添加Access-Control-Allow-Methods。才能通过预检。
         */
        case "/rest/b":
            console.log(req.method)
            res.setHeader("Access-Control-Allow-Origin","*");
            res.setHeader("Access-Control-Allow-Methods","DELETE"); //这段代码是不能注释的！否则会报错。
            res.setHeader("Access-Control-Max-Age","0");
            res.write("接受响应 SUCCESS");
            res.end();
            break;
        /**
         * 用于 需预检的请求的CORS.html 中 测试
         * 对于原本就是简单请求的，因为设置了额外请求头或者其他原因变成预检请求的，无需添加Access-Control-Allow-Methods 就能通过预检。
         */
        case "/rest/c":
            console.log(req.method)
            res.setHeader("Access-Control-Allow-Origin","*");
            // res.setHeader("Access-Control-Allow-Methods","GET"); //POST GET HEAD请求的这段代码是可以注释的
            res.setHeader("Access-Control-Max-Age","0");
            res.setHeader("Access-Control-Allow-Headers","REVEUR000,MY-SELF-HEADER");
            res.write("接受响应 SUCCESS");
            res.end();
            break;
        /**
         * 用于 需预检的请求的CORS.html 中 测试
         * 没有对OPTIONS预检请求做额外优化的接口，会往客户端浏览器发送两次响应信息。
         */
        case "/rest/d":
            console.log(req.method)
            res.setHeader("Access-Control-Allow-Origin","*");
            res.setHeader("Access-Control-Allow-Methods","POST");
            res.setHeader("Access-Control-Max-Age","0");
            res.setHeader("Access-Control-Allow-Headers","REVEUR000,MY-SELF-HEADER");
            res.write("接受响应 SUCCESS,当前本接口已经返回数据"+access_time+++"次");
            res.end();
            break;
        /**
         * 用于 需预检的请求的CORS.html 中 测试
         * 服务器对于需预检请求的接口进行优化，根据请求方式，进入不同的流程，可以避免在处理预检请求时重复返回相同的数据。
         */
        case "/rest/e":
            console.log(req.method);
            if(req.method==="OPTIONS"){
                /**
                 * 当请求方式OPTIONS时，视作是个预检请求。只返回预检响应头不返回实际响应数据。
                 */
                res.setHeader("Access-Control-Allow-Origin","*");
                res.setHeader("Access-Control-Allow-Methods","POST");
                res.setHeader("Access-Control-Max-Age","0");
                res.setHeader("Access-Control-Allow-Headers","REVEUR000,MY-SELF-HEADER");
                res.end();
            }else if (req.method==="POST") {
                /**
                 * 这里就是本接口接受的实际的需预检的请求。
                 * 此时才会进行响应实体的发送。
                 */
                var data="";
                req.on("data",function (chunk) {
                    data+=chunk;
                });
                req.on("end",function () {
                    /**
                     * 这里已经无需设置预检信息响应头了，因为本次实际请求已经发送过了预检请求了。
                     * 浏览器已经批准了此次服务器对 需预检的请求的响应信息的返回。
                     * 此时 需预检的请求在浏览器层面上来说已经可以当做简单请求来处理了。
                     * 因此 Access-Control-Allow-Origin 跨域头是必须要有的。
                     */
                    res.setHeader("Access-Control-Allow-Origin","*");
                    res.write("发送的请求头信息是:"+JSON.stringify(req.headers,null,"\t"));
                    res.write("\n发送的内容是:"+data);
                    res.write("\n当前本接口已经返回数据"+access_time2+++"次");
                    res.end();
                });
            }else{
                res.setHeader("Access-Control-Allow-Origin","*");
                res.write("暂不支持"+req.method+"的请求");
                res.end();
            }
            break;
        /**
         * 用于 需预检的请求的CORS.html 中 测试
         * 服务器对于需预检请求的接口进行优化，利用Access-Control-Max-Age预检响应头，可以避免在短时间内浏览器多次发送预检请求。
         */
        case "/rest/f":
            console.log(req.method)
            res.setHeader("Access-Control-Allow-Origin","*");
            res.setHeader("Access-Control-Allow-Methods","POST");
            res.setHeader("Access-Control-Max-Age","3");//设置预检请求有效期为3秒
            res.setHeader("Access-Control-Allow-Headers","REVEUR000,MY-SELF-HEADER");
            res.write("上次本接口的请求方式是:"+preMethod+",浏览器接受响应 SUCCESS,当前本接口已经返回数据"+access_time3+++"次");
            res.end();
            preMethod=req.method;
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