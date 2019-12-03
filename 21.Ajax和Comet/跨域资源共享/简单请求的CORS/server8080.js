/**
 * 单纯提供html页面
 */
const http=require("http");
const fs=require("fs");
const url=require("url");

const server=http.createServer(function (req,res) {
    //请求路径
    let path=decodeURIComponent(url.parse(req.url).pathname);
    switch (path) {

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