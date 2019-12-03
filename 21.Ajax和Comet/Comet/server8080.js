/**
 * 用于提供 Comet服务器端推送的接口。
 */
const http=require("http");
const fs=require("fs");
const url=require("url");

/**
 * 这里用于短轮询请求数据测试。
 * 短轮询要请求的数据会随着时间变化。
 */
var time=0;
var shortPollingAccessCount=0; //访问短轮询接口的次数
var shortPollingData=0; //短轮询请求的数据

setInterval(()=>{
    if(time%2===0){
        shortPollingData++;
    }
    time++;
},1000);

/**
 * 这里用于长轮询请求数据测试。
 * 长轮询要请求的数据会随着时间变化。
 */
var time2=0;
var longPollingAccessCount=0;//访问长轮询接口的次数
var longPollingData=0; //长轮询请求的数据
var prevLongPollingData; //存放上一次长轮询请求到的数据。

setInterval(()=>{
    if(time2%5===0){
        longPollingData++;
    }
    time2++;
},1000);



const server=http.createServer(function (req,res) {
    //请求路径
    let path=decodeURIComponent(url.parse(req.url).pathname);
    switch (path) {
        /**
         * 用于 Comet.html 中测试
         * 短轮询
         */
        case "/rest/shortpolling":
            shortPollingAccessCount++;
            console.log("这是第",shortPollingAccessCount,"次短轮询");
            res.setHeader('Content-Type', 'text/plain;charset=utf-8');
            res.write(shortPollingData+"");
            res.end();
            break;
        /**
         * 用于 Comet.html 中测试
         * 长轮询
         */
        case "/rest/longpolling":
            longPollingAccessCount++;
            console.log("这是第",longPollingAccessCount,"次长轮询");
            res.setHeader('Content-Type', 'text/plain;charset=utf-8');
            /**
             * 这里模拟服务器判断数据变更了没有，只有在变更的情况下，才需要返回客户端更新后的数据。
             * 需要注意的是，这种写法只有在一个HTTP连接的情况下才是正确的。
             * 多个HTTP连接的情况下。会出现只有一个HTTP连接的数据会被更新的情况。
             * 这是因为这里保存的prevLongPollingData是在全局保存的。
             * 实际中，肯定不会这样简简单单的来判断数据是否应该更新。
             */
            var id=setInterval(()=>{
                if(prevLongPollingData!=longPollingData){
                    res.write(longPollingData+"");
                    prevLongPollingData=longPollingData;
                    res.end();
                    clearInterval(id);
                }
            },1000);
            break;
        /**
         * 用于 Comet.html 中测试
         * 标准的HTTP流
         */
        case "/rest/httpstream1":
            /**
             * 这里最好设置这个响应头。
             */
            res.setHeader('Transfer-Encoding', 'chunked');
            var i=0;
            /**
             * 每间隔一秒返回一个随机数给客户端
             */
            var id=setInterval(()=>{
                if(i===10){
                   clearInterval(id);
                   //最后关闭连接
                   res.end();
                   return;
                }
                res.write(((Math.random()*1000)>>0)+"");
                i++;
            },1000);
            break;

        /**
         * 用于 Comet.html 中测试
         * 谷歌浏览器在服务器端flush的数据不足1024字节时，会截留当次响应的数据，并在下次响应的数据到来后合并后再交给脚本代码。
         */
        case "/rest/httpstream2":
            res.setHeader('Transfer-Encoding', 'chunked');
            var data="";
            //这里首次发送的数据只有1023字节
            for(var i=0;i<1023;i++){
                data+="0";
            }
            res.write(data);
            setTimeout(()=>{
                res.write("这是第二次发送数据:world!");
            },2000);
            setTimeout(()=>{
                res.write("这是第三次发送数据:响应结束");
                res.end();
            },4000);
            break;
        /**
         * 用于 Comet.html 中测试
         * 对比测试 谷歌浏览器在服务器端flush的数据大于等于1024字节时，HTTP流会正常进行。
         */
        case "/rest/httpstream3":
            res.setHeader('Transfer-Encoding', 'chunked');
            var data="";
            //这里首次发送的数据大于等于1024字节了
            for(var i=0;i<1024;i++){
                data+="0";
            }
            res.write(data);
            setTimeout(()=>{
                res.write("这是第二次发送数据:world!");
            },2000);
            setTimeout(()=>{
                res.write("这是第三次发送数据:响应结束");
                res.end();
            },4000);
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