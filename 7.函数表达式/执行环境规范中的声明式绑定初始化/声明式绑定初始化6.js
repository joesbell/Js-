/**
 * 这里再讲一个只能通过ECMAScript规范解释的代码。
 *
 * 同时这里也能更好地说明 声明式绑定初始化是在代码执行之前的解析阶段进行的而不是代码实际执行时进行的。
 */


/**
 * 首先我们要清楚的第一件事是，在eval代码段中声明的变量和函数是可以被delete的。因为其configurableBindings为true。
 * 而eval函数执行时，内部的词法环境组件使用的是外部的词法环境组件，内部的变量环境组件使用的也是外部的变量环境组件。
 */

//下面进行分析。
function bar() {
    //因此，这里执行完毕后，看似声明了一个arguments变量名。
    eval("var arguments='arguments'");
    console.log(arguments);//这里打印arguments是没有疑问的。
    console.log("是否删除成功:",delete arguments);//由于可以删除，因此看似这里会删除成功.
    try{
        console.log(arguments);//因此这里看似应该抛出异常。
    }catch (e){
        console.log(e.name)
    }
}

/**
 * 然而实际上。是不正确的。 这里最重要的就是要区分 以下概念。
 * 1. 词法环境组件 和 变量环境组件。
 * 2. 代码解析时 和 代码执行时。
 * 3. 声明式绑定初始化发生在代码 解析时， 并且作用于变量环境组件。声明式绑定初始化后，词法环境组件和变量环境组件内容一致。
 *    而变量环境组件在整个执行环境的生命周期内是不会改变的。代码执行时，改变的是词法环境组件。
 *
 * 这里在创建bar函数的执行环境时，是不会看到eval函数代码里面的内容并执行的。
 * 因此，此时bar函数的执行环境的 变量环境组件里，会自动创建一个arguments标识符的绑定并绑定在Arguments对象上，这个绑定是不可删除的。词法环境组件于此相同。此时。解析阶段结束。进入执行阶段。
 * 在执行阶段，进入eval代码。此时词法环境中已经含有了 arguments标识符绑定。因此实际上 var arguments='arguments'等同于 arguments='arguments'.只是对标识符重新赋值罢了。
 * 所以,该标识符依旧是不可以删除的。
 */
bar();

console.log("--------------------");

function bar2() {
    eval("var foo='foo';");
    console.log(foo);
    console.log("是否删除成功:",delete foo);
    try{
        console.log(foo)
    }catch (e){
        console.log(e.name)
    }

}

/**
 * 而在这里就完全不同了。
 * 在bar2执行环境创建之时，声明式绑定初始化进行，而变量环境组件中根本就没有foo这个标识符一一因为foo既不是函数形参，也不是函数声明，更不是变量声明。
 * 因此，初始词法环境组件中也不会存在foo这个标识符绑定。
 * 此后执行阶段，eval函数中会在词法环境组件及变量环境组件新建一个foo的标识符绑定，但是该标识符绑定是可以删除的，因为其configurableBindings为true。
 * 变量环境组件中foo=undefined,词法环境组件中foo='foo'。
 */
bar2();





