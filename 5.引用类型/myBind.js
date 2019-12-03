/*
* 我们这里来自己探究并实现这个 bind函数。
*/



//1.首先我们需要明白是,传入bind()函数的参数分别是 this对象的值，和默认参数。
function myBind(){

    //参数处理开始
    var thisArgs=arguments[0]||window; //这就是传入的对象
    thisArgs=Object(thisArgs);
    var defaultParams=Array.prototype.slice.call(arguments,1);//剩余的参数就是默认参数

    //还需要知道的是， 此时 this就是调用者函数。
    var targetFunction=this; //targetFunction就是我们要绑定的函数。

    //参数处理完毕

    //2.其次，我们需要明白的是，返回的是一个新的函数实例。因此我们肯定需要一个函数。

    //开始处理函数
    function bound(){
        //3.这个函数的特点就是，普通调用时的this取值是固定的。返回值是原本函数在这个固定取值下的执行结果。并且，还可以传递参数。
        //同时还需要注意一点，bind后的函数如果使用new 创建的对象应该是返回原本构造函数创建出的对象，此时this取值就应该是bound的实例了。

        //4.准备工作:我们需要拼接传入参数了： 传入参数=默认参数 + 调用时的参数
        var realParams=defaultParams.concat(Array.prototype.slice.call(arguments,0));
        // console.log(realParams);

        //5.这里开始判断，到底是普通调用函数还是使用new新建一个对象.
        //当new创建对象时，传入bound中的this的值肯定是 bound的 实例。
        if(this instanceof bound ){
            // console.log("创建对象");
            //返回 原本函数构造函数创建的对象。
            return targetFunction.apply(this,realParams);

        }else {
            // 当是普通调用时，目标函数的调用的this的取值是由传入myBind()的参数决定的。
            return targetFunction.apply(thisArgs,realParams);
        }
    }

    //为了让new bound() 是继承自原本 目标函数的。
    //我们这里使用原型链，并通过一个空的引用类型做缓冲，来隔绝对bound的原型属性的修改而可能造成的对目标函数的影响。
    function empty(){

    }
    empty.prototype=targetFunction.prototype;
    bound.prototype=new empty();



    //最后我们只需要返回这个函数即可。
    return bound;
}


function getColor(){
    return this.color;
}

var color="Red";

var sky={
    color:"blue"
};

Function.prototype.myBind=myBind;
var skyMethod=getColor.myBind(sky);
console.log(skyMethod());
console.log(new skyMethod() instanceof getColor);

console.log("---------------");

//默认参数问题。观察结果就知道了
function listArgs(){
    console.log(Array.prototype.slice.apply(arguments,[0]));
}

listArgs(1,2,3);

listArgs.myBind(this,1,2,3).myBind(this,4,5,6).myBind(this,7,8,9)(10);


console.log("--------------");

/*
关于多次绑定为什么结果中的this取值只算第一次的原因。

比如有个 函数 foo;
foo.bind(a).bind(b).bind(c); 执行时之所以 this取值是a的原因如下:

foo.bind(a)中。 返回的是bound1函数，目标函数是foo，thisArg取值a
foo.bind(a).bind(b)中。 返回的是bound2函数，目标函数是bound1,thisArg取值是b
foo.bind(a).bind(b).bind(c)中。 返回的是bound3函数，目标函数是bound2,thisArg取值是c

可以看到的是，除了第一次绑定，后续的绑定都是影响的 运行 目标函数bound函数时的thisArg取值 。
但是bound函数中的thisArg取值有用吗？有，当且仅当 目标函数为 foo时才有用！只有这时候才会影响 foo函数调用的结果。
其他情况下，唯一的作用只是影响一下 bound执行时 this的取值罢了。
(因为调用target.apply(thisArg); 此时target是bound，thisArg是 b或者 c，执行时，只是影响bound中的this)
而这恰好是最没用的。
因为 bound执行时 this的唯一作用只是判断 是正常调用函数 还是 new 创建新对象。

一句话总结：目标函数foo的绑定this早就确定好了，在第一次绑定时。
后续的绑定只是在绑定 bound函数调用。而bound的this对象的唯一作用只是判断是正常调用还是new创建对象，若是普通调用，
是会将目前的 thisArg交给上层的函数作为this使用的。

当然，参数还是会生效保留的。
*/

function addList(){
    this.addedList=Array.prototype.slice.apply(arguments,[0]);
}

var a={};
var b={};
var c={};

addList.myBind(a,1,2,3).myBind(b,4,5,6).myBind(c,7,8,9)(10);

console.log(a);
console.log(b);
console.log(c);