/**
 * 测试1: 这里首先区分一下 eval 直接调用和 间接调用。
 */

(function () {
    var a=10;
    var fn=eval;
    eval("console.log(typeof a== 'number')"); //这里标准的直接调用的例子。

    (eval)("console.log(typeof a == 'number')");// 直接调用。()分组运算符并不会改变执行结果，只会影响优先级，因此这里 (eval) 和 eval是等价的

    console.log( (1,eval)===eval ); // 但是需要注意的是 , 号操作符 是会影响返回结果的。

    (1,eval)("console.log(typeof a == 'undefined')"); //间接调用。  1,eval 返回的值是 切实的值一一eval函数，而不是一个引用规范类型。

    fn("console.log(typeof a == 'undefined')"); //间接调用。  这里引用规范类型的ReferenceName为fn了，不是"eval"
}());

console.log("----------------");

/**
 * 测试2:通过with语句，来进行eval直接调用。重点是，基值必须是一个环境记录项。
 */
(function () {
    var obj={};
    obj.eval=eval;
    var a=10;

    obj.eval("console.log(typeof a== 'undefined')"); //这里是间接调用，这是因为 基值是obj，是Object对象，而不是一个环境记录项

    //由此联想到一种可以让对象变成环境记录项的语法一一with， 通过with语句,可以使其变成直接访问。
    with (obj){
        eval("console.log(typeof a == 'number')"); //这是一种看起来很奇怪的eval调用方式，但是这是直接调用。
        //虽然看起来非常奇怪，但是的确符合直接调用的例子。
        //引用名称的确为eval,其次,由于with语句，当前执行环境的词法环境为对象式词法环境，其环境记录项的绑定对象为obj,因此符合基值为环境记录项，同时这里的访问并不是直接的属性访问。
        //最后， 这个eval的确就是标准内置eval函数。  综上 为直接调用。
    }

}());

console.log("----------------");

/**
 * 测试3:window.eval===eval，但是， window.eval并不是直接调用。 因为在引擎看来，这是属性访问，window此时只被看作是Object类型对象，而不被看作是环境记录项。
 */
(function () {
    var a=10;
    window.eval("console.log(typeof a == 'undefined')"); //间接调用，但是参照测试2，我们也能使用with语句使其变成直接调用。

    with(window){
        eval("console.log(typeof a == 'number')");//直接调用，原理同测试2的原理
    }
}());
