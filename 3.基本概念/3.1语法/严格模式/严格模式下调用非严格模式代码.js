/**
 * 在严格模式下，有以下调用非严格模式代码的方法。
 */

"use strict";
(function(){
    try{
        arguments.callee;
        console.log("非严格模式",this==window ===true);
    }catch (e){
        console.log("严格模式",this==undefined ===true)
    }
}()); //严格模式

console.log("-------------------");

/**
 * 1.通过间接调用eval函数执行非严格代码。
 */
(function () {
    (1,eval)("a=10;");//原本在严格模式在不能直接声明全局属性的，现在可以了
    console.log(a==10);//true
    (1,eval)("console.log(delete a);");//原本在严格模式下不能删除变量的。现在在非严格模式下可以了
    console.log( typeof a == "undefined" );
}());


console.log("-------------------");

/**
 * 2.通过调用 Function构造函数创建的 非严格模式函数对象。
 */
(function () {
    var fn=new Function("a=10");
    fn();
    console.log(a==10);
    fn=new Function("console.log(delete a)");
    fn();
    console.log(typeof a =="undefined");
}());

console.log("-------------------");

/**
 * 3.通过在非严格模式下声明函数，并调用该非严格模式下函数
 */
(function () {
    //通过间接调用eval函数达到在非严格模式下声明函数的目的。
    (1,eval)("function fn() {\n" +
        "        a=10;\n" +
        "    }");
    fn();
    console.log(a==10);

    (1,eval)("\n" +
        "    function fn() {\n" +
        "        console.log(delete a)\n" +
        "    }");
    fn();
    console.log(typeof a =="undefined");
}());

console.log("-------------------");
