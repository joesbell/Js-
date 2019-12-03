/**
 * ECMAScript本身并不具有块级作用域，因此需要使用其他方式来模拟。
 * 具体来说，有两种方式：
 * 1.立即执行函数的 函数作用域 进行模仿
 * 2.eval函数的 严格模式下的eval作用域 进行模仿
 *
 * 我们往往是使用函数作用域来进行模仿。
 */


/**
 * 这里证明并没有块级作用域
 */
for(var i=0;i<10;i++){
    console.log(i);
}

console.log("变量没有隔离",typeof i =="number");
console.log("----------------");


/**
 * 利用立即执行函数的函数作用域来模仿块级作用域
 */
console.log("利用函数作用域模仿。");

(function () {
    for(var j=0;j<10;j++){
        console.log(j);
    }
}());

console.log("变量隔离了吗:",typeof j =="undefined");
console.log("----------------");

/**
 * 利用严格模式的eval代码的eval作用域模仿块级作用域
 */
console.log("利用严格模式的eval代码的eval作用域来模仿。")

eval("'use strict';" +
    "for(var j=0;j<10;j++){\n" +
    "    console.log(j);\n" +
    "}");
console.log("变量隔离了吗:",typeof j =="undefined");
