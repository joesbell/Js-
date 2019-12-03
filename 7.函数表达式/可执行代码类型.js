/*
 * 我们首先要明确一点 什么是函数体代码.
 *  一个函数声明往往是这样的
 *
 *  function关键字 函数名标识符( 参数列表){
 *      函数体代码
 *  }
 *
 *
 * 因此，ECMAScript总共有三种可执行代码:
 *
 * 全局代码 ： 全局代码指的是 不包含 函数体的部分。
 *
 * 函数代码 :  函数代码 指的是函数体内部的不包含嵌套的函数体的部分。
 *
 * eval代码 : eval代码指的是传入eval函数的字符串部分。
 */



var a=10; //全局代码
var max=10; //全局代码


function foo(){ //全局代码

    var b=20; //foo函数体代码

    function bar(){ //foo函数体代码

        var c=30;  //bar函数体代码

    }

    bar(); //foo函数体代码
}

foo(); //全局代码

eval( //全局代码.
    "var d=40;" //eval代码
);


