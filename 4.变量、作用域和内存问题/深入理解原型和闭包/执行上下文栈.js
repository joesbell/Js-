/*
 * 这里只是简单的分析下执行上下文栈的情况。
 * 因为执行上下文栈的普通执行流程是非常简单的。
 * 真正的难点是在闭包的情况下的执行上下文栈的分析。
 */

(function(){
    /*
    * 1.全局代码段执行之前，首先会生成全局代码段的执行上下文环境。
    * 变量: myname=undefined,myage=undefined，enterNameAndAge=function
    * this: window
    *
    */
    var myname="reveur";
    var myage=23;
// 2.执行这两句代码后， 全局执行上下文为myname="reveur",myage=23
// 此时 执行上下文栈中只有 全局执行上下文

    function enterNameAndAge(name,age){
        var result="";
        //4.执行完毕后,enterNameAndAge的执行上下文栈中 result="";
        function enterName(){
            var result;
            result="我的名字是:"+name+",";
            //6.执行完后 enterName函数的执行上下文中 result=结果字符串；
            return result;
        }

        function enterAge(){
            var result;
            //8.执行完后 enterAge函数的执行上下文中 result=结果字符串；
            result="我的年龄是:"+age+".";
            return result;
        }

        /*
         * 5.执行enterName之前，生成enterName函数的执行上下文栈
         * 变量:result=undefined;
         * 参数:无
         * 自由变量取值域： name 取值域是 enterNameAndAge的作用域。
         * 自由变量取值： name="reveur"
         * this:window
         *
         * 此时执行上下文栈中有3个 执行上下文: 1.全局的 2.enterNameAndAge函数的。 3.enterName函数的
         */
        result+=enterName(name);
        /*
         * 7.执行完毕后， enterName函数的执行上下文被销毁。
         * 此时执行上下文栈中有2个 执行上下文: 1.全局的 2.enterNameAndAge函数的。
         *
         * 准备执行enterAge函数。因此再次生成enterAge函数的执行上下文。
         * 变量:result=undefined;
         * 参数:无
         * 自由变量取值域： age 取值域是 enterNameAndAge的作用域。
         * 自由变量取值： age=23
         * this:window
         *
         * 此时执行上下文栈中有3个 执行上下文: 1.全局的 2.enterNameAndAge函数的。 3.enterAge函数的
         */
        result+=enterAge(age);
        /*
         * 9.执行完毕后， enterAge函数的执行上下文被销毁。
         * 此时执行上下文栈中有2个 执行上下文: 1.全局的 2.enterNameAndAge函数的。
         */
        return result;
    }

    /* 3.准备执行 enterNameAndAge之前，首先会生成一个新的执行上下会栈。
        变量：result=undefined,enterName=function,enterAge=function
        this:window
        参数:name="reveur",age=23,arguments对象["reveur",23]

        没有自由变量。

        此时执行上下文栈中有2个 执行上下文: 1.全局的 2.enterNameAndAge函数的。
     *
     */
    console.log(enterNameAndAge(myname,myage));
    /*
       * 10.执行完毕后， enterNameAndAge函数的执行上下文被销毁。
       * 此时执行上下文栈中有1个 执行上下文: 1.全局的
       */

    console.log("----------普通的执行上下文栈过程演示完毕----------");

    /*
     * 11.全局代码段执行完毕。 因此 全局执行上下文被销毁。
     * 此时， 执行上下文栈 为空。
     */
}());



//这是使用了闭包的情况。 可以看到这里与普通的执行上下文栈的唯一区别。
// 普通的执行上下文流程中，函数返回的均是一个 不是函数的 值。
// 而在闭包的情况下，函数返回的依旧是一个函数。
(function(){
    var name="Reveur";
    var age=23;

    function enterNameAndAge(name,age){
        var result="";
        function enterName(){
            var result;
            result="我的名字是:"+name+",";
            return result;
        }

        function enterAge(){
            var result;

            result="我的年龄是:"+age+".";
            return result;
        }

        //这是唯一的区别，返回的是一个函数！
        return function () {
            return enterName()+enterAge();
        };
    }
    console.log(enterNameAndAge(name,age)());

    console.log("----------闭包的演示----------");

}());