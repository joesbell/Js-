# JSON

JSON全称是JavaScript Object Notation (JavaScript对象表示法)。但是 JSON并**不是**JavaScript的一部分，虽然JSON可以**近似**的看做JavaScript语言的子集。

之所以说是近似的，是因为某些格式的JSON数据在JavaScript中是无法解析的。 比如 U+2028(行分割符) U+2029(段落分割符)，这两个控制字符在JSON的字符串中是允许的，
但是在JavaScript中，字符串中是不能存在U+2028 U+2029 这两个字符的。 这些细微差异，决定了JSON只能是JavaScript的**语法上的近似子集**。

JSON只是一种**数据表示格式**一一这种格式使用JavaScript的一些语法来**表示结构化数据**。

JSON之所以流行的原因在于，相比于XML等数据格式，JSON格式的数据在任何版本的浏览器中都可以直接使用 eval 函数来解析，非常方便。 

这种解析方式是使用 **eval("("+JSON数据+")")** 来完成的。但是这是不安全的，所以新的浏览器提供了 JSON.parse 方法 来专门解析 JSON数据。

***

### 语法

JSON的语法可以表示三种类型的值:
* 简单值  字符串，数字，布尔值，null  需要注意的是,**没有 undefined**
* 对象    表示的是无序的键值对。 值可以是对象或者数组。
* 数组    表示的是有序的值的列表。 值可以是对象或者数组。

在JSON数据中是**不支持函数以及对象实例(引用变量)的**,因此将某个对象序列化为JSON数据时,对象的**方法是会被忽略**的，而对象中作为属性值的**对象实例则会被序列化**。

另外，在JSON语法中数据的格式也有要求:
* 数字不允许前导0，小数点后必须跟数字。
* 字符串必须以双引号包裹
* 属性名必须以双引号包裹
* 对象的最后一个属性或者数组的最后一项后 不允许跟 逗号

### 解析和序列化

首先这里先要说明两点(关于JSON的)：
* 解析 指的是 将 JSON格式的数据(也就是JSON数据的字符串形式) 转化为 JavaScript中的对象。  从 字符串类型 转化为 对象类型。
* 序列化 指的是 将 JavaScript中的对象 转化为 JSON格式的数据(也就是JSON数据的字符串形式)。 从 对象类型 转化为 字符串类型。

#### JSON.stringify 序列化

要进行 JSON解析 ，在老版本浏览器中可以使用eval方法，也可以使用自己实现的JSON解析器。在新版本中，则可以使用 原生 JSON 对象的 **stringify** 方法。

JSON.stringify(obj,replacer,indent)的参数列表具有以下意义:
* obj 待序列化的对象
* replacer 用于过滤序列化的选项，可以是个函数，也可以是个数组
* indent 序列化后的字符串的每级缩进的内容。

在进行序列化时，算法流程如下:
* 当对象或数组具有toJSON方法时，以对象或数组的toJSON方法返回值为准，这个值可以称作为 **替代对象**，后续对替代对象进行序列化。

    这个算法**仅进行一次**，也就是说，不会递归地调用toJSON无限获取新的返回值(替代对象)进行序列化。对一个对象序列化时，toJSON返回值替代对象来进行序列化操作只能进行一次(如果有)，此后是不会再进行的。

* 对上述的值或者是产生的替代值应用 replacer进行序列化操作。 这里又分为 replacer是函数和数组的情况(或者没有过滤选项) 以及 值是对象还是数组的情况(基本类型太简单,不单独列出)。
    
* 对上述产生的序列化字符串按照缩进进行格式化。

序列化的核心算法就在第二步，首先讲一下没有replacer的情况下，默认的序列化方式:

* 对对象序列化规则: 对**对象自身的每个属性值**应用
    * string类型 序列化为**双引号包裹的string**
    * number类型 序列化为number
    * boolean类型 序列化为boolean
    * undefined类型 **不进行序列化**
    * symbol类型 **不进行序列化**
    * null类型   序列化为null
    * 函数      **不进行序列化**
    * object对象 按照对象序列化规则进行序列化
    * array数组  按照数组序列化规则进行序列化
    * string number boolean 的**包装类型自动转为基本类型值**进行序列化操作
    * **不可枚举**的属性不能被序列化
    * symbol类型为**属性键**的属性不被序列化
    * 涉及循环引用的对象，序列化报错
* 对数组序列化规则：对**数组的每一项**应用
    * string类型 序列化为**双引号包裹的string**
    * number类型 序列化为number
    * boolean类型 序列化为boolean
    * undefined类型 序列化为**null**
    * symbol类型 序列化为**null**
    * null类型   序列化为null
    * 函数      *序列化为**null**
    * object对象 按照对象序列化规则进行序列化
    * array数组  按照数组序列化规则进行序列化
    * string number boolean 的**包装类型自动转为基本类型值**进行序列化操作
    * 涉及循环引用的数组，序列化报错
