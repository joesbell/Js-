/**
 * 提供JSONP跨域接口。
 */
const http=require("http");
const fs=require("fs");
const url=require("url");
const querystring=require("querystring");

//这是模拟数据。
var users=[{id:1,name:"reveur1"},{id:2,name:"reveur2"},{id:3,name:"reveur3"}];

const server=http.createServer(function (req,res) {
    //请求路径
    let path=decodeURIComponent(url.parse(req.url).pathname);
    switch (path) {
        /**
         * 用于 JSONP.html 中测试
         * JSONP请求的接口。
         */
        case "/jsonp/user":
            //获取URL后的请求参数对象。
            var param=querystring.parse(url.parse(req.url).search.substring(1));
            //获取回调函数名称
            var callback=param.callback;
            var id=param.id;
            //从服务器数据中寻找请求要求的数据.
            var data=users.find((user)=>{
                return user.id==id;
            });

            /**
             * 核心，将请求需要的数据通过JSON序列化为字符串后，作为函数的参数与回调函数的名称拼接在一起。
             */
            var jsCode=callback+"("+JSON.stringify(data)+")";
            res.setHeader("Content-Type","text/plain;charset=utf-8");
            res.write(jsCode);
            res.end();
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