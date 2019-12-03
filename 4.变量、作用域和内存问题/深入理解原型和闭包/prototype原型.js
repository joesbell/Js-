//函数Fn
function Fn() {

}


var fn=new Fn();


//初始的时候 函数原型只有一个属性 constructor指向函数本身。
console.log(Fn.prototype.constructor===Fn);

//此时肯定是不存在的
console.log(fn.a); //undefined


//原型上添加属性
Fn.prototype.a="reveur";

console.log(fn.a); //reveur

//原型上添加方法

Fn.prototype.getAge=function () {
    return 23;
}


console.log(fn.getAge()); //23

