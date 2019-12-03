// x y z 是函数的参数
function foo(x,y,z){
    console.log("开始执行foo函数");
    /**
     * 在函数的执行过程中 。
     * 此时 函数的活动对象AO不仅有 普通的变量对象的 变量声明 函数声明，还有 Arguments对象
     */
    console.log(arguments);

    // console.log(Object.getOwnPropertyDescriptor(arguments,"callee"));

    //这是 var变量声明
    var m = 100;
    console.log("当前AO的拥有者函数对象是:",arguments.callee.name);
    console.log("当前真实传入的参数个数:",arguments.length);
    console.log("第三个参数",z);
    bar();
    //这是 function 函数声明
    function bar(){

        console.log("开始执行bar函数");
        /**
         * 可以看到不同函数执行中，AO对象是不同的，因此Arguments对象也是不同的。
         */
        console.log(arguments); // {}
        console.log("bar函数的调用者函数对象是:",arguments.callee.caller.arguments.callee.name);
        console.log("当前AO的拥有者函数对象是:",arguments.callee.name);
        console.log(m);
    }
    console.log("---------------------");

    return arguments;
}

var temp = foo.arguments;
console.log(temp===null);//true  此时 函数都没有被调用，因此函数的AO是没有被激活的，作为AO一部分的Arguments对象自然是null
console.log("开始执行函数");

var temp2 = foo(1,2,3);
var temp3 = foo(1,2);

/**
 * Arguments对象伴随着函数AO对象的激活而新建，伴随AO对象的销毁而销毁。
 */
console.log(temp2);
console.log(temp3);
console.log(temp2===temp3); //false. 因此这里不是两个相同的对象。




