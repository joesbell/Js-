/**
 * 测试1:严格模式下，对 未初始化的全局对象属性(基值为undefined) 进行赋值PutValue操作时，会抛出ReferenceError异常
 */

(function () {
    try{
        (function () {
            "use strict";
            //开启严格模式
            a="123";  //此时进行  PutValue(a,"123")
            console.log(a);
        }());
    }catch (e){
        console.log("严格模式下,未初始化的全局对象属性 赋值为抛出ReferenceError异常");
    }

}());

/**
 * 测试2：非严格模式下，对 未初始化的全局对象属性(基值为undefined) 进行赋值PutValue操作，会进行的是 全局对象.[[Put]]方法操作。
 */
(function () {
    b="现在，这是在新增全局对象上的属性了";
    console.log(b)
}());

/**
 * 测试三：对于基值为Object的引用赋值。
 */
(function () {
    var obj={};
    obj.prop="现在，这是普通Object对象上的属性赋值了";
    console.log(obj.prop);
}());


/**
 * 测试四：非严格模式下,对于基值为String,Number,Boolean的  数据属性 引用赋值。
 */
(function () {
    var a=123;
    console.log(a.toString===Number.prototype.toString);//true
    a.toString=123;
    //在这种情况下，由于toString是在Number原型上，而Number原型上的toString属性的configurable为true，因此其[[CanPut]]为true。
    console.log(Object.getOwnPropertyDescriptor(Number.prototype,"toString"));
    //此时，获取 a的包装类型对象上的 toString，明显的，是没有这个属性的，因此再次根据父类的toString属性特性进行判断，由于是数据属性，因此会根据是否为严格模式抛出TypeError异常。
    //这里不是严格模式，因此是直接返回，所以这里 a.toString=123;执行后没有任何改变。
    console.log(a.toString);
    console.log(a.toString===Number.prototype.toString);
}());

/**
 * 测试五：在严格模式下，对于基值为String,Number,Boolean的 数据属性 引用赋值。
 */
(function () {
    "use strict";
    var a=123;
    console.log(a.toString===Number.prototype.toString);//true
    try{
        a.toString=123;
    }catch (e){
        console.log("抛出异常:",e.message);
    }
}());

/**
 * 测试六：对基值为String，Number,Boolean的 访问器属性 引用赋值
 */
(function () {
    "use strict";
    var a=123;
    //可以看到，在浏览器中，__proto__属性是Object上的访问器属性，被所有对象继承访问。
    console.log(Object.getOwnPropertyDescriptor(Object.prototype,"__proto__"));
    //此时，同样在 a的包装类型中间对象上没有__proto__属性，因此这是继承属性，由于该属性是访问器属性，因此永远都不会抛出TypeError异常。
    //对于这些访问器属性来说，PutValue操作就是对 以这个中间对象为this，调用父类对象的该属性的setter方法，参数为 我们所赋的值。
    a.__proto__=1;
    //对于这条赋值语句来说，就是 类似于调用  __proto__的setter方法.call(ToObject(a),1);
    //对a依旧是没有任何影响的。
    console.log(a.__proto__);
}());

/**
 * 测试七:针对测试六，这里用一种更好的实践来说明 基值为String，Number,Boolean的 访问器属性 引用赋值 与 父类的setter方法  这种关系。
 */
(function () {
    "use strict";
    var localVar="localVar";

    //这里在Number原型上定义了一个访问器属性。
    Object.defineProperty(Number.prototype,"myAccessMethod",{
        set:function (w) {
            localVar=w;
        },
        get:function () {
            return localVar;
        },
        configurable:false,
        enumerable:true
    });

    var a=123;
    console.log(a.myAccessMethod);//这里就是在调用访问器属性的getter方法
    //这里就是在调用访问器属性的setter方法， 可以理解为 调用Number.prototype.myAccessMethod的setter方法.call(a,1);
    a.myAccessMethod=1;
    console.log(a.myAccessMethod);//这里直观地能看到发现了改变。
}());