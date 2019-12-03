(function(){

//函数有一个非标准 数据类型属性 name，其值为函数名。
    function foo(){
        console.log("1")
    }

    console.log(foo.name);//foo

//可以看到，函数的name属性的writable属性是false的。
//函数的name属性可以说是在定义函数时就确定了。
    console.log(Object.getOwnPropertyDescriptor(foo,"name"));

    var goo=foo;

//我们也不能说 name属性的值就是变量名本身的字符串值。
    console.log(goo.name);//foo ， 而不是goo

    foo= function foo(){ //这里，不同引擎有不同的解释方式。如果使用匿名函数表达式的话,其name不一定是foo了,可能是空字符串。比如谷歌浏览器。
        console.log("2");
    };


    //但是我们不能说name相同的函数，就是同一个函数。
    console.log(foo.name);
    console.log(goo.name);
    console.log(foo===goo);//false

    //这就是匿名函数，匿名函数的 name属性是 空字符串
    (function(){
        console.log(arguments.callee.name==="");
    }());

    //而这就是命名函数表达式， 其name值是 命名时的字符串
    (function bar(){
        console.log(arguments.callee.name==="bar");
    }());


}());

console.log("----------递归----------");

(function(){

    //这就是一个递归函数 只不过函数和函数名具有强耦合
    function factorial(num){
        if(num<1){
            return 1;
        }
        return num*factorial(num-1);
    }
    console.log(factorial(5));
    //正常使用
    var anotherName=factorial;
    console.log(anotherName(5));

    //但是由于其耦合性，导致一旦对原本函数名重新赋值， 递归函数也会出现问题。
    factorial=function () {
        return 0;
    };
    console.log(anotherName(5));


    //为此 有两种解决办法。

    //1.使用 arguments.callee 来表示函数本身，而不是使用函数名。
    factorial=function(num){
        if(num<1){
            return 1;
        }
        return num*arguments.callee(num-1);
    };

    console.log(factorial(5));
    anotherName=factorial;
    factorial=null;
    console.log(anotherName(5));
    //但是需要注意的是这种方法，只有在非严格模式下才能使用。在严格模式下是不能访问 arguments.callee属性的。
    //此时就需要另一种方式了。


    //2. 使用命名函数表达式
    var f=100;

    factorial=function f(num){
        if(num<1){
            return 1;
        }

        return num*f(num-1);
    };

    console.log(factorial.name); //f
    console.log(factorial(5));
    anotherName=factorial;
    factorial=null;
    console.log(anotherName(5));



    console.log(f);//可以看到， 命名函数表达式的变量名并不会影响到外部的同名属性。
    //我们可以说， 命名函数表达式的命名的作用域范围只在命名函数表达式中.
    //因此，我们在任何模式下使用 命名函数表达式来 解除 函数体和函数名的耦合。


}());