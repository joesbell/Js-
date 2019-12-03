/*
 * 1.在进行 arguments标识符绑定时，函数形参可以让Arguments对象无法绑定。
 */
(function () {
    //由于函数形参中已经有了 "arguments"这个标识符绑定，因此在函数体内部的Arguments对象我们再也无法通过 arguments来访问到了。
    function foo(arguments) {
        console.log(arguments);
    }
    foo(1);
})();

console.log("--------------------");

/**
 * 2.同样的 在进行arguments标识符绑定时，函数体内部的函数声明可以让Arguments对象无法绑定。
 */
(function () {


    //在这个情况下，foo函数中， 变量环境组件中是具有 arguments这个标识符绑定的，并将其绑定在了一个函数对象上。
    //因此，此时在真正执行foo函数时，arguments会执行这个foo函数体内部声明的函数。
    function foo() {
        console.log(arguments);


        //也许你会天真的认为,arguments函数声明放在foo同级的位置上， 也会将foo函数内部的 arguments标识符占据。
        //因为按照一般的非规范经验，也就是定义函数时位置决定了变量的取值作用域链，arguments最终会引用外部arguments函数。因此得出和本例结果相同的结论。然而这是错误的。
        //参看第3个实验
        function arguments() {
            console.log("函数体内部函数命名为arguments")
        }
    }

    foo(1);

})();

console.log("---------------------");


/**
 * 3.首先用实验3和实验4一起来说明一个我们常见的普通的例子。
 * 针对var声明
 */
(function () {
    var goo="goo外部变量";

    function foo() {
        //在这个例子中，我们往往说的是，由于foo函数体中没有声明goo变量，因此此时会根据scope chain 作用域链来寻找这个goo，最终在foo函数体外部作用域中找到了 goo变量的值。
        //这也是函数中 变量的取值域 是由在何处定义的决定，而不是在何处调用时决定的结论。
        console.log(goo);
    }

    foo();
})();


console.log("---------------------");

/**
 * 4.实验4同实验3. 针对函数声明。
 */
(function () {
    function goo() {
        console.log("this is goo");
    }

    function foo() {
        console.log(goo);
    }

    foo();
})();

console.log("---------------------");

/**
 * 5.然而这是不全面的。只有通过规范才能解释以下内容。
 *
 * 这是非常特殊的例子，也是非常直观的直指整个声明式绑定初始化流程的规范的例子。
 * 只有理解了规范，才能理解这个行为.
 *
 * 当在作用域链上寻找的变量的变量名为arguments时，经验性的不严密的 理论就不起作用了。
 */
(function () {


    function arguments() {
        console.log("函数体外部函数命名为arguments")
    }


    //根据规范:函数的执行环境中，词法环境组件和变量环境组件都是一个新的声明式词法环境，该词法环境的外部引用指向外部词法环境。
    //据此，在foo函数中，我们可以明确的知晓: foo函数的 执行环境中根本没有 arguments这个函数声明的标识符绑定。
    //但是，根据声明式绑定初始化，如果在arguments标识符没有被函数声明和形参占用的情况下，会自动绑定arguments标识符到Arguments对象上。
    //因此，在声明式绑定初始化后，foo函数的执行环境中其实是有 arguments这个绑定的。
    //在执行期间，进行标识符解析，由于foo函数自身的词法作用域中就具有arguments标识符绑定，因此也不会再去外部词法环境中寻找arguments变量的值了。
    //这就是为什么 arguments和其他变量名(标识符名)表现不同的原因。arguments这个标识符名是一个特例，被词法环境占用来作为Arguments对象的绑定标识符。而这不读规范是根本无法理解的。
    //在这里也说明了，标识符解析更确切的应该称作是 标识符求值，这是一个在运行期进行的动作。
    //经验上的 函数中的变量取值是由定义时的位置决定的这个结论 。
    //其实在规范里就是 位置关系决定了 内部词法环境和外部词法环境引用的关系，运行时的标识符解析(变量取值)就是沿着 词法环境及其外部引用(加起来就是作用域链)获取标识符绑定(变量值) GetIdentifierReference的过程。
    function foo() {
        console.log(arguments);
    }

    foo(1); //这里打印出的是 Arguments对象，而不是外部声明的arguments函数。

})();


