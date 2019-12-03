# \[\[CanPut]]规范

\[\[CanPut]]规范方法主要用于规定对象的某个属性是否可以被\[\[Put]]规范方法设置。

该规范的执行流程如下: O.\[\[CanPut]](P) 返回的是 对象O是否能对其属性P进行设置操作。

* 令**desc为 O.\[\[GetOwnProperty]](P)的结果，返回的是该对象自身的P属性的属性描述符对象**。
* 如果desc不为null,也就是说该对象自身拥有该属性而不是在其原型链上。
    * 如果IsAccessorDescriptor(desc)是true,即该属性为访问器属性，如果该访问器属性的set方法不为undefined，那么返回true，否则返回false。
    * 否则,该属性为数据属性，返回 **desc.writable** 值.
    (这里之所以是返回writable而不是 configurable||writable 是因为真正控制 等号赋值的是 writable属性(其实也不准确，writable同样可以控制定义value)，configurable属性控制的是是否能重定义属性)
* 否则说明对象O上没有该属性，所以在原型链上找寻该属性。
* 令proto为对象O的\[\[prototype]]属性。也就是隐式原型。
* 如果proto为null，说明没有隐式原型，那么直接返回**对象O本身的\[\[Extensible]]属性值**，该值表示对象是否可以添加属性。
* 否则就是存在隐式原型，令 **inherited为 proto.\[\[GetProperty]](P)的结果，在整个原型链上寻找该属性P的描述符**.
* 如果inherited为null,说明整个原型链上也没有该属性，那么直接返回 对象O的\[\[Extensible]]属性值.
* 否则说明原型链上该属性P的特性描述符存在
    * 如果 IsAccessorDescriptor(desc)为true,说明该属性为访问器属性，如果该访问器属性的set方法不为undefined,那么返回true,否则返回false
    * 否则,该属性为数据属性，返回**inherited.writable**值

以上为整个\[\[CanPut]]规范。额外的说明是，**宿主对象可以定义额外的条件来约束\[\[Put]]操作**。这属于宿主对象的自定义行为。

***

##### 总结
我们可以用一句话来总结整个\[\[CanPut]]规范：
我们能**使用赋值符号**为对象上的某个属性赋值，当且仅当该属性在**包含自身属性的原型链**上出现以下三种情况之一：
* 是一个访问器属性并且其set方法不为空
* 是一个数据属性并且其writable特性为true
* 没有该属性并且对象本身的\[\[Extensible]]属性为true