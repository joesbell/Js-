# eval的直接调用和间接调用

在ES5以后，区分了eval代码的直接调用和间接调用。
所谓直接调用，即使用的词法环境为当前执行环境的词法环境，而间接调用，是把全局环境当作词法环境来执行的eval代码段。

***
### eval函数

标准eval(x)函数 的 执行流程:

* 如果 Type(x) 不是 string字符串类型， 返回 x;
* 如果解析 x 时 失败， 抛出 SyntaxError异常。
* 以某个执行环境为eval代码的执行环境.
* 执行eval代码段。
* 退出该eval代码的执行环境，并复原原本的执行环境。
* 进行返回值处理

***

### 直接调用 Direct Call

我们首先先说明调用的表达式:   CallExpression: (MemberExpression)(Arguments)

我们可以这样理解:  foo(1) 这样的调用， MemberExpression为foo,arguments为 \[1], window.foo(1,2),MemberExpression为window.foo,arguments为\[1,2]。
也就是说分别代表调用的函数和函数的参数列表。

当我们的调用满足以下两个条件时，该eval调用就叫直接调用:
* MemberExpression的解释执行结果为**一个引用规范类型**， 该引用规范类型拥有一个环境记录项作为基值，并且该**引用名称为 "eval"**。
* \[\[GetValue]](该引用规范类型) 得到的值，是 我们标准的内置 eval函数。

也就是说，我们进行直接调用时， 函数名必须是一个引用并且该引用名字叫eval，同时该引用的值是标准内置的eval函数。

只有满足了上述的条件，才叫直接调用。

直接调用时，eval代码段的执行环境在**非严格模式**下:
* this绑定为当前执行环境的this绑定。
* 变量环境组件为 当前执行环境的变量环境组件。
* 词法环境组件为 当前执行环境的词法环境组件。

**在严格模式下**:
* this绑定 为 当前执行环境下的 this绑定。
* 词法环境组件为 以外部词法环境调用NewDeclarativeEnvironment创建的新的声明式词法环境
* 变量环境组件为 以外部词法环境调用NewDeclarativeEnvironment创建的新的声明式词法环境。


***

### 间接调用

如果eval代码不是直接调用，那么就是间接调用.间接调用时，eval代码段的执行环境，**无论是否是严格模式**:
* this绑定为 全局对象
* 变量环境组件为 全局环境。
* 词法环境组件为 全局环境。

***


### Tips:容易出错的地方 window.eval

在浏览器的环境下,window就是global对象，window对象可以说本身就是全局环境的 对象式环境记录项，但是，**通过window.eval 执行的是 间接调用!**

这里解释一下，乍一看， window.eval方式的调用， window.eval是引用规范类型，其Base基值为 window,同时window也是环境记录项, 其ReferenceName为"eval",而对其\[\[GetValue]]获取的也是标准内置eval函数。

但是这里有一点，这里本质是在进行**window对象的eval属性访问**，其实**并不涉及环境记录项**。

我们要记住一点,词法环境这些是**规范的内部实现机制,是底层实现**,而我们在顶层代码中是无法直接进行访问的，这是底层的运作机制。

我们可以从\[\[GetValue]]的流程中看到，在IsPropertyReference(window)返回true以后，实际进入的已经是属性访问的范围了。

此时，在引擎看来，window只是一个普通的对象，而不是一个环境记录项,这里可以认为，window.eval规范类型的基值是一个Object类型对象而不是一个环境记录项。 因此不满足第一个条件，所以是间接调用，其执行环境为全局环境。

