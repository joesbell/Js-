

/*
 * 三种创建函数对象的方式。
 * 函数对象均是 Function引用类型的实例。
 */
var sum=new Function("num1","num2","\"Function构造函数创建函数对象:\"+(num1+num2)");

sum=function(num1,num2){
    return "函数表达式式:"+(num1+num2);
}

function sum(num1,num2){
    return "函数声明式:"+(num1+num2);
}

//由于声明提升，所以函数表达式才是最后执行的一次函数对象赋值。
console.log(sum(10,10));



// 函数中的特殊属性
function foo(){
    console.log("this:",this);
    console.log(arguments[0]+arguments[1]);
}

foo(100,10);

//使用 arguments.callee去除 函数名耦合。

function factorial(num){
    if(num<=1)
    {
        return 1;
    }
    //如果这里依然使用  factorial(num-1)，那么当下面执行 factorial=null 后，调用是会出错的。
    // 但是一旦使用 arguments.callee 指向该函数自身，那么就去除了函数名的耦合。
    return num* arguments.callee(num-1);
}

var myFactorial=factorial;
factorial=null;
console.log(myFactorial(5));


//使用 caller属性获取 本函数的函数

function outer(){
    inner();
}
function inner() {
    console.log("调用inner函数的函数是:",inner.caller);
    console.log("在全局调用时,返回null。此时是否在全局直接调用呢：",arguments.callee.caller==null);
    //当然 更好的写法是 arguments.callee.caller 去除与 inner函数名的耦合。
}

outer(); //经由一个函数调用
inner(); //全局中调用



// 函数对象的 实例属性
console.log(Object.getOwnPropertyNames(inner)); //返回一切非继承实例属性
console.log(Object.keys(inner)); //返回一切可枚举的非继承实例属性

console.log(inner.hasOwnProperty("name"));
console.log(inner.hasOwnProperty("length"));
console.log(inner.hasOwnProperty("prototype"));


// 继承自Object的方法
console.log(outer.toLocaleString());
console.log(outer.toString());

console.log(outer.valueOf()==outer);


var color="Red";

var sky={
    color:"blue"
};

function getColor(){
    return this.color;
}

console.log(getColor()); //全局中的color
sky.getColor=getColor;
console.log(sky.getColor());//sky对象中的color

//更方便的改变this取值的方式.apply或者call
console.log(getColor.apply(this));
console.log(getColor.call(sky));

//如果使用bind会创建一个新的函数实例，单独只绑定某个对象。
var skyMethod=getColor.bind(sky);
console.log(skyMethod());
//多次bind是无效的，只会认第一次绑定的对象。
console.log(skyMethod.bind(this)());