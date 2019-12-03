/*
 * 我们用
 * LexicalEnvironmentsObject={
 *  outerLexicalEnvironment:
 *  currentEnvironmentRecord:
 * }
 * 的结构来表示 词法环境对象.
 *
 * 我们需要明白的是，词法环境是静态的！
 * 也就是说， 我们在写好了JS代码后，词法环境就被确定了下来，而不会因为执行而改变。
 */
var a=10;

var bindingObj={x:100};

function foo(){

    var b=20;

    function bar(){
        var c=30;

        console.log(a,b,c);
    }

    bar();

    with(bindingObj){
        console.log(x);
    }
}

foo();

/*
 * 那么对于这段代码来说，总体是分为3个词法环境的。
 *
 * 1.全局词法环境
 * globalLexicalEnvironmentObject={
 *  outerLexicalEnvironment: null
 *  currentEnvironmentRecord: 起着全局变量对象的作用
 * }
 *
 * 2.foo词法环境
 *
 * fooLexicalEnvironmentObject={
 *  outerLexicalEnvironment: globalLexicalEnvironmentObject
 *  currentEnvironmentRecord: 起着foo函数活动对象的作用
 * }
 *
 * 3.bar词法环境
 *
 * barLexicalEnvironmentObject={
 *  outerLexicalEnvironment: fooLexicalEnvironmentObject
 *  currentEnvironmentRecord: 起着bar函数活动对象的作用
 * }
 *
 */

