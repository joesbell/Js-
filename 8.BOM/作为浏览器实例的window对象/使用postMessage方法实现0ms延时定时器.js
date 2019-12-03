/**
 * 用postMessage和事件监听方法来模拟真正的0ms延时定时器
 */
function setZeroTimeout(func) {
    window.postMessage("ZeroTimeOut","*"); //window对象上发送Message信息.

    var args=Array.prototype.slice.call(arguments,1);//获取回调函数的参数数组

    //添加MessageEvent事件的监听方法
    window.addEventListener("message",function handle(event) {
        if(event.data==="ZeroTimeOut"){ //只有当该事件确实是 我们的0ms延时事件时
            func.apply(window,args); //永远以window对象作为this绑定对象执行。
            window.removeEventListener("message",handle);  //移除该事件监听
        }
    },false);
}




//0ms定时器的总计耗时远远小于普通的超时调用
var start=Date.now();
var a=1000;
setZeroTimeout(function foo() {
    if(a===0){
        var end=Date.now();
        console.log("0ms延时定时器总计耗时",end-start+"ms");
    }else{
        a--;
        setZeroTimeout(foo);
    }
});

start=Date.now();
var b=1000;
setTimeout(function foo() {
    if(b===0){
        var end=Date.now();
        console.log("普通的定时器总计耗时",end-start+"ms");
    }else{
        b--;
        setTimeout(foo);
    }
});


// 这种模拟的0ms定时器依旧必须等待代码全部执行完毕后，才会开始执行回调函数
for(var i=0;i<10000;i++){
    for(j=0;j<10000;j++){
        i+j;
    }
}

console.log("这里依旧是最先打印出来的");
