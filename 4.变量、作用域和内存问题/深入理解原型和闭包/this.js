//依旧使用 匿名立即执行函数来模拟全局代码段。

function Fn(){
    this.a=10;
    console.log(this);
}


// new创建新对象时,this指向的是创建出来的那个对象。
(function(){
    var fn=new Fn();
    console.log(fn);
    console.log("--------------");
}());



// 当构造函数当成普通函数调用时，this指向的其实是其调用者对象，没有显式指明的情况下，this就是window
(function(){
    var fn=Fn();
    console.log(fn); //undefined
    console.log(a);//10
    console.log("--------------");
}());


// 当函数是被对象调用时，this指向的是调用者对象。

(function(){
    var obj=new Object();
    obj.myMethod=Fn;
    obj.myMethod(); //此时是obj调用函数，因此this指向的是obj
    console.log(obj.a);
    console.log("--------------");
}());

// 当使用函数的自带方法apply/call时，调用者对象就是apply/call方法指定的对象。
(function(){
    var obj=new Object();
    obj.myMethod=Fn;
    var o1={name:"o1"};
    var o2={name:"o2"};

    //此时就算前面指明了调用者对象，但是由于使用了函数的call/apply方法，
    //因此原本的函数调用者obj会被忽略，只当是用来指明被调用的函数是obj对象的myMethod
    obj.myMethod.call(o1);
    obj.myMethod.call(o2);
    console.log("--------------");
}());


//再说一下原型上的函数。 原型上的函数的this取值依旧是作为 普通函数调用来确定 调用者this的取值的。
(function(){
    Fn.prototype.goo=function () {
        console.log(this);
    }

    var fn=new Fn();
    fn.goo(); //此时调用者是 fn, fn的goo函数是通过原型链找到的。

    Fn.prototype.goo(); //Fn函数的原型对象也可以直接调用这个方法。此时调用者是 Fn.prototype
}());

