/**
 * 对于call apply bind下的函数调用，this取值一律为指定的对象，如果没有指定对象，那么默认为undefined。
 * 在非严格模式下，默认为undefined的this取值会被替换为全局对象。 但是在严格模式下，依旧为undefined。
 */
var x=1;
var a={x:2};
var b={x:3};
function foo() {
    return this.x;
}

console.log(foo()==1); //1
console.log(foo.call(a)==2); //2
console.log(foo.apply(b)==3); //3
console.log(foo.call(this)==1); //1
console.log(foo.call()==1); //1
console.log(foo.call(null)==1);//1
console.log(foo.call(undefined)==1);//1

/**
 * 而且bind之后返回的函数，this取值是永远不会变的，是被固定了的。
 */
var goo=foo.bind(b);
console.log(goo()==3);//3
console.log(goo.call(this)==3);//3
console.log(goo.call(a)==3);//3;

/**
 * 这里我们再次回顾一下 call apply bind的原理
 */

Function.prototype.call=function () {
    //这里的调用函数就是this  因为是 obj.fn.call
    var method=this;
    //如果是undefined或者null，则使用全局对象
    var thisValue=arguments[0]||window;
    //同时这里需要将基础类型非Object数值转换为对象，因为this取值必须是一个对象，不是对象的会进行强制转型。是对象的则是返回原本对象。
    thisValue=Object(thisValue);

    //这里将该方法放在该对象上。
    thisValue["_call_"]=method;

    //整理实际调用的参数
    var args=[];
    for(var i=1;i<arguments.length;i++){
        args.push("arguments["+i+"]");
    }
    args=args.toString();
    var result;
    //通过eval语句调用。
    eval("result=thisValue['_call_']("+args+")");
    //删除该方法
    delete thisValue["_call_"];
    //返回值。
    return result;
};

Function.prototype.apply=function (thisValue,args) {
    //这里的调用函数就是this  因为是 obj.fn.apply
    var method=this;
    //如果是undefined或者null，则使用全局对象
    thisValue=thisValue||window;
    //同时这里需要将基础类型非Object数值转换为对象，因为this取值必须是一个对象，不是对象的会进行强制转型。是对象的则是返回原本对象。
    thisValue=Object(thisValue);

    //这里将该方法放在该对象上。
    thisValue["_call_"]=method;

    //整理实际调用的参数
    var finalArgs=[];
    if(args){
        for(var i=0;i<args.length;i++){
            finalArgs.push("args["+i+"]");
        }
    }
    finalArgs=finalArgs.toString();
    var result;
    //通过eval语句调用。
    eval("result=thisValue['_call_']("+finalArgs+")");
    //删除该方法
    delete thisValue["_call_"];
    //返回值。
    return result;
};

Function.prototype.bind=function () {
    var method=this; //要绑定的函数
    var thisValue=arguments[0]||window; //绑定函数的this取值
    thisValue=Object(thisValue);
    var args=[]; //处理绑定时的参数
    for(var i=1;i<arguments.length;i++){
        args.push(arguments[i]);
    }

    function bound() {
        var realArgs=[];
        realArgs=args.concat(Array.prototype.slice.call(arguments,0));
        if(this instanceof bound){
            //此时说明是使用的new 构造函数创建对象。
            return method.apply(this,realArgs)
        }
        return method.apply(thisValue,realArgs)
    }


    //这里是为了保证原型链上的继承关系。
    function empty() {
        
    }
    empty.prototype=method.prototype;

    bound.prototype=new empty();

    return bound;

};

console.log(foo()==1); //1
console.log(foo.call(a)==2); //2
console.log(foo.apply(b)==3); //3
console.log(foo.call(this)==1); //1
console.log(foo.call()==1); //1
console.log(foo.call(null)==1);//1
console.log(foo.call(undefined)==1);//1
console.log(Object.prototype.toString.call(8)=="[object Number]");
console.log(Object.prototype.toString.apply(8)=="[object Number]");
console.log(Object.prototype.toString.bind(8)()=="[object Number]");

