/**
 * 用于提供websockets接口。
 */
const http=require("http");
const fs=require("fs");
const url=require("url");
const WebSocket= require("ws");

const myWs=new WebSocket.Server({
    host:"localhost",
    port:8081
});

var users=[]; //维护的用户列表。 默认用户名不重复。


/**
 * 给所有刚连接的客户端发送信息，同时绑定事件。
 */
myWs.on("connection",function (client) {
    let notice={
        type:"notice",
        time:getTime(),
        message:"你已进入聊天室"
    };
    client.send(JSON.stringify(notice));


    client.on("message",function (message) {
       var data=JSON.parse(message);
       switch (data.type) {
           /**
            * 用于处理登录信息
            */
           case "login":
               var user=data.username;
               users.push({
                   username:user,
                   client:client
               });
               console.log("用户",user,"已经登录");
               notice.type="notice";
               notice.message=user+"已经进入聊天室";
               myWs.broadcastToOther(client,notice);
               break;
           /**
            * 用于处理登出信息
            */
           case "logout":
               var username=users.find((user)=>{
                   return user.client===client;
               }).username;
               var msg={
                   type:"notice",
                   time:getTime(),
                   message:username+"已退出聊天室"
               };
               console.log("用户",username,"已经退出");
               myWs.broadcastToOther(client,msg);
               users=users.filter((user)=>{
                   return user.client!==client;
               });
               break;
           /**
            * 处理聊天信息
            */
           case "message":
               var msg={
                   type:"message",
                   time:getTime(),
                   username:users.find((user)=>{
                       return user.client===client;
                   }).username,
                   content:data.content
               };
               myWs.broadcastToOther(client,msg);
               msg.username="你";
               client.send(JSON.stringify(msg));
       }
    });

    /**
     * 这里主要处理客户端没有发送logout消息就强退的情况。
     */
    client.on("close",function (message) {
        var user=users.find((user)=>{
            return user.client===client;
        });
        //说明已经正常退出了
        if(!user){
            return ;
        }

        //强退的情况，重新维护用户表，同时向其他用户广播。
        var username=user.username;
        var msg={
            type:"notice",
            time:getTime(),
            message:username+"已退出聊天室"
        };
        console.log("用户",username,"已经强制退出");
        users=users.filter((user)=>{
            return user.client!==client;
        });
        myWs.broadcastToOther(client,msg);
    });

});

/**
 * 用于广播给 不是client的其他客户端
 * @param client
 * @param data 数据
 */
myWs.broadcastToOther=function (client,data) {
    users.forEach((user)=>{
        if(user.client!==client&&user.client.readyState===WebSocket.OPEN){
            user.client.send(JSON.stringify(data));
        }
    })
};

/**
 * 返回服务器当前时间的字符串格式
 * @returns {string}
 */
function getTime() {
    return new Date().toLocaleString();
}