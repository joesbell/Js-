/*
 typeof 操作符 针对不同类型变量的测试
 */

var a;

// undefined 变量 返回 undefined
alert("变量值为:"+a);
alert("变量类型为:"+typeof a);


//null 变量 返回 object
a=null;
alert("变量值为:"+a);
alert("变量类型为:"+typeof a);


//对象 变量 返回 object;
a=new Object();

alert("变量值为:"+a);
alert("变量类型为:"+typeof a);


//字符串 变量 返回 string
a="字符串";
alert("变量值为:"+a);
alert("变量类型为:"+typeof a);

// 数字变量 返回 number
a=123;
alert("变量值为:"+a);
alert("变量类型为:"+typeof a);

//boolean 变量 返回 boolean
a= true;

alert("变量值为:"+a);
alert("变量类型为:"+typeof a);

// 函数变量  返回 function
function doSomething(){

};

a=doSomething;
alert("变量值为:"+a);
alert("变量类型为:"+typeof a);



