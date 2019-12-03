


/*
 * 1.一切引用类型都是对象，对象是属性的集合.
 */

function  showType() {
    /*
     * typeof 操作符检测
     */

    console.log(typeof x);// Undefined类型
    console.log(typeof 1);// Number类型
    console.log(typeof "11");//String类型
    console.log(typeof false); //Boolean类型


    console.log(typeof function () {

    });  // function

    console.log(typeof null); // Object类型
    console.log(typeof {}); //Object类型
    console.log(typeof new Number("12")); //Object类型
    console.log(typeof [1,"2",false]);  //Object类型

}

showType();


//函数也是一个对象
var fn=function () {
    console.log(typeof fn);  //function
    //等价的
    console.log(typeof arguments.callee);  //function
};

//因此函数也能自由添加属性。
fn.a="hello"; //可以添加基本属性

//可以将函数作为属性
fn.b=function () {
    console.log(fn+"的b属性，但是本身却是一个:"+typeof arguments.callee);
};
//可以将对象作为属性
fn.c={
    name: "reveur",
    age : 23
};

console.log(typeof fn); // function

//函数是 Function 同时也是 Object
console.log(fn instanceof Function); //true
console.log(fn instanceof Object); //true


//  null 是 基本类型 .但是其typeof 是 object，其instanceof Object 是 false
console.log( typeof null); // object
console.log(null instanceof Object); //false