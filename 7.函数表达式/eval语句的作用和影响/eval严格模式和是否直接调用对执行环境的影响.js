/**
 * 非严格模式下的eval直接调用
 */
console.log("非严格模式下的eval直接调用影响");
/**
 * 测试1:在eval代码段中声明的变量，会附加在eval函数所在的执行环境的词法环境中。
 * 对外的作用，也就是可以在 外部词法环境中 新增新的变量声明。而这些新增的变量是可以被delete操作符删除的。
 */
var a=100;
(function () {
    eval("var a=10;"); //在匿名函数的执行环境中新增本地变量a
    console.log(a==10); //10 本地变量a
    console.log(window.a==100); //100 全局变量a
    console.log(delete a==true); //删除eval代码声明的本地变量a
    console.log(a==100); //此时访问到的就是全局变量a
}());


console.log("-------------");

/**
 * 测试2:eval代码可以改变外部词法环境中的变量的值，但是需要注意的是，此时是不能使用 声明语句的，一旦使用声明语句，就会屏蔽对外部词法环境中同名变量的访问。
 */
var b=100;
(function () {
    eval("var b=10;"); //声明本地变量b
    console.log(delete b==true); //eval代码中的声明的变量b是可以被删除的
    eval("b=1000"); //而这里并不是变量声明语句，而是变量赋值语句，在变量b存在的前提下。而在变量b不存在的前提下，这就是在全局对象上初始化属性值。
    console.log(b==1000); //1000， 访问的是全局变量b
    console.log(window.b==1000);//1000 访问的是全局变量b
    console.log( delete b ==false); //显然 全局变量b是无法被删除的。
}());

console.log("-------------");


/**
 * 测试3:eval代码可以改变外部词法环境中的变量的值，需要注意的是，真正的声明是需要使用var标识符的，只是因为浏览器宿主的特殊性，当某个属性不存在时，自动变成在全局对象上添加该属性。
 */
(function () {
    console.log(typeof c =="undefined"); //c变量是不存在的
    eval("c=1000"); //这里是在全局对象上声明一个c属性并赋值。
    console.log(c==1000); //因为浏览器中全局对象同时也是全局环境记录项。因此效果基本等价于变量声明，但是需要注意的是，这个"所谓的变量"一一属性，是可以被删除的。
    console.log(Object.getOwnPropertyDescriptor(this,"c").configurable===true);
    console.log( delete c ==true); //显然 全局变量c是无法被删除的。
    console.log(typeof c =="undefined"); //c变量已经被删除了
}());


console.log("非严格模式下的eval直接调用影响总结完毕");
console.log("-------------");

/**
 * 严格模式下的eval直接调用
 */

console.log("严格模式下的eval直接调用影响");


/**
 * 测试4:eval代码中声明的变量无法被外部执行环境访问。
 */
(function () {
    "use strict";
    eval("var d=10; console.log(d==10);"); //在匿名函数的执行环境中新增本地变量a
    console.log(typeof d =="undefined"); //true,说明外部是无法访问到严格模式下eval代码段中声明的变量的。
}());


console.log("-------------");

/**
 * 测试5:严格模式下eval代码依旧访问并改变外部词法环境中的变量的值，同样需要注意的是，此时是不能使用 声明语句的，一旦使用声明语句，就会屏蔽对外部词法环境中同名变量的访问。
 */
var f=100;
(function () {
    "use strict";
    eval("f=10;console.log(f==10)"); //声明本地变量b
    console.log(f==10)
}());

console.log("-------------");

/**
 * 测试6:严格模式下eval代码，是无法为外部词法环境添加变量声明的。这种行为会抛出ReferenceError异常
 */
(function () {
    "use strict";
    console.log(typeof g =="undefined"); //g变量是不存在的
    try{
        eval("g=1000"); //想要为全局对象添加属性g。 由\[\[PutValue]]规范方法流程可知，在严格模式下，对于没有声明的变量是无法通过除了声明的手段进行声明的。
    } catch (e){
        console.log("在严格模式下,eval代码段是无法通过为全局对象添加属性而达到在全局环境中声明变量的目的的，会抛出ReferenceError异常:",e.message);
    }

}());

console.log("严格模式下的eval直接调用影响总结完毕");
console.log("-------------");


/**
 * 严格模式和非严格模式下的 eval间接调用
 */
console.log("严格模式和非严格模式下的eval间接调用");

/**
 * 测试7:关于间接调用只需要记住一点。间接调用的eval代码使用的词法环境均是全局环境，据此通过分析 词法环境，可以判断代码的执行行为。
 */
(function () {
    "use strict";
    var h=10; //本地变量h
    window.eval("var h=100;"); //声明在全局环境中的变量h
    console.log(h==10); //访问的是本地变量h
    console.log(window.h==100); //访问的是全局变量h
}());

console.log("-------------");

/**
 * 测试8:有一点是非常特殊的， 上面我们曾经提到过，在严格模式下，是无法通过  a=XXX的形式直接声明变量a的。
 *
 * 但是！ 在使用eval间接调用时，却可以无视这条规则。这其实是利用了间接调用eval函数的特性。
 * 这是因为eval代码段作为严格模式运行的方法只有两种：
 * 1.eval代码段以 "use strict"开头
 * 2.在严格模式下直接调用eval语句
 *
 * 而间接调用eval语句，永远是执行的非严格模式代码。
 */
(function () {
    //所以这里尽管开启了严格模式
    "use strict";
    //但是由于是间接调用eval函数，所以eval代码段内部是以非严格模式运行的，因此，可以直接通过 a=xxx的方式，在全局对象上声明属性
    window.eval("m=100; console.log(this==window)");
    console.log(m==100); //访问的是全局变量m
    console.log(Object.getOwnPropertyDescriptor(window,"m"));
}());


console.log("-------------");

/**
 * 测试9:在间接调用eval函数时，eval代码段以"use strict"开头，就能让间接调用的eval代码段以严格模式执行。
 * 此时，测试8中 通过 a=XXX的形式直接声明变量的方法就无效了 会抛出异常。
 */
(function () {
    "use strict";

    (1,eval)("'use strict';" + //这里才是真正标识间接调用eval代码段中以 严格模式执行。
        "try{\n" +
        "        n=0;\n" +
        "    }catch (e){\n" +
        "        console.log(\"间接调用eval中，使用了严格模式后，也是无法不通过var声明变量的\",this==window);\n" +
        "    }");
}());

console.log("严格模式和非严格模式下的eval间接调用总结完毕");