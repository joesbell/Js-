
/*
 * 以下均使用 匿名立即执行函数来模拟全局代码段。
 */

(function(){

    /*
* 下面我们直接来分析一下，执行上下文的情况。
* 首先，在执行下列代码段之时，会生成一个全局执行上下文。
* 1.全局执行上下文：包含了变量a=undefined , bar=undefined,fn=undefined,this=window
*/

    var a=100;  // 2.此时为a赋值为100；
    var bar=function(x){   //3.此时为bar赋值为function，但是并不会 对 函数体进行分析，因为没有执行。只有在执行函数的时候才会生成函数的执行上下文。
        var b=50;
        fn(x+b);
    }
    var fn=function (y) {  //4. 同样为 fn赋值为function
        var c=5;
        console.log(y+c);
    }


    bar(10);
    /*
     *5.此时 进行函数调用了。于是 进入bar所代表的函数中，并生成bar本次调用的执行上下文
     *bar函数的本次执行上下文如下:
     * 变量:b=undefined
     * 参数:x=10,arguments对象为[10]
     * this:window
     * 外部的自由变量fn的取值域: 全局代码段。
     * 随后开始执行 并更新 b=50
     * 当执行到 fn(x+b)时，进入fn所代表的函数中，并生成fn在本次调用时的执行上下文.
     *
     * 6.fn函数的执行上下文如下:
     * 参数 :y=10+50=60 ,arguments对象 [60]
     * 变量 :c=undefined;
     * this:window
     * 随后执行 并更新 c=5;
     * 然后再输出 60+5=65
     * 调用完毕，销毁本次执行上下文。
     *
     * 7.随后bar函数也执行完毕，bar生成的执行上下文也被销毁。
     * 8.最后全局代码段执行完毕，全局执行上下文被销毁。
     */
}());



(function() {
    eval("console.log(a);");
    var a=10;
}());
// 运行打印出undefined，这说明在eval表达式生成其自己的执行上下文的时候，能够获取其所属代码段的执行上下文环境并使用。


(function() {
    eval("var a=10;");
    console.log(a);
}());
// 运行打印出10，这说明在eval表达式在执行完毕后，其内部的声明的变量会添加到eval表达式所在代码段的全局上下文中。(也可以添加，参看下面)

(function() {
    var a=20;
    eval("var a=15;");
    console.log(a);
}());
//打印出15， 说明eval表达式的执行可以更新所在代码段的全局上下文。

(function(){
    console.log(a);
    eval("var a=10;");
}());
//运行抛出异常。这说明，全局代码段在在生成执行上下文的时候，并没有解析eval表达式的内容，而仅仅只是将其当作一句普通的代码。