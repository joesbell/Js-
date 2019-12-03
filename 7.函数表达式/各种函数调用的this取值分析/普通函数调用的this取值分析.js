/**
 * 作为普通函数调用时的this取值分析。
 */

var a=1;

var foo={
    a:2,
    bar:function () {
        console.log(this.a);
    }
};

var goo=foo.bar;


/**
 * goo是引用规范类型，但是，其基值为环境记录项一一全局词法环境的环境记录项，因此，this取值为 全局词法环境的ImplicitThisValue()函数的返回值结果，
 * 而对于全局词法环境来说，其provideThis值为false，所以全局词法环境的环境记录项虽然是对象式环境记录项，但是依旧是返回undefined作为thisValue绑定。
 * 由于这里是在非严格模式下执行的函数代码。因此，函数在建立执行环境时，会将undefined或者null的this取值替换为 全局对象。 因此，这里打印1.
 *
 * 需要注意的是，如果这里是严格模式，那么是会抛出TypeError异常的,因为此时this为undefined，我们是无法从undefined上读取属性值的。
 * */
goo();//1

/**
 * 可以看到 MemberExpression为 foo.bar,此时 基值为 foo,所以this绑定为foo对象，故打印2
 */
foo.bar(); //2

/**
 * 分组运算符并不改变解释执行 foo.bar的返回值，该返回值依旧为引用规范类型，道理同上， 故打印2
 */
(foo.bar)(); //2

/**
 * 赋值运算最终返回的是 对引用类型GetValue()取值后的结果，由于不是引用规范类型，所以this取值为undefined，
 * 又因为函数创建执行环境时，位于非严格模式下，如果this绑定为undefined或者null，则自动使用全局对象作为this取值，所以返回1.
 */
(foo.bar=foo.bar)(); //1

/**
 * 道理同上
 */
(false||foo.bar)(); //1
/**
 * 道理同上
 */
(foo.bar,foo.bar)(); //1


