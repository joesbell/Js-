### DefineOwnProperty 规范

DefineOwnProperty是ECMAScript中所有对象都具有的内部规范方法,用于**创建或修改自身属性(包括其属性的特性)**。

DefineOwnProperty(属性名 P，属性描述符 Desc，是否抛出异常 Throw) 是其标准调用方式。


O.\[\[DefineOwnProperty]](P,Desc,Throw)的执行流程如下:
 
需要注意的是,方法调用如果失败，那么会根据Throw的值做出不同的返回:当Throw为true时，会抛出TypeError异常，当Throw为false时，仅仅返回false.

1. 首先调用 O.\[\[GetOwnProperty]](P)方法，获取对象O的P属性的 属性描述符对象current。

2. 令extensible为对象O的 \[\[Extensible]]内部属性值，这个属性是表示对象是否能够添加属性的。

3. 如果current为undefined，说明对象O中不含有P属性。 **此时操作为新增属性**
    
   * 此时如果 extensible为false，**那么 就会执行失败**。

   * 否则，如果此时extensible为true，那么就会向O中添加P属性，此时根据我们传入的Desc对象来决定是创建哪种类型的属性:

        * 如果Desc 只包含\[\[Enumerable]],\[\[Configurable]] 或者 包含了\[\[Writable]]或\[\[Value]]，那么这个Desc就被当做是数据类型的描述符，
        此时就在对象O上创建一个数据类型属性P，其属性描述符为Desc，不存在的特性字段的值为该特性的默认值。
     
        * 否则，就当Desc为访问器属性类型的描述符，在对象O上创建一个访问器属性P，其属性描述符为Desc，不存在的特性字段的值为该特性的默认值。
        
4. 如果current不为undefined,说明对象O中含有P属性。 **此时操作为修改属性**

5. 如果Desc为空对象或者Desc对象内的任何字段与现有字段完全相同(类型相同的前提下，对于基本类型是值相同，对于引用类型为引用同一个对象)。
   此时**意味着并没有做任何修改**，那么均返回true并不做任何修改。

6. 否则，意味着Desc不为空并且与current对象冲突，意味着要进行修改属性。

7. 判断current和desc描述符中的**公共字段** \[\[Configurable]]和\[\[Enumerable]].

    * 如果 current的\[\[Configurable]]为false，表示**不允许任何重定义**. 
        
        * 如果desc的\[\[Configurable]]为true,**那么 就会执行失败**.
        * 如果 current和Desc的 \[\[Enumerable]]冲突，**那么 就会执行失败**.
    
    * 如果 current的\[\[Configurable]]为true，表示允许重定义.那么不会执行失败。

8. 判断desc是否是 通用描述符，即只有 \[\[Configurable]]和\[\[Enumerable]]，如果是，那么结束流程。

9. 判断 current和desc描述符的**属性特有字段**.

    * 如果current和desc不是同一种属性描述符.
        
        * 如果 current的\[\[Configurable]]为false，表示**不允许数据属性和访问器属性互相转换**，**那么 就会执行失败**
        
        * 如果 current的\[\[Configurable]]为true，表示**允许数据属性和访问器属性互相转换**,那么就会进行属性类型转换。
          保留 current的通用字段的现有值。
          
          (经过第10步后的实际效果就是:对于current的公共特性字段，采取**覆盖原则**，**desc如果存在公共字段则覆盖值，不存在公共字段则使用current的公共特性字段值**。)
    
    * 如果current和desc是同一种属性描述符.
        
        * 如果同为数据属性描述符.
            
            * current的configurable属性为false
            
                 * 如果current的writable属性为false时，desc的writable属性为true或者value与current的value不同，**那么就会执行失败**
                  
                 * 如果current的writable属性为true,则没有这种限制。(**这意味着 configurable为false，writable为true时，是可以重定义value值**)(**同时还意味着，writable可以随时从true改为false**)
            
            * current的configurable属性为true时，可以执行任何更改    
            
        * 如果同为访问器属性描述符.
            
            * 如果current的configurable属性为false时,不允许任何更改，如果更改则 **执行失败**
            
            * 如果current的configurable属性为true时，可以执行任何更改  

10. 根据desc拥有的特性字段覆盖current特性字段的值并返回true

特别的，如果对象O是Array对象，那么还有额外的操作。这里不细谈了

### Object.defineProperty方法

Object.defineProperty方法是基于内部规范的抽象方法 DefineOwnProperty实现的。

Object.defineProperty(对象O，属性名P，属性描述desc)的执行步骤如下:

1. 判断O是否是对象Object，如果不是Object引用类型，那么抛出TypeError异常。 (保证O是一个对象)

2. 将P转型为String类型。(保证P是一个属性名)

3. 对desc调用 ToPropertyDescriptor(desc) 内部抽象方法。其目的是：
    
    * 保证 desc是一个对象(**空对象{}也行**)
    * 保证 该属性描述符desc 不同时是 数据类型描述符和访问器类型描述符，也就是不同时含有 get或者set 和 writable或者value
    * 保证 如果该属性描述符desc 是 访问器类型描述符时，set和get的值是**IsCallable的(也就是函数) 或者 undefined**的。
 
4. 调用 O.\[\[DefineOwnProperty]](P,desc,**true**) 内部抽象方法。


我们对于Object.defineProperty方法的实际表现需要知道以下几点:
1. 为对象定义 **新增属性时**，属性描述符可以为空对象，此时默认是添加数据类型属性，同时属性描述符字段值未定义的情况下**均使用默认值**。

2. 为对象定义 **修改属性时**，属性描述符可以为**空对象**或者**完全与原本属性描述符对象相同**，此时等效于不修改属性，并永远返回true。

3. 为对象定义 **修改通用特性字段**时，如果描述符不是空对象或者与现有的冲突。 那么当原本属性描述符configurable为false，那么表示不可重定义。此时任何修改通用特性字段的属性描述符的操作都会失败。

4. 为对象定义 **修改私有特性字段**时，如果描述符不是空对象或者与现有的冲突。那么当原本属性描述符configurable为true，那么表示可以重定义。
   在涉及属性类型转化时:
   * 对于**通用特性字段**，新的属性描述符中没有提及，那么就会采用原有值，提及了就会进行覆盖。
   * 对于**私有特性字段**，在属性类型转化时，如果没有提及，采用该特性字段默认值，如果提及了，那么就会采用该值。
   
5. 为对象定义 **修改私有特性字段**时，如果描述符不是空对象或者与现有的冲突。   
   在不涉及属性类型转化时:
   * 宗旨是:原本的configurable为true时可以进行任意修改，为false时，不允许任何修改。
   * 特殊的，对于**数据属性**来说，如果原本**configurable为false,但是writable为true,那么此时value是可以修改，并且仅有value可以修改**的，这是非常特殊的。