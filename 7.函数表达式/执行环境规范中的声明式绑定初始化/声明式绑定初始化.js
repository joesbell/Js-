/**
 * 测试1:  声明式绑定初始化时，对传入函数的实际参数，实际没该位置的参数时，是赋值为undefined。
 * 同时，ECMAScript的函数的参数列表是可以同名的，这意味着，后面的形参值会覆盖前面的形参值。
 */
(function () {

    // 这里 arguments[3]就和arguments[0]同名为arg1，此时后面的传值会覆盖前面的传值
    function foo(arg1,arg2,arg3,arg1) {
        console.log(arg1);

    }

    //因此这里 arg1在函数体内实际值为4.
    foo(undefined,2,3,4);

    //由于没有传入arguments[3]值，因此arguments[3]为undefined，并覆盖arguments[0]传入的值
    foo(1,2,3);

})();


console.log("---------------------------------");

/**
 * 测试2:  声明式绑定初始化时，对于函数声明，如果是在eval代码中声明的函数，该标识符的绑定(变量名)是可以从
 * 词法环境中删除掉的。这是因为 eval 代码的 configurableBindings为true，在创建标识符的可变绑定CreateMutableBinding(标识符名，是否可以删除)时，
 * 其是否可以删除参数为configurableBindings的值，即true。
 */
(function anonymous() {

    //eval代码中的 函数声明创建的标识符绑定是可以被删除的。
    eval("\n" +
        "    function foo() {\n" +
        "        console.log(\"in eval code, func declare can be deleted\");\n" +
        "    };");

    foo();

    //需要注意的是，这里删除的foo是 eval代码执行后 在当前词法环境中新增的foo函数。
    //而由于词法环境没有变为另一个对象，因此，此时的词法环境和变量环境是同一个对象。
    delete foo;

    try{
        foo();
    }catch (e){
        console.log("foo函数声明已经被删除了");
    }

})();



