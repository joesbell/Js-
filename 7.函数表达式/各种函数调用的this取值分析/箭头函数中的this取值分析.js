/**
 * 箭头函数调用时，其函数体内的this取值是不受外界影响的。
 * 其this取值，永远指向该箭头函数 创建时 的 this取值，或者按照规范说，是 创建该箭头函数时的词法环境中环境记录项的this绑定值。
 * 也不会受到 call apply bind 等修改this取值的方法调用的影响。
 */

//这里创建一个箭头函数，其this取值为全局对象。
var foo =(()=>{
   return this;
});

//可以看到，就算强制使用call apply bind等方法设置this取值，依旧无法改变箭头函数中的this取值。
console.log(foo()==window ===true);
console.log(foo.call({})==window === true);
console.log(foo.apply({})==window === true);
console.log(foo.bind({})()==window ===true);


console.log("-------------");

/**
 * 关于 箭头函数创建时 的理解：
 * 箭头函数中的this取值 取决于创建箭头函数时的this取值，而不是声明定义时的this取值
 */

//这里可以清楚的看到， obj.bar是一个普通函数，该函数返回一个箭头函数。
var obj={
   bar:function () {
       return ()=>{
         return this;
       };
   }
};

//这里我们设置 a为 该 普通函数。
var a=obj.bar;

var arrowFunc=a(); //执行该普通函数返回箭头函数。

/**
 * 这里我们可以看到 该箭头函数中this取值竟然是全局对象 而不是 obj对象。
 * 究其原因，箭头函数真正创建的时刻，是 var arrowFunc=a() 语句执行时，
 * 在这个情况下，a()表达式中， a是引用规范类型，其基值为全局环境记录项，因此，this绑定是undefined。在实际调用时，由于是非严格模式下，会自动将this取值变为全局对象
 * 所以返回的箭头函数中this取值就是这个全局对象。
 */
console.log(arrowFunc()== window ===true);


console.log("-------------");

/**
 * 使用以下代码证明上面所说的。
 */
var b={};
b.prop=a;
//此时箭头函数是由  b.prop() 该callExpression调用执行产生，因此，this绑定就是 MemberExpression b.prop 解释执行之后返回的引用规范类型的 基值: b
arrowFunc=b.prop();
console.log(arrowFunc()== b ===true);

console.log("-------------");

/**
 * 那么为什么会产生这个现象呢？
 * 下面进行分析。
 * 如果看过ES6箭头函数转换后为ES5代码，那么我们会很清楚一点：ES6的箭头函数在ES5中，是使用立即执行函数模拟的。
 * 其大概过程如下。
 */

/**
 * 这段代码用于模拟最开始的 var foo = ()=>{ return this;}
 *
 * 可以看出来，本质上，是利用外部闭包的that来保存创建时的词法环境中的this取值。
 *
 * 这也正是开头的结论， 箭头函数中的this取值 取决于创建箭头函数时的this取值，而不是声明定义时的this取值。
 */
foo=(function () {
    var that=this;//获取当前执行环境的this绑定。
    return function () {
        return that; //利用闭包，永远返回该执行环境的this绑定。
    }
}());

//效果一模一样
console.log(foo()==window ===true);
console.log(foo.call({})==window === true);
console.log(foo.apply({})==window === true);
console.log(foo.bind({})()==window ===true);

console.log("-------------");

//再次利用立即执行函数模拟箭头函数
obj={
    bar:function () {
        var that=this;
        console.log(that)
        return function () {
            return that;
        }
    }
};

//这里看，更能明白为什么 箭头函数的this取值问题了。 无非是普通的函数调用的this取值，然后使用闭包保存了该this值罢了，并在箭头函数中使用。
a=obj.bar;
arrowFunc=a();
console.log(arrowFunc()== window ===true);

b={};
b.prop=a;
arrowFunc=b.prop();
console.log(arrowFunc()== b ===true);

//以上效果同样一模一样。
console.log("-------------");

/**
 * 箭头函数中容易犯错的点，利用这种立即函数执行的分析模式，也非常容易分析。
 */
obj={
   //这里的this就是全局对象！！！这是非常容易犯错的一个点。
   bar:(()=>{
      return this;
   })
};

console.log(obj.bar()==window ===true);
arrowFunc=obj.bar;
console.log(arrowFunc()== window ===true);

/**
 * 改用立即执行函数分析上面的问题，非常容易。本质上就是因为 bar属性是立即执行函数返回的。
 * 而立即执行函数的 CallExpression调用表达式中的 MemberExpression成员表达式 解释执行后返回的引用规范类型的基值是全局环境记录项的ImplicitThisValue（）返回的结果。
 * 由于在非严格模式下，尽管返回的undefined，但是函数调用时会自动将undefined的this绑定设置为全局对象。
 */
obj={
   bar:(function () {
      //立即执行函数的this取值都是全局对象。
       var that=this;
       return function () {
           return that;
       }
   }())
};

console.log(obj.bar()==window ===true);
arrowFunc=obj.bar;
console.log(arrowFunc()== window ===true);


