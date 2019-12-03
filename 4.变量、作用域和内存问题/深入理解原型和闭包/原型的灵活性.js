

//自定义的对象类型
function Foo(name,value){
    this.name=name;
    this.value=value;

}

var foo=new Foo("reveur","价值");

//可以看到，此时输出的并不是非常地有意义的输出，这些方法是继承自Object.prototype的。
console.log(foo.toString());
console.log(foo.valueOf());


//但是我们可以为其构造函数的prototype原型对象添加属性方法
Foo.prototype.valueOf=function () {
    return this.value;
};

//或者是通过实例的隐式原型__proto__添加属性方法
foo.__proto__.toString=function () {
    return this.name;
}

console.log(foo);
console.log(foo.toString());
console.log(foo.valueOf());

//从此只要是 Foo构造函数创建出来的 对象实例，都可以正确地继承这两个属性。

var goo=new Foo("mike","mike的价值");
console.log(goo);
console.log(goo.toString());
console.log(goo.valueOf());

//对实例进行delete是无效的。因为实例本身就没有这个属性，这个属性是在原型对象上的，是实例继承过来的。
delete goo.valueOf;
console.log(goo.valueOf());

//真想删除继承属性，必须对原型对象进行操作。 但是这就意味着对原型进行修改，会影响到继承该原型的所有对象实例的该属性。

delete goo.__proto__.valueOf;

//所有的对象实例都受到了影响
console.log(foo.valueOf());
console.log(goo.valueOf());