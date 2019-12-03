/**
 * 定时器方法
 */


/**
 * 1.定时器方法是可以传入 回调函数的参数。
 */
(function () {
    setTimeout(function (a,b) {
        console.log(a+" + "+b+" =",a+b);
        console.log("--------------------");
    },1000,1,99);
}());

/**
 * 2.不管在严格模式还是非严格模式下，定时器方法中的回调函数内的this取值永远是window全局对象，因为定时器的回调方法永远执行在全局环境上。
 */
(function () {
    "use strict";
    setTimeout(function (a,b) {
        "use strict";
        console.log("不管在严格模式还是非严格模式下，this===window:",this===window);
        console.log("--------------------");
    },1000,1,99);
}());


/**
 * 3.定时器方法是具有实际上的最小间隔时间的，一般浏览器中该时间为4ms。 就算设置间隔为0，实际也是4ms后才会再次调用
 */
(function () {
    var times=10;
    var id=setInterval(function () {
        if(times===0){
            clearInterval(id);
            console.log("可以看到，定时器的方法间隔调用时间最短为4ms");
            console.log("--------------------");
        }else{
            console.log("当前日期:"+Date.now());
            times--;
        }
    })
}());

/**
 * 4.EMCAScript是单线程的语言，必须将全部代码执行完毕后，才会开始执行定时器任务队列中的代码。
 */
(function () {
    var id=setInterval(function () {
        console.log("这是一段永远无法执行的代码");
    });
    var start=Date.now();
    for(var i=0;i<10000;i++){
        for(j=0;j<10000;j++){
            i+j;
        }
    }
    var end=Date.now();
    console.log("中间代码段执行所耗时间为:",end-start+"ms");
    clearInterval(id);
    console.log("然而定时器的代码虽然超时时间设置为0，但是依旧得不到执行");
    console.log("--------------------");

}());


