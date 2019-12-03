

//可以为对象动态的 添加和删除属性
var person=new Object();
console.log("添加前:"+person.name);
person.name="reveur";
console.log("添加后:"+person.name);
delete person.name;
console.log("删除后:"+person.name);

//但是基本类型不具有这一特点。
person ="基本类型";
console.log("添加前:"+person.name);
person.name="reveur";
console.log("添加后:"+person.name);
delete person.name;
console.log("删除后:"+person.name);

