/**
 * 变量对象和活动对象的 静态 初始化规则:
 * 1.优先初始化函数参数。
 * 2.其次是function函数声明，并且函数声明可以覆盖函数参数的初始化。
 * 3.最后是var变量声明，不能覆盖前面执行过的任何初始化，如果前面没有初始化，那么初始化赋值undefined。
 */
(function(){

    function foo(x,y) {
        //静态初始化时， AO中 x为1，y为undefined。
        console.log("x:",x,",y:",y);

        //var变量声明不会在最初的静态初始化时覆盖任何变量。
        var x=10;
        console.log("x:",x,",y:",y);
    }

    foo(1);

})();

console.log("-------------");

(function(){

    function foo(x,y) {
        //静态初始化时，首先是函数形参初始化，此时 AO中 x为1，y为undefined。
        //随后发现function函数声明，会覆盖之前的同名变量初始化。此时 AO中 x为function对象，y为undefined
        console.log("x:",x,",y:",y);

        //var变量声明不会在最初的静态初始化时覆盖任何变量。
        var x=10;
        console.log("x:",x,",y:",y);

        function x(){
            console.log("x函数");
        }
    }

    foo(1);

})();