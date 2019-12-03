
/*
 * 模拟 instanceof 操作符的函数
 */
function myInstanceOf(obj,func){
    //如果参数传入，抛出异常
    if(obj===undefined||func===undefined){
       throw new ReferenceError("参数未传入");
    }

    //判断 右操作数类型
    if(typeof func !=="function"){
        throw new TypeError("右边操作数必须是函数");
    }

    //判断左边操作数是否是 引用类型
    if (typeof obj !=="object" && typeof obj !=="function"){
        return false;
    }else if(obj===null){
        return false;
    }

    var rightPrototype=func.prototype; //函数的原型
    var leftProto=obj.__proto__;//对象的隐式原型


    //寻找原型链上的关系
    while(leftProto!=null){
        if(rightPrototype===leftProto){
            return true;
        }
        leftProto=leftProto.__proto__;
    }
    return false;

}


console.log(Object instanceof Function);
console.log(myInstanceOf(Object,Function));
console.log("\n");

console.log(Function instanceof Function);
console.log(myInstanceOf(Function,Function));
console.log("\n");

console.log(Function instanceof Object);
console.log(myInstanceOf(Function,Object));
console.log("\n");

console.log(Object instanceof Object);
console.log(myInstanceOf(Object,Object));
console.log("\n");

console.log(myInstanceOf("1",Object));
console.log("1" instanceof Object);
console.log("\n");

console.log(myInstanceOf(null,Object));
console.log(null instanceof Object);
console.log("\n");

console.log(myInstanceOf(Number,Object));
console.log(Number instanceof Object);
console.log("\n");

console.log(myInstanceOf(Number,String));
console.log(Number instanceof String);
console.log("\n");

function Foo(){

}

function Goo(){

}

//原型上的 继承关系
Foo.prototype=Goo.prototype;


var foo=new Foo();

console.log(myInstanceOf(foo,Goo));
console.log(foo instanceof Goo);
console.log("\n");


Number.__proto__=Goo.prototype;

console.log(Number instanceof Goo);
console.log(myInstanceOf(Number,Goo));
console.log(Number.__proto__);
console.log("\n");



//需要注意的是，自带的函数是不能修改其某些属性的。 比如prototype属性
// Object.defineProperty(Number,"prototype",{
//     configurable: true,
//     writable:true
// })

Number.prototype=Goo.prototype;//无效
console.log(Number.prototype===Goo.prototype); //false
console.log(new Number("1") instanceof Goo); //因此返回false
console.log(myInstanceOf(new Number("1"),Goo)); //因此返回false
console.log("\n");


var a=new Number("1");
//但是这样可以，因为 a是我们自己创建的对象实例。我们可以修改其属性。
a.__proto__=Goo.prototype;
console.log(a instanceof Goo);
console.log(myInstanceOf(a,Goo));
console.log("\n");


//这是肯定true的 因为 Goo.prototype.__proto__===Object.prototype;
console.log(foo instanceof Object);
console.log(myInstanceOf(foo,Object));
console.log("\n");



foo.__proto__=null;
console.log(foo instanceof Object);
console.log(myInstanceOf(foo,Object));





console.log("--------------")

var parentPrototype={};

//可以看到这个并不是函数而是一个对象
var parent={};

parent.prototype=parentPrototype;
//就算我们将其隐式原型设置为Function.prototype也不会成为函数对象。
//因为 函数对象和普通对象的判别是通过内部规范属性 [[Call]]存在与否进行判断的。
//而只有真正的函数对象才具有 [[HasInstance]]规范属性的实现。其 instanceof 操作才会正确。
parent.__proto__=Function.prototype;

var child={};
child.__proto__=parentPrototype;
//因此 虽然这里 child.__proto__===parentPrototype===parent.prototype。但是由于 parent并不是一个真正的函数对象，没有实现[[HasInstance]]规范属性，
//因此，返回false。
console.log(child instanceof parent ===false);
console.log(typeof parent!=="function");
