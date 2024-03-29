
//以匿名立即执行函数来模拟全局执行环境
(function(){

    /*
     * 这里逐步分析整个执行过程。从而明白 执行上下文， 自由变量， 作用域的结合。
     */


    /*
     * 1.准备执行全局代码段之时，首先确定全局代码段的执行上下文环境.
     * 变量：a=undefined,fn=function ,bar=undefined.
     * this:window
     */
    var a=10;
//2.执行完毕后，全局执行上下文中的 a=10;

    function fn(){

        //4.执行完这句后， fn的执行上下文中 b=20；
        var b=20;

        //5.这里并不会生成这个匿名函数的执行上下文，因为该匿名函数当前并没有执行。
        return function(x){
            console.log(a+b+x);
        }
    }

    /*
     *3.在进入fn之前，首先生成fn的执行上下文。
     * 变量:b=undefined
     * 参数:无 ，arguments对象[]
     * this:window
     */

    var bar=fn();
//6.执行完毕后，全局上下文的bar=function；

    /*7.在执行bar(10)之前，首先生成bar函数的执行上下文:
     * 变量:无
     * 参数:x=10 ,arguments对象[10]
     * this:window
     * 自由变量:a b均未在该匿名函数中声明，因此是自由变量，根据自由变量的规则，其取值域由创建函数时决定，因此回到
     * 匿名函数作用域，并按照作用域链以此向外部寻找自由变量所在的作用域。
     * 自由变量的取值域：b:fn函数的作用域。 a:全局作用域。
     * 自由变量的取值: fn函数的执行上下文中现在b取值是20.  全局作用域的执行上下文中现在a取值是10.
     *
     * 开始执行，并打印 a+b+x=10+20+10=40;
     */
    bar(10);

//8.执行完毕后，全局执行上下文中 a=35.
    a=35;

    /*7.在执行bar(20)之前，再次生成bar函数的执行上下文:(函数的每一次执行都会重新生成执行上下文)
     * 变量:无
     * 参数:x=20 ,arguments对象[20]
     * this:window
     * 自由变量:a b均未在该匿名函数中声明，因此是自由变量，根据自由变量的规则，其取值域由创建函数时决定，因此回到
     * 匿名函数作用域，并按照作用域链以此向外部寻找自由变量所在的作用域。
     * 自由变量的取值域：b:fn函数的作用域。 a:全局作用域。
     * 自由变量的取值: fn函数的执行上下文中现在b取值是20.  全局作用域的执行上下文中现在a取值是35.
     *
     * 开始执行，并打印 a+b+x=20+20+35=75;
     */
    bar(20);

}());


console.log("--------错误认知的示例---------");

//下面再演示一种错误的认知：即认为 自由变量的取值是由调用时的代码位置的所在作用域向外部作用域寻找的。

(function(){
    var a=10;
    function fn(){
        console.log(a+b);
    }

    function foo(){
        var b=10;

        /*
         * 错误的认知会认为，在此时返回fn函数时，会根据当前的代码位置所在的foo作用域向外寻找fn函数的自由变量的取值域。
         * 因此会得到:
         * 自由变量 a的取值作用域是全局作用域。
         * 自由变量 b的取值作用域是foo函数的作用域。
         *
         * 但是，实际上，fn函数的自由变量的取值作用域早就在 函数声明 的时候决定了。
         * 正确的结论是：
         * 自由变量 a的取值作用域是全局作用域。
         * 而变量b在 fn函数作用域内以及全局作用域中都没有声明，因此不存在，整段代码会报错！
         */
        return fn;
    }

    var bar=foo();
    //要想代码不报错，必须在全局代码段中添加 变量b。
    var b=10;
    bar();
}());


console.log("--------函数中声明全局变量的示例---------");
// 在演示一种更细微的区别: 函数中声明了 全局变量。


(function(){
    var a=10;
    function fn(){
        console.log(a+b);
    }

    function foo(){
        /*
         * 这里与错误示例的唯一区别就是 b前面没有 var
         * 而在foo函数的作用域链上又没有声明过 变量b，因此这段代码不是赋值，而是声明了一个全局变量b并初始化赋值。
         * 由于此时 b被声明为了全局变量。因此效果基本等同于 错误示例的改正。
         * 当然略有不同的是，此时连最外部的全局代码段都可以访问 变量b了。
         *
         * 而我们使用函数立即执行来模拟全局代码段的原理，其实是根据函数可以创建作用域，函数执行会生成执行上下文的原理来实现的。
         * 但是我们需要知道的是， 作用域不能限制对 全局变量的访问，因此，我们的这个 全局声明是具有穿透性的。
         * 所以这也是最好不要在函数体内 声明全局变量 的原因。 为了防止以外的变量出现在全局环境中。
         */
        b=10;
        return fn;
    }
    var bar=foo();
    bar();
}());

console.log("--------全局变量的穿透性---------");
console.log(b); //证明穿透性