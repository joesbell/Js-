/**
 * with语句下的函数调用的this取值是绑定对象本身，但是需要注意的是，这并不是说在with语句里的任何函数调用的this都是这样。
 * 满足this取值是绑定对象本身的条件是:
 * 1.该函数为绑定对象的属性。
 * 2.调用时的函数名为该绑定对象下的属性名。
 */
var a=1;

var foo={
    a:2,
    bar:function () {
        console.log(this.a);
    }
};

with(foo){
    /**
     * 这里，bar这个MemberExpression解释执行后，返回的是一个引用规范类型，需要注意的是，这里bar的基值不是foo对象，也就是说不是属性访问，而是以 foo对象为绑定对象的对象式环境记录项，
     * 所以这里的this绑定是由 该对象式环境记录项的ImplicitThisValue()返回值决定的，由于with语句的provideThis为true，所以该函数返回的是绑定对象foo。
     * 所以这里的bar函数执行的this绑定就是foo对象。因此打印2.
     */
    bar(); //2

    /**
     * 这里声明了一个变量等于bar函数。但是需要注意的是，在with语句中声明的变量，并不是with语句中的本地变量！因为代码段只有三种:全局，函数，eval。
     * 因此，本质上这里等价于在全局代码中 var foobar; 然后再在with语句中对全局变量中的foobar=bar赋值。
     * 所以，在foo对象上，是根本没有foobar属性的，因此在GetBase(foobar)获取其基值时，在以foo对象为绑定对象的对象式环境记录项上并没有找到foobar标识符，所以在其外部词法环境一一全局词法环境中找到了foobar标识符。
     * 因为全局词法环境的环境记录项的ImplicitThisValue()返回的是undefined，由于在非严格模式下，因此foobar函数在创建执行环境时，会以全局对象替代undefined或者null的this取值。
     * 因此这里打印1.
     */
    var foobar=bar;
    foobar(); //1

    /**
     *这里需要注意的是， 在解释执行foo.foobar获取引用规范类型时，其基值并非是以foo对象为绑定对象的对象式环境记录项，而是全局词法环境的环境记录项。这里下面会证明。
     */
    foo.foobar=foobar;

    /**
     * 此时，由于foo对象上有了foobar属性，以foo对象为绑定对象的对象式环境记录项中已经包含了foobar标识符，因此在GetBase(foobar)时，获取的环境记录项就是以foo对象为绑定对象的对象式环境记录项。
     * 所以这里的this绑定是由 该对象式环境记录项的ImplicitThisValue()返回值决定的，由于with语句的provideThis为true，所以该函数返回的是绑定对象foo。
     * 所以这里的foobar函数执行的this绑定就是foo对象。因此打印2.
     */
    foobar(); //2
}



var b={
    a:3,
    bar:function () {
        console.log(this.a);
    },
    b:{}
};

with(b){
    bar();//3 同理
    var bbar=bar;
    bbar();//1 同理
    /**
     * 但是这里就不同了，我们曾经在标识符解析那里讲过，标识符解析只认第一个.前面的字符串作为标识符，所以这里是在词法环境中寻找 b 这个标识符，而显然的，
     * 对象b中就恰好有这个b属性，所以这里的 b.bbar解析后，其基值是 以b对象为绑定对象的对象式环境记录项.
     * 所以这里的赋值操作其实是在对 对象b的b属性中的bbar进行赋值操作。
     * 而不是像上面一样，是在对  对象b的bbar属性进行赋值操作。
     * 所以该操作完成后，以b对象为绑定对象的对象式环境记录项依旧没有bbar这个标识符(因为对象b中没有bbar属性)。
     * 故，环境记录项为全局词法环境的环境记录项，所以this取值为undefined。
     * 由于在非严格模式下，因此bbar函数在创建执行环境时，会以全局对象替代undefined或者null的this取值。
     * 所以打印1.
     */
    b.bbar=bbar;
    bbar();//1
}

//从这里也可以看出，的确是在 对象b的b属性上对bbar属性进行的修改。
console.log(b.b.bbar);

//通过以上描述，可以完善对特别情况下的普通函数调用的this取值分析。
//同时也加深了对 with语句中标识符解析的理解：赋值操作，首先是对左边的表达式进行解释执行获取该标识符的引用规范类型。
//在这个途中就牵扯到在词法环境中通过函数GetIdentifierReference(lex,name,strict) 利用标识符获取引用规范类型。
//而由于词法环境层层嵌套，就形成了经验上的 作用域链的概念。