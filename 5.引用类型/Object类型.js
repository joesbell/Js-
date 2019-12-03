/*
* 常规的字面量表示法创建对象如果属性名中包含空格等字符并且不显式地使用字符串属性名格式，那么是会报错的。
*/
// var person={
//     my name:"reveur",
//     age: 23
// };

var person={
    "my name":"reveur",  //必须显式地用 字符串形式 写出变量名
    age:23,
    "5s" :"数字开头的属性只能使用方括号表示法来获取该属性",
    5:"但是纯数字本身是可以作为属性名的，但是存储的依旧是字符串表示的数字"
}

console.log(person);

//对于符合ECMAScript一般标识符命名要求的属性名,两种访问对象属性的方式均可访问。
console.log(person.age,person["age"]);

//对于 以数字开头的属性只能使用方括号表示法
// console.log(person.5);
console.log(person[5]);
console.log(person["5s"]);

//如果 使用 存储属性名的变量来获取对象的属性，只能使用方括号表示法.

var props=Object.keys(person); //获取person的所有 可以迭代的 非继承的 属性名的集合。
var propName;
for(var i=0;i<props.length;i++){
    propName=props[i];
    console.log("属性名:"+propName,"   值:"+person[propName]);
}
