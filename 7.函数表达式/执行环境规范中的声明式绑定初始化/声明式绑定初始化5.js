/**
 * arguments标识符的相关操作.
 */


/**
 * 1.无论是严格模式还是非严格模式，arguments对象的自身属性都是可以修改的。
 */
(function () {
    function foo() {
        console.log(arguments);
        arguments[1]="argument1";
        console.log(arguments);
    }

    foo()
})();

(function () {
    "use strict";
    function foo() {
        console.log(arguments);
        arguments[1]="argument1";
        console.log(arguments);
    }

    foo()
})();

console.log("---------------------------");


/**
 * 2.在非严格模式下，arguments标识符的指向是可以修改的。而在严格模式下不行，会直接抛出SyntaxError错误。
 */
(function () {
    function foo() {
        console.log(arguments);
        arguments="指向新的对象";
        console.log(arguments);
    }

    foo(1)
})();

(function () {
    "use strict";
    function foo() {
        console.log(arguments);
        // arguments="指向新的对象";  SyntaxError是语法解析错误。说明严格模式下不能修改指向。
        // 关于语法错误再说一点，语法错误是无法try catch捕捉的。 try catch捕捉的是运行时的错误和异常，而语法错误是在代码解析阶段。
        console.log(arguments);
    }

    foo(1);
})();

console.log("---------------------------");

/**
 * 3.无论在严格模式下还是非严格模式下 arguments标识符均是不可删除的
 */
(function () {
    function foo() {
        console.log(arguments);
        console.log("是否可以删除arguments",delete arguments);
        console.log(arguments);
    }

    foo(1)
})();

(function () {
    "use strict";
    function foo() {
        console.log(arguments);
        // console.log("是否可以删除arguments",delete arguments); 解析时语法错误。 关于语法错误再说一点，语法错误是无法try catch捕捉的。 try catch捕捉的是运行时的错误和异常，而语法错误是在代码解析阶段。
        console.log(arguments);
    }

    foo(1);
})();

console.log("---------------------------");