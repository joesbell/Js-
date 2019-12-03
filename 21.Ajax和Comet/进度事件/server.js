const http=require("http");
const fs=require("fs");
const url=require("url");

const server=http.createServer(function (req,res) {
    //请求路径
    let path=decodeURIComponent(url.parse(req.url).pathname);
    switch (path) {
        /**
         * 用于 6大进度事件.html 测试 正常的响应200状态码
         */
        case "/rest/progressevent1":
            res.write("成功响应");
            res.end();
            break;
        /**
         * 用于 6大进度事件.html 测试 正常的响应400状态码
         */
        case "/rest/progressevent2":
            setTimeout(function() {
                res.writeHead(400);
                res.end();
            }, 1000);
            break;
        /**
         * 用于 6大进度事件.html 测试 手动abort终止请求。
         */
        case "/rest/progressevent3":
            //因此这里延时5秒才响应
            setTimeout(function() {
                res.write("5秒后才会响应");
                res.end();
            }, 5000);
            break;
        /**
         * 用于 6大进度事件.html 测试 超时请求.
         */
        case "/rest/progressevent4":
            //因此这里延时5秒才响应
            setTimeout(function() {
                res.write("5秒后才会响应");
                res.end();
            }, 5000);
            break;

        /**
         * 用于 progress进度事件.html 测试获取下载进度
         */
        case "/rest/downloadprogressevent":
            var data=[];
            for(var i=0;i<1000000;i++){
                data[i]=i;
            }
            /**
             * 只有当服务器端设置了 Content-Length响应头，客户端才能获取到进度信息。
             */
            res.setHeader("Content-Length",data.length);
            res.write(Buffer.from(data));
            res.end();
            break;
        /**
         * 用于 progress进度事件.html 测试获取上传进度
         */
        case "/rest/uploadprogressevent":
            res.write("上传已完成");
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

server.listen(8080);