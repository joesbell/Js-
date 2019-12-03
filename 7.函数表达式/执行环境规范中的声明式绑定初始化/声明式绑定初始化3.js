/**
 * 原理：浏览器中的 window是global对象的实现(window实际引用的是global)。
 * 我们为window添加属性，就等于是在给全局环境的环境记录的绑定对象global对象添加属性，就等于是在全局环境添加变量。
 */


//1.定义一个 foo属性， 等同于声明变量 foo。 因为浏览器中 this=global
Object.defineProperty(this,"foo",{
    value:function () {
        console.log(1);
    },
    configurable:true
});

console.log(Object.getOwnPropertyDescriptor(this,"foo")); //{value: ƒ, writable: false, enumerable: false, configurable: true}

foo(); //1


//2.这里的eval代码段使用的是当前的词法环境作为 变量环境组件和词法环境组件。在执行时，使用的是全局环境的 变量环境组件和词法环境组件。
//而此时即将要执行eval代码体中的代码时，会首先进行声明式绑定初始化。 一一 我们用这种方式来hack 延后的 函数声明。
eval("\n" +
    "function  foo() {\n" +
    "    console.log(2)\n" +
    "}\n" +
    "\n" +
    "foo();"); //2

foo();//2

//3.观察
//可以看到 正如规范所说，如果是在global全局词法环境中，那么这个标识符就是一个属性。
//那么如果原本该属性的特性描述configurable是true，就会以  {writable: true, enumerable: true, configurable:configurableBinding(eval函数中为true，其余为false) ,value:undefined} 重定义该属性。
//最后再调用 SetMutableBinding()绑定新的函数对象到该标识符上。
console.log(Object.getOwnPropertyDescriptor(this,"foo")); //{value: ƒ, writable: true, enumerable: true, configurable: true}


//4.现在修改该属性。
Object.defineProperty(this,"foo",{
    value:function () {
        console.log(1);
    },
    configurable:false
});

//5.这里是 [[definedOwnProperty]]规范方法中提到过的，如果是对共有属性的修改，那么采取有则覆盖，无则保持原有值的原则。 因此这里 enumerable和writable都保持原有值为true
console.log(Object.getOwnPropertyDescriptor(this,"foo")); //{value: ƒ, writable: true, enumerable: true, configurable: false}


//6.而这里则是global环境下属性(函数声明的标识符)configurable为false下的情况了.
// 此时由于只要{writable: true, enumerable: true}，对于数据属性来说，那么 [[CanPut]]就返回true(其实是需要writable为true，这里可以认为是一种针对 标识符的特例)，[[PUT]]方法就可以成功调用了。
eval("\n" +
    "function  foo() {\n" +
    "    console.log(3)\n" +
    "}\n" +
    "\n" +
    "foo();"); //3

foo();//3

//7.由于configurable已经为false不能重定义了，此时就新建一个属性(标识符)。
Object.defineProperty(this,"goo",{
    value:function () {
        console.log(4);
    },
    configurable:false,
    writable:true
});

console.log(Object.getOwnPropertyDescriptor(this,"goo")); //{value: ƒ, writable: true, enumerable: false, configurable: false}
goo(); //4


//7.可以看到,此时重定义是会抛出异常的，完全符合规范。 因为此时 enumerable是false。 不符合 writable和enumerable同时为true的条件。
try{
    eval("function goo() {\n" +
        "        console.log(5);\n" +
        "    }\n" +
        "    goo();")
}catch (e){
    console.error("抛出异常:",e.toString())
}

goo();//4



//8.但是这并不代表真的无法更改了。
//由于浏览器的JS引擎不一定完全按照规范实现，因此可能出现可以修改的情况。

/**
 * 而这里之所以能修改的原因，涉及到的其实是 在 statement里面，对函数声明的处理。
 * 一般而言，我们认为函数是不能在statement语句里面声明的。
 * 不同的浏览器有不同的优化策略，一般而言，对于这种语句都是将 函数声明 当作 函数表达式赋值来处理。
 * 而 = 赋值操作， 对于数据属性来说，只需要 writable为true就可以了。 因此，产生了以下效果。
 */


eval("try{\n" +
    "    function goo() {\n" +
    "        console.log(5);\n" +
    "    }\n" +
    "    goo();\n" +
    "}catch (e){\n" +
    "    console.error(\"抛出异常:\",e.toString())\n" +
    "}");
goo();


//上面的statement语句中函数声明的代码，其实是被当作下面的 函数表达式赋值来处理。
try{
    goo=function () {
        console.log(6);
    }
}catch (e){
    console.error("抛出异常:",e.toString());
}
goo(); //6



