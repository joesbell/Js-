

//通过函数可以创建对象。
function Person() {
    this.name="reveur";
    this.age=23;
}

var p=new Person();


//一切对象都是函数创建的。看似不是函数创建的只是使用了 语法糖 隐藏了真实的情况。底层依旧是通过函数创建。

var a={
    score: 100,
    width: 10
};// 字面量创建对象，看似没有使用函数创建。

console.log(a);
//但是其本质如下

a=new Object();
a.score=100;
a.width=10;
console.log(a);


var b=[1,2,3]; //字面量创建 数组，看似没有使用函数创建这个数组对象。
console.log(b);
//然而本质等同于

b=new Array();
b[0]=1;
b[1]=2;
b[2]=3;
console.log(b);

//我们再来看看我们用过的 这两个Object和Array 是什么。 是函数。

console.log(Array+"\ntypeof:"+typeof Array);
console.log(Object+"\ntypeof:"+typeof Object);


