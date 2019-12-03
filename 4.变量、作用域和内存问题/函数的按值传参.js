


//由于是按值传递，因此 内部的变量发生的改变是不会影响到外部变量的。
function addNum(num){
    num+=10;
}

var num=0;
console.log("基本类型传参后前是:"+num);
addNum(num);
console.log("基本类型传参后值是:"+num);


function setName(person){
    person.name="reveur";
}


//虽然是按值传递，但并不代表变量所代表的数据不会改变。对于基本类型来说，数据是不变的，因为基本类型是纯粹复制值。
//但是对于对象来说，复制的只是对象在内存中的地址，不会改变的是对象的地址。但是对象本身的数据却是可以通过使用引用来改变的。
var person=new Object();
console.log("对象传参前name属性是:"+person.name);
setName(person);
console.log("对象传参后name属性是:"+person.name);




function setName2(person){
    person.name="reveur";
    //这句代码的实际作用只是将局部变量的值设置为一个对象的地址罢了。并不会改变原有的对象。 这个新建的对象会在函数执行完毕后被销毁。
    person=new Object();
    person.name="改变";
}

person=new Object();
console.log("对象传参前name属性是:"+person.name);
setName2(person);
console.log("对象传参后name属性是:"+person.name); //依旧是 reveur
