/**
 * 在讲解构造函数中this取值分析之前，我们先讲讲 new 构造函数调用的过程。
 */

//比如说这样一个构造函数
function foo() {
    //1.在构造函数的第一步.可以说是在没有执行函数体代码之前，构造函数创建的新对象的对象的隐式原型就已经指向了函数的原型了。
    console.log(Object.getPrototypeOf(this)===foo.prototype);//true

    //2.随后，就是执行函数体内部的代码。 进行一些操作。 比如说增加属性什么的。
    this.x=10;


    //3.最后，如果没有没有return语句，那么自动返回创建出来的对象
    //如果有return语句返回的是基本类型非Object类型数据，那么依旧是返回创建出的对象。
    //但是，如果手动 return 一个对象，那么就会返回该对象。
    return 3;
}

var a=new foo();
console.log(a instanceof foo  ===true);

console.log("-------------------");
/**
 * 因此我们可以从上面的输出得出结论，在 new 构造函数调用的时候，构造函数内部的this永远指向的是新创建的对象。
 */

function goo() {
    this.a=10;
    return {a:11}; //此时是主动返回一个对象。
}

console.log(new goo().a ==11); //因此，这里a等于11.
console.log(new goo() instanceof goo ===false);//同时这个返回的对象并不是goo的实例。


console.log("-------------------");

var barProto=bar.prototype;
function bar() {
    bar.prototype=null;
    console.log(Object.getPrototypeOf(this)===barProto);
    console.log(Object.getPrototypeOf(this)===Object.prototype);
}

/**
 * 这里首先输出的是 true false， 这也证明了，在执行构造函数函数体代码之前，创建的对象的隐式原型就已经被指定了。
 * 所以尽管在函数体内将函数的prototype设置为null，依然不影响首次创建的对象的隐式原型是 barProto
 */
new bar();

/**
 * 第二次输出的是 false true。
 * 这里是一个需要额外注意的一点，当函数的原型设置为null之后，构造函数创建的对象的隐式原型并不是null而是Object的原型。
 * 要想真正的让创建的对象的隐式原型指向null 必须在构造函数中手动 设置 this.__proto__=null 这才是有效的。
 */
new bar();