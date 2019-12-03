var message; //定义了一个变量，这个变量未初始化，因此 默认赋值是 undefined;

var message2= undefined; //效果等同上一句。

var message3="hi"; // 在message3中保存 字符串 “hi” ，但是这并不说明 message3是个字符串类型数据，因为是松散型变量。
message3=123;  //因此这一段代码是有效的。

/*
 * var 定义的变量都是局部变量。
 * 如果在函数中使用var 定义变量，那么当函数流程结束后，变量就会被销毁。其作用域只在函数内部。
 */

function doSomething(){
    var localVar="hi"; //局部变量 ，作用域在函数内部。
    alert(localVar);
}

alert(localVar); //因此这里就会出错，因为没有 localVar这个变量。

/*
 * 与局部变量相反， 全局变量是可以直接定义的。 但是不能使用 var操作符。
 */
function doSomething2(){
    globalVar ="hi"; //这就是全局变量，作用于在整个脚本文件中。当这段语句执行后，全局变量就被定义了。
}
doSomething2(); //必须执行后 这个全局变量才有定义。
alert(globalVar);