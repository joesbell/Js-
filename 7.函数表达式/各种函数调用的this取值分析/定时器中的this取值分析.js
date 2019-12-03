/**
 * 定时器 setTimeout 和 setInterval的回调函数中的this取值永远指向全局对象。 不管是否是严格模式。
 *
 * 需要注意的是，定时器中的回调函数代码执行在 跟执行定时器函数的环境 完全不同的执行环境上。 在这个执行环境中，this绑定只会指向到window或者全局对象上。
 */


(function () {
    setTimeout(function () {
        console.log(this==window,"外部环境为非严格模式时")
    },1000)
}());

(function () {
    "use strict";
    setTimeout(function () {
        console.log(this==window,"外部环境为严格模式时")
    },1000)
}());

(function () {
    setTimeout(function () {
        "use strict";
        console.log(this==window,"回调函数为严格模式时")
    },1000)
}());

(function () {
    setTimeout(function () {
        console.log(this==window,"回调函数为非严格模式时")
    },1000)
}());

var obj={
    a:"对象的属性a",
    method:function () {
        console.log(this.a);
    }
};

setTimeout(obj.method,1000); //undefined。 可以看到由于这个原因，在定时器中执行这个函数，结果中this.a=window.a=undefined

//对此，想要把真正的this传入，可以通过包裹一个外部函数来为 实际调用的函数确定this取值。
setTimeout(function () {
    console.log("使用外部函数包裹解决这个问题")
    obj.method(); //在这里 this取值就被确定了。
},1000);

//或者，我们通过bind函数来强行绑定函数的this取值到某个对象上来实现。
setTimeout(obj.method.bind(obj),1000);

/**
 * 定时器函数同样接受 字符串作为参数，此时字符串会在执行时解析，被当作一个函数的函数体内容。在这个字符串中的this，取值也是全局对象。
 */
setTimeout("console.log(this==window,'参数作为字符串传入定时器，字符串中的this依旧是指向window')",1000);
