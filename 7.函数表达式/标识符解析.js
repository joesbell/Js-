/**
 * 对于标识符解析，这里我们首先采用with语句下的标识符解析来更好的说明其情况。
 *
 * 第一条核心: ECMAScript的标识符解析 永远只解析第一个 . 号之前的字符串内容。
 */
(function () {
    var a={};
    a.b={};
    var b={};
    b.c={};
    b.c.d="b.c.d";
    /**
     * 执行到这里。
     * 执行环境的词法环境组件和变量环境组件的内容如下:
     * a -> {b:{}}
     * b -> {c:{d:"b.c.d"}}
     */
    with(a){
        /**
         * 这里词法环境的变更不做赘述。
         *
         * 开始解析标识符。
         * 我们不妨假设如果 ECMAScript中解析的标识符是 "b.c.d" ，也就是说确保 "b.c.d"在某个obj下是有值的。那么 当前执行环境的词法环境中是肯定不满足的。
         * 因为在 词法环境中 a->{b:{}} 只满足了 obj.b是存在的。
         * 反而变量环境中的确存在 b->{c:{d:"b.c.d"}}保证了 "b.c.d"标识符 对应一个存在的值。
         * 因此这里 解析到的值应该对应的是 "b.c.d" 这个字符串。
         */
        eval("function foo() {\n" +
            "        console.log(b.c.d)\n" +
            "    }\n" +
            "    ");
    }

    try{
        foo(); //这里应该打印 "b.c.d" , 然而实际上，是抛出异常的TypeError: Cannot read property 'd' of undefined，也就是说，假设不成立。 从而明白，标识符解析永远只解析 第一个.前面的字符串内容。
    }catch (someException){
        console.log("try语句中抛出了"+someException.name+"异常","内容为:"+someException);
    }

})();

console.log("-----------");

/**
 * 加强的第二点，一个陷阱。
 * ECMAScript中并没有规定不准使用 . 作为标识符的组成部分。
 * 而包含 .的标识符名 是无法通过 普通的 .表示法访问到的。解析的时候也是这样。
 *
 */
(function () {
    var a={};
    a["b.c"]="a[b.c]";
    a.b={c:"a.b.c"};

    //可以看到，普通的点表示法解析时，是死板地以.分割获取标识符。因此， 包含.的标识符是永远不可能通过 点表示法访问到的。
    console.log(a.b.c);
    //只有通过这种方式才能访问到
    console.log(a["b.c"]);

    with (a){
        //而在解析时，也是参考第一条核心原则， 解析的是"b"这个标识符。
        eval("\n" +
            "        function foo() {\n" +
            "            console.log(b.c);\n" +
            "        }");
    }
    foo();//因此输出的是 "a.b.c"
})();