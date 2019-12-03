# \[\[DefaultValue]](暗示类型)规范方法

\[\[DefaultValue]]是一种暗示方法，用于获取Object类型对象的默认值，或者说，是获取Object类型对象转化为原始值(Boolean,Undefined,Null,String,Number)的方法.

\[\[DefaultValue]]暗示方法往往有两种形式:
* 暗示结果为 String类型
* 暗示结果为 Number类型

当暗示结果为String类型时，对象O的\[\[DefaultValue]]规范方法执行流程如下:

* 令toString为O.\[\[Get]]("toString")方法的结果。(**在自身属性和原型链上寻找 toString这个属性**)
* 如果IsCallable(toString)返回true，那么 (**IsCallable只有对函数对象才会返回true**)
    * 令 str 为 O作为this值，空参数列表调用 toString的 \[\[Call]]内部方法的结果。
    * 如果str为原始值，那么返回str。
* 令valueOf为O.\[\[Get]]("valueOf")方法的结果。(**在自身属性和原型链上寻找 valueOf这个属性**)
* 如果IsCallable(valueOf)返回true，那么 (**IsCallable只有对函数对象才会返回true**)
    * 令 val 为 O作为this值，空参数列表调用 valueOf的 \[\[Call]]内部方法的结果。
    * 如果val 为原始值，那么返回val。
* 抛出TypeError异常。

当暗示结果为Number类型时，对象O的\[\[DefaultValue]]规范方法执行流程如下:

* 令valueOf为O.\[\[Get]]("valueOf")方法的结果。(**在自身属性和原型链上寻找 valueOf这个属性**)
* 如果IsCallable(valueOf)返回true，那么 (**IsCallable只有对函数对象才会返回true**)
    * 令 val 为 O作为this值，空参数列表调用 valueOf的 \[\[Call]]内部方法的结果。
    * 如果val 为原始值，那么返回val。
* 令toString为O.\[\[Get]]("toString")方法的结果。(**在自身属性和原型链上寻找 toString这个属性**)
* 如果IsCallable(toString)返回true，那么 (**IsCallable只有对函数对象才会返回true**)
    * 令 str 为 O作为this值，空参数列表调用 toString的 \[\[Call]]内部方法的结果。
    * 如果str为原始值，那么返回str。
* 抛出TypeError异常。

以上规范可以总结为：当对一个对象获取其默认原始值时，本质是在**选取调用该对象的 toString 或者 valueOf 方法来获取原始值**。

* 对于希望获取String类型的对象，会**首先调用toString方法**获取原始值，如果**获取原始值失败才会调用valueOf方法**来尝试获取原始值。
* 对于希望获取Number类型的对象，会**首先调用valueOf方法**获取原始值，如果**获取原始值失败才会调用toString方法**来尝试获取原始值。

一般而言，ECMAScript中的Object类型对象， 除了 Date类型 获取原始值是 默认暗示为String类型， 其余所有类型的对象获取原始值的方式均为 获取Number类型，也就是说
**只有Date类型才是优先调用toString其次调用valueOf，其余所有类型的对象均是优先调用valueOf其次才是调用toString**。

这里需要注意的一点是，暗示类型并非不可变的，这取决与规范内部方法的调用\[\[DefaultValue]]时传入的暗示类型参数。
以上所总结的情况，其实就是在调用\[\[DefaultValue]]时不传入暗示类型参数的默认暗示类型。

***

这里列举一个容易搞错的例子,当然完整的解释应该结合 加法操作符规范来看。

        var foo={
            toString:function(){
                return "toString";
            },
            valueOf:function(){
                return "valueOf";
            }
        };

        console.log(foo+""); // "valueOf";

如果联想到最开始我们总结的二元+操作符，我们可能会联想到，这里会将 foo转化为字符串进行连接，自然而然会想到是调用toString方法。
然而实际上并不是。这里实际上调用的是 ToPrimitive规范方法，并调用foo对象的内部DefaultValue方法(并且没有提供任何暗示，故采取默认的暗示Number)，所以优先调用的是ValueOf方法。