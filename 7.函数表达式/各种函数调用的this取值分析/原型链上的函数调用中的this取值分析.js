/**
 * 原型链上的函数调用的this取值，其this值为方法的调用对象本身。
 * 其本质和普通的函数调用没有任何区别。
 *
 */

//下面是运用组合继承实现了 bar继承foo。
function foo() {

}
foo.prototype.protoMethod=function () {
    this.a=100;
    console.log(this);
};
function bar() {

}
bar.prototype=new foo();
bar.prototype.constructor=bar;

var barInstance=new bar();
barInstance.protoMethod();
console.log(barInstance.hasOwnProperty("a")===true); //可以看到 原型链上的函数中的函数体中this取值是 实际调用对象。


console.log("-----------------");

/**
 * 其实在原型链上的 访问器属性也是这样。
 * 对于原型链上访问器属性中的 get set方法中的this，只要在[[CanPut]]返回true时，其set get函数体内的this取值是访问者对象自身。
 */
Object.defineProperty(foo.prototype,"accessorData",{
    set:function (value) {
       this.selfData=value;
    },
    get:function () {
        return this.selfData;
    },
    enumerable:true
});

barInstance.accessorData=10;
console.log(barInstance.accessorData===10);
console.log(barInstance.selfData===10);
barInstance.accessorData=20;
console.log(barInstance.accessorData===20);
console.log(barInstance.selfData===20);

console.log("-----------------");

/**
 * 最后，如果是原型本身调用自身的方法或者访问器属性，函数体内的this取值也是原型自身。
 * 这是毫无疑问的。
 * 总的来说，以上全部例子都在说明一个道理，原型链上的函数调用以及访问器属性调用 本质上和 普通的函数调用没有任何区别。
 * 函数体内的this取值都是调用者对象。
 * 或者规范地说，是 执行callExpression表达式时， MemberExpression成员表达式解释执行获取规范引用类型后，规范引用类型的基值，就是this取值。
 * foo.prototype.accessorData baseValue:foo.prototype
 * foo.prototype.protoMethod baseValue:foo.prototype
 * barInstance.protoMethod baseValue:barInstance
 */

foo.prototype.accessorData=10;

console.log(foo.prototype);

foo.prototype.protoMethod();


console.log("-----------------");

/**
 * 为了证明上述观点，我们可以这样实验。
 */


//这里由于MemberExpression解释执行后已经不是引用规范类型了 ，因此this取值为undefined，由于在严格模式下，函数调用自动设置undefined的this取值为全局对象，
//因此，最后的执行结果，在 全局对象上 添加了 a 这个属性。
(1,barInstance.protoMethod)();
console.log(window.a==100);
