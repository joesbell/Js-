/**
 * 提供 服务器发送事件的接口
 */
const http=require("http");
const fs=require("fs");
const url=require("url");

const server=http.createServer(function (req,res) {
    //请求路径
    let path=decodeURIComponent(url.parse(req.url).pathname);
    switch (path) {
        /**
         * 用于 服务器发送事件.html 中测试
         * 最基础的客户端的EventSource对象的使用以及EventSource对象的readyState属性的变化。
         */
        case "/rest/sse":
            /**
             * 服务器端实现SSE的核心在于设置响应头 Content-Type：text/event-stream
             */
            res.setHeader('Content-Type', 'text/event-stream;charset=utf-8');

            /**
             * 服务器端数据流的格式有以下几种:
             * 1.data:数据
             * 2.event:自定义事件
             * 3.id：数字
             * 每一种数据自身必须换行。 最后还得换行一次标识本次信息结束。
             */
            res.write("data:10秒内会不停发送随机数\n"); //自身换行
            res.write("\n");//空行标识消息结束。
            var time=0;
            /**
             * 这里循环发送 10次 随机数到客户端。
             */
            var id=setInterval(()=>{
                if(time===10){
                    clearInterval(id);
                    res.write("data:本次请求结束");
                    res.write("\n\n");
                    res.end();
                    return ;
                }else{
                    res.write("data:随机数"+Math.ceil(Math.random()*10));
                    res.write("\n\n");
                    time++;
                }
            },1000);
            break;
        /**
         * 用于 服务器发送事件.html 中测试
         * 服务器 event:自定义事件 的监听和处理。
         */
        case "/rest/user-define-event":
            res.setHeader('Content-Type', 'text/event-stream;charset=utf-8');
            /**
             * 不同的数据格式可以同时使用。
             * 这里表示发送一个自定义init事件，并且携带数据。
             */
            res.write("event:init\n");
            res.write("data:"+Math.ceil(Math.random()*10));
            res.write("\n\n");

            var time=0;
            var id=setInterval(()=>{
                if(time===10){
                    clearInterval(id);
                    if(Math.random()>0.5){
                        res.write("event:end\n");
                        res.write("data:byebye");
                        res.write("\n\n");
                        res.end();
                    }else{
                        res.write("data:稍后再来一次");
                        res.write("\n\n");
                        res.end();
                    }
                    return ;
                }else{
                    var random=Math.ceil(Math.random()*10);
                    if(random>5){
                        res.write("event:add\n");
                        res.write("data:"+random);
                        res.write("\n\n");
                    }else{
                        res.write("data:"+new Date().toLocaleString());
                        res.write("\n\n");
                    }
                    time++;
                }
            },1000);
            break;
        /**
         * 用于 服务器发送事件.html 中测试
         * 服务器 id:数字 格式数据的来完成服务器状态的恢复。
         */
        case "/rest/id":
            res.setHeader('Content-Type', 'text/event-stream;charset=utf-8');
            /**
             * 首先检查客户端是否发送了Last-Event-ID请求头，如果有，那么就准备恢复该次的服务状态。
             */
            console.log("客户端发送的Last-Event-ID请求头",req.headers["last-event-id"]);
            var index=req.headers["last-event-id"]||0;
            var id=setInterval(()=>{
                var random=Math.random();
                if(random>0.8){
                    clearInterval(id);
                    res.end();
                }else{
                    /**
                     * 这里是 data: 和 id: 数据格式的结合使用。由于发送了id:数字的内容，因此就算客户端断线重连后，
                     * 也能通过Last-Event-ID请求头获取到客户端当前已经接受的数据的进度，从而及时恢复该次的服务状态。
                     */
                    res.write("data:第"+index+"条信息\n");
                    res.write("id:"+index++);
                    res.write("\n\n");
                }
            },1000);
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

server.listen(8080);