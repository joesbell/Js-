/**
 * 提供图像Ping接口。
 */
const http=require("http");
const fs=require("fs");
const url=require("url");

const server=http.createServer(function (req,res) {
    //请求路径
    let path=decodeURIComponent(url.parse(req.url).pathname);

    if (path.endsWith(".png")||path.endsWith(".jpeg")){
        let filepath=path.substring(1,path.length); //处理路径 去掉 / 斜杠

        /**
         * 这里通过解析URL就可以获取浏览器发送的请求内容。
         */
        console.log("浏览器发送的信息是:",decodeURIComponent(url.parse(req.url).search.substring(1)),",请求的方式是:",req.method);

        //检测请求的图片文件是否存在
        fs.access(filepath, fs.constants.F_OK, (err) => {
            if(err){
                //文件不存在
                console.error(filepath,"文件不存在");
                res.end();
            }else{
                //文件存在则读取文件并返回图片文件内容。
                fs.readFile(filepath,(error,data)=>{
                    if(error){
                        console.error(error);
                        res.write("readfile error");
                        res.end();
                    }else{
                        //这里最好设置Content-Type响应头.
                        res.setHeader('Content-Type', 'image/*');
                        res.write(data);
                        res.end();
                    }
                });
            }
        });

    } else{
        res.write("404");
        res.end();
    }

});

server.listen(8081);