const http=require("http");
const fs=require("fs");
const url=require("url");
const querystring=require("querystring");

const server=http.createServer(function (req,res) {
    //请求路径
    let path=decodeURIComponent(url.parse(req.url).pathname);

    switch (path) {
        case "/rest/getcookie":
            /**
             * 这里需要注意的是一定要设置path路径，否则在网页的其他URL中，document.cookie是不会返回设置的cookie字符串的
             * 因为实际上浏览器是存储了cookie的，不过是存储在当前请求的路径 也就是 /rest/下  只有/rest/及其子路径中，document.cookie才会返回这里设置的cookie
             * 也就是说在 /目录下的页面是无法看到 /rest/ path下的cookie 的。
             * 因此这里最好设置path为 /,这样整站都可以看到设置的cookie
             */
            res.setHeader('Set-Cookie', generateCookie("server-cookie-name","server-cookie-value",new Date(Date.now()+3600000),"/","localhost"));
            res.end();
            break;
        /**
         * 用于分析 子cookie技术。
         */
        case "/rest/subcookies":
            var cookies=querystring.parse(req.headers.cookie,";");
            var subcookie=cookies.subcookies;
            res.write(decodeURIComponent(subcookie));
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

server.listen(8080);

/**
 * 根据参数生成cookie字符串
 * @param name
 * @param value
 * @param expires
 * @param path
 * @param domain
 * @param secure
 * @returns {string}
 */
function generateCookie(name,value,expires,path,domain,secure) {
    var cookieText=encodeURIComponent(name)+"="+encodeURIComponent(value);
    if(expires instanceof  Date){
        cookieText+="; expires="+expires.toGMTString();
    }
    if(path){
        cookieText+="; path="+path;
    }
    if(domain){
        cookieText+="; domain="+domain;
    }
    if(secure){
        secure+="; Secure";
    }
    return cookieText;
}