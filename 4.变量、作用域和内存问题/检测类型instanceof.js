

//创建一个字符串类型对象
var a=new Object("hello");

console.log(a+"的typeof是:"+ typeof a);
console.log(a+"instanceof string?"+(a instanceof String));
console.log(a+"instanceof object?"+(a instanceof Object));


//创建一个 Number类型对象
a=new Object(1);
console.log(a+"的typeof是:"+ typeof a);
console.log(a+"instanceof number?"+(a instanceof Number));
console.log(a+"instanceof object?"+(a instanceof Object));


//创建一个 Boolean类型对象
a=new Object(false);
console.log(a+"的typeof是:"+ typeof a);
console.log(a+"instanceof boolean?"+(a instanceof Boolean));
console.log(a+"instanceof object?"+(a instanceof Object));


//需要注意的是 没有Null类型对象和Undefined类型对象。


//同时需要注意一点， 基本类型 instanceof 类型    永远返回 false。 因为基本类型不是对象。

a=false;
console.log(a+"的typeof是:"+ typeof a);
console.log(a+"instanceof boolean?"+(a instanceof Boolean));
console.log(a+"instanceof object?"+(a instanceof Object));