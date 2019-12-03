


var obj=new Object();

console.log(obj.__proto__);

//对象实例的隐式原型指向 创建对象的函数的原型
console.log(Object.prototype===obj.__proto__);


function Foo() {

}

// 函数的原型也是一个对象，所以也具有隐式原型，这个原型是Object函数创建出来的！
console.log(Foo.prototype.__proto__===Object.prototype);

console.log(Function.prototype.__proto__===Object.prototype);


//但是 Object的原型的隐式原型是指向 null 的。
console.log(Object.prototype.__proto__===null);


//函数本身也是一个对象，因此也有其 隐式原型。 需要知道的是，函数是由Function函数创建的.
console.log(Foo.__proto__===Function.prototype);
//甚至连 Object函数都是 由 Function函数创建的。
console.log(Object.__proto__===Function.prototype);



//而Function函数本身也是一个对象，因此其隐式原型指向 Function的原型 。由此 构成了一个环形结构。

console.log(Function.__proto__===Function.prototype);

//这也是 一切对象的 最终原型 肯定会指向 Object的原型， Function的原型也不例外.
console.log(Function.prototype.__proto__===Object.prototype);