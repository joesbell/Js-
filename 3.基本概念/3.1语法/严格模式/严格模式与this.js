/**
 * 在研究 严格模式和this之前，我们首先需要明白一点，严格模式和函数调用中的this的联系是什么。
 * 先简单地说明一下函数调用时this取值如何决定，并且这里只说一种我们要研究的情况，即声明的函数直接调用。
 * 首先解释执行 函数调用表达式，发现 函数名的这个标识符的引用规范类型的基值是环境记录项，由此this绑定就为该环境记录想的ImplicitThisValue()的返回结果，
 * 除了with这种特殊语句内的函数调用，该函数ImplicitThisValue()的返回值往往都是undefined。 至此，函数调用时的this绑定就决定了。
 *
 * 再然后，就是跟严格模式发生关系的时候了，函数创建执行环境时，会根据是否为严格模式对undefined的this绑定采取不同的处理：
 * 如果为非严格模式，自动将其this绑定变为全局对象。
 * 否则为严格模式，this绑定不变，依旧为undefined。
 *
 * 现在我们再来看以下代码，用以上理论进行逐步分析。
 *
 */

//首先分析直接调用eval函数，此时对于 eval函数来说，外部环境是非严格模式，因此根据函数调用的规则，eval函数内部的this绑定是全局对象。
eval("'use strict';" + //随后，进入严格模式下执行代码，但是此时this绑定是已经被选定了的。 这个道理就跟在 严格模式下的全局代码中，this也是等于全局对象一样。
    "    try{\n" +
    "        a=10;\n" +
    "    }catch (e){\n" +
    "        console.log(\"严格模式\",this==window)\n" + //所以，这里说白了，不管是不是严格模式，this都是等于window的，这在eval函数调用时就决定了其 this绑定了。
    "    }");//严格模式 true

eval("console.log(this==window)"); //非严格模式下，依旧是这样。


//间接调用eval函数，this绑定，词法环境，变量环境，都会被限制为全局对象。 不管eval代码段是否是严格模式代码段，在调用eval函数时，其this绑定就永远是全局对象了。
(1,eval)("'use strict';" +
    "    try{\n" +
    "        a=10;\n" +
    "    }catch (e){\n" +
    "        console.log(\"严格模式\",this==window)\n" +
    "    }");//严格模式 true

//为了证明上述所说的间接调用的正确性，我们这里在 严格模式下间接调用eval函数，如果eval代码段中的this取值为undefined，那么说明传入间接调用eval函数的this绑定为undefined。
(function () {
    "use strict";
    (1,eval)("console.log(this==window)");//true 。然而事实上， 间接调用eval函数的this绑定的确被限定了。
    eval("console.log(this==undefined)"); //true 。反观直接调用，的确传入的this绑定就是undefined,并没有将undefined转化为全局对象。
}());

/**
 * 其实容易混淆的是以下情景:在严格模式代码段内部中 执行普通代码和执行函数代码。
 * 我们需要明白的是:
 * 代码段内部执行普通代码时，this绑定是由当前代码段所在函数被调用时的提供的。
 * 代码段内部执行函数代码时，this绑定是由当前代码段提供的。
 * 一一这里主要说的是严格模式与否，因为是调用声明的函数，this绑定默认都是undefined，最终this绑定的值是由严格模式决定的。
 */


/**
 * 这里内部是普通代码执行，所以这里的this取值是由eval函数的this绑定决定，而这取决于eval是否直接调用和外部是否是严格模式代码。
 * 对于这段代码来说， 是直接调用并且外部是非严格模式，所以this绑定为全局对象。
 */
eval("\"use strict\";\n" +
    "try{\n" +
    "    a=10\n" +
    "}catch (e){\n" +
    "    console.log(\"严格模式\",this==window);\n" +
    "}");

/**
 * 这里内部是函数代码执行，所以内部声明的函数调用的this取值是由eval代码段内部的严格模式决定的，因为eval代码段为严格模式，
 * 所以undefined不会自动转化为全局对象，所以这里的this绑定就是undefined
 */
eval("\"use strict\";\n" +
    "function foo() {\n" +
    "    try{\n" +
    "        a=10;\n" +
    "    }catch (e){\n" +
    "        console.log(\"严格模是\",this==undefined);\n" +
    "    }\n" +
    "}\n" +
    "foo();");