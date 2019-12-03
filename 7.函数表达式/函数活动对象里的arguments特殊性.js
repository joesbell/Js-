// x y z 是函数的参数
function foo(x,y,z){
    console.log("开始执行foo函数");
    //这里之所以为null的原因是因为 此时temp依旧是指向原本的那个null对象，而 foo.arguments现在已经在底层通过CreateArgumentsObject抽象方法
    //被重新指向了一个新的对象。 因此 temp和foo.arguments指向的并不是同一个对象。这是非常特殊的底层实现。
    //Arguments对象被底层每次创建出来之后才是不可更改和重写的。 但是底层是可以更改函数的arguments属性所指向的Arguments对象的。
    console.log(temp===foo.arguments);//false
    //这是 var变量声明
    var m = 100;
    console.log("当前AO的拥有者函数对象是:",arguments.callee.name);
    console.log("当前真实传入的参数个数:",arguments.length);
    console.log(z);
    bar();
    //这是 function 函数声明
    function bar(){
        console.log("开始执行bar函数");
        console.log("bar函数的调用者函数对象是:",arguments.callee.caller.arguments.callee.name);
        console.log("当前AO的拥有者函数对象是:",arguments.callee.name);
        console.log(m);
    }
    console.log("---------------------");
}

var temp=foo.arguments; //temp指向的的确是arguments对象，此时由于没有调用函数，因此arguments对象并没有创建，因此为null。
console.log(temp===null);
console.log("开始执行函数");


/**
 * { value: null,
 *   writable: false,
 *   enumerable: false,
 *   configurable: false
 *   }
 *   虽然 arguments属性所指向的伪数组对象的确是不可重写不可重定义的，但是，这只是对于用户而言。在底层实现中，其实是可以更改的。
 *
 *   引用ES5规范原话：
 *   Arguments 对象通过调用抽象方法 CreateArgumentsObject 创建，调用时将以下参数传入：func、names、args、env、strict。
 *   将要执行的函数对象作为 func 参数，
 *   将该函数的所有形参名加入一个列表，称为 names 参数，
 *   将所有传给内部方法 [[Call]] 的实际参数，称为 args 参数，
 *   将该函数代码的变量环境称为 env 参数，
 *   将该函数代码是否为严格代码作为 strict 参数
 *
 *   因此，后面就很好解释了。
 */
console.log(Object.getOwnPropertyDescriptor(foo,"arguments"));
foo(1,2,3);
foo(1,2);