* 对其他的规则：
    * string类型 序列化为**双引号包裹的string**
    * number类型 序列化为number
    * boolean类型 序列化为boolean
    * null类型   序列化为null
    * undefined类型，symbol类型，函数  序列化为**undefined**


这里可以看出来，默认的序列化算法对数组和对象的处理的唯一区别在于,对象中 属性值为 function undefined symbol类型 的属性是不进行序列化，而 数组中 值为 function undefined symbol类型 的项是序列化为null.

当具有replacer过滤条件时，则会对过滤后的值应用上述的规则：

* 如果replacer是函数，那么replacer(key,value)会对每次的返回值迭代地执行。初始时，会将key设为""空字符串，value设置为等待序列化的对象。
    * 如果返回值是对象，那么将对象的**每一个**属性名作为key 属性值作为value，传入 replacer函数 继续序列化
    * 如果返回值是数组，那么将数组的**每一个**索引作为key 项作为value，传入 replacer函数 继续序列化
    * 如果返回值非对象或非数组，那么按照该value**属于数组还是对象**来决定是**应用数组的规则还是应用对象的规则进行值的序列化**。
* 如果replacer是数组,那么实际上就是设置**可以序列化的属性名列表**,此时**只对对象序列化生效**，**对数组是无效的**.
   
   对于属性名x,只有当其父级属性名均位于replacer数组里时，并且x也在replacer数组里，同时x也要符合对象的序列化规则(比如可枚举，值不为undefined等)，此时x属性便是可以序列化的。 
   
最后indent缩进参数，是对整个序列化完成后的字符串进行格式化操作的。 indent参数可以为任何字符串，但是长度最多只取10,并以此作为序列化字符串的每一层次的缩进。

以上就是 JSON.stringify方法进行 对象序列化的算法步骤。 

但是需要注意的是，原生JSON对象提供的序列化操作对**某些特殊字符的处理是不完善的**，有时会因此造成错误。 因此，更好的选择是使用 外部的json序列化库。当然，在大多数场景下，原生JSON提供的序列化是够用的。

#### JSON.parse 解析

JSON.parse(data,receiver)的参数列表具有以下意义:
* data 等待解析的JSON字符串数据
* receiver 对每次解析后的值进行转换的函数

解析的重点其实在于 receiver(key,value)函数，这是一个可选的参数，如果没有该参数，则可以认为是不对解析值进行转换。
* 对象的解析规则如下：
   
        假设JSON数据如下: 
        {
            "a":1,
            "b":2,
            "c":{
                   "d":3,
                   "e":4
                }
        }
        则首先会从最外部的属性开始深入到内部的属性进行解析， a -> b -> d -> e  依次传入 receiver函数作为key, 依次传入 1->2->3->4 作为value。返回值就是原本value转换后的值。
        然后从最内部的对象或者数组开始，向外面的对象或者数组回代， 对象c -> 整个对象， 此时 依次传入 "c" -> ""空字符串 作为 key ， { "d":3转换后的值,"e":4转换后的值} 以及整个对象转换后的value作为value。
        对于转换后的值，只有当 receiver返回值为undefined时，才说明该属性不被解析，也就是说 该属性需要被删除。 但是！返回值为function symbol 的情况都是会转换的。这点和序列化不一样。
        
* 数组的解析规则如下:

        假设JSON数组如下:  [1,2,[3,4]]
        则是大体是按照从左往右依次解析，也就是说 序号 0 1 0 1 2 会依次作为 receiver函数的key参数， 而与之对应的 1, 2 ,3 ,4 , [3,4](这个其实就是回代的数组项，因为3，4已经被解析了) 会依次作为 receiver函数的value参数。
        如果一个数组每一项都解析完了，那么就需要回代了，此时将数组在其外部数组的索引作为 key ， 该数组的值 作为 value 。
        到最后，就是整个数组需要回代了，此时 key依旧为""空字符串，而value就是整个项被转换后的数组的值了。
        对于转换后的值，只有当 receiver返回值为undefined时，才说明该项需要留空。所谓留空，就是数组没有这个索引的属性。此时array.hasOwnProperty(index) 返回false。 这和有属性但是值为undefined还是有所不同的，留空意味着该项被删除了。
    

解析的规则比序列化的规则要简单一点。

利用序列化的规则和解析的规则中replacer和receiver，我们可以实现一些特殊的序列化和解析规则，从而达到某些特殊目的，比如，我们可以序列化和解析对象的方法，这是正常的序列化无法做到的。