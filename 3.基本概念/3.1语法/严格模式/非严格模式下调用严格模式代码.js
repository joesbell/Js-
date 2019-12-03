/**
 * 在非严格模式下，有以下调用严格模式代码的方法。
 */
(function () {
    try{
        arguments.callee;
        console.log("非严格模式",this==window ===true);
    }catch (e){
        console.log("严格模式",this==undefined ===true)
    }
}()); //非严格模式 true


/**
 * 第一种方法，调用非严格模式代码段中函数体内代码以"use strict"开头的函数
 */
function foo() {
    "use strict";
    try{
        arguments.callee;
        console.log("非严格模式",this==window ===true);
    }catch (e){
        console.log("严格模式",this==undefined ===true)
    }
}

foo(); //严格模式 true

console.log("-------------------");


/**
 * 第二种方法，直接或间接调用eval代码，eval代码段中以"use strict"开头
 */

(function () {

    //直接调用
    eval("'use strict';" +
        "    try{\n" +
        "        a=10;\n" +
        "    }catch (e){\n" +
        "        console.log(\"严格模式\",this==window)\n" +
        "    }");//严格模式 true

    //间接调用
    (1,eval)("'use strict';" +
        "    try{\n" +
        "        a=10;\n" +
        "    }catch (e){\n" +
        "        console.log(\"严格模式\",this==window)\n" +
        "    }");//严格模式 true
    /**
     * 这里有个非常需要注意的一点，严格模式并不代表this指向undefined。这一点在 严格模式与this.js会详细说明。
     */

}());

console.log("-------------------");

/**
 * 第三种方法，调用严格模式函数代码
 */
(function () {
    // 严格模式下声明的函数
    eval("'use strict';" +
        "function foo() {\n" +
        "    try{\n" +
        "        arguments.callee;\n" +
        "        console.log(\"非严格模式\",this==window ===true);\n" +
        "    }catch (e){\n" +
        "        console.log(\"严格模式\",this==undefined ===true)\n" +
        "    }\n" +
        "}\n" +
        "foo();");//严格模式 true

    //非严格模式下， 函数体内部以"use strict"开头的严格模式函数
    (1,eval)(
        "function foo() {" +
        "    'use strict';\n" +
        "    try{\n" +
        "        arguments.callee;\n" +
        "        console.log(\"非严格模式\",this==window ===true);\n" +
        "    }catch (e){\n" +
        "        console.log(\"严格模式\",this==undefined ===true)\n" +
        "    }\n" +
        "}\n" +
        "foo();");//严格模式 true
}());




