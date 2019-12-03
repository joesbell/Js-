/**
 * BOM中作为全局对象的window对象 具有以下特点。
 */

//声明的变量无法删除
var a=10;
console.log(Object.getOwnPropertyDescriptor(window,"a").configurable===false);
console.log(delete a ===false);

//全局对象上声明的属性可以删除
window.b=10;
console.log(Object.getOwnPropertyDescriptor(window,"b").configurable===true);
console.log(delete b ===true);

//eval代码段中声明的变量可以删除
eval("var c=10;");
console.log(Object.getOwnPropertyDescriptor(window,"c").configurable===true);
console.log(delete c ===true);


//访问不存在的属性时. 普通的变量访问会报错

try{
    console.log(d);
}catch (e){
    console.log("普通的变量访问不存在的变量会抛出错误:",e.message);
}

//而使用全局对象访问不存在的属性只会返回undefined
console.log(window.d==undefined);
