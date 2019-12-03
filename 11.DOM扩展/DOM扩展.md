# DOM扩展

尽管DOM 1级规范提供的接口已经满足了大多数需求，但是为了更好的实现更多的功能，许多浏览器提供了更多的专有扩展，这些扩展经过事实化后，逐步成为了规范。

这里主要讲三个扩展 Selector API (选择符API)，HTML5 ，Element Traversal(元素遍历)。 这些扩展均为DOM添加了一些属性。

### 选择符API

所谓选择符API就是**根据CSS选择符去匹配DOM元素**。 jQuery等JS库均通过自己实现CSS解析器来解析文档，从而达到利用CSS选择符来匹配DOM元素的目的。

然而这些功能毕竟是运行在JavaScript代码上的，是通过JavaScript调用DOM 1级提供的基础API进行查询后实现的。因此性能较差。

而有了选择符API规范后，根据选择符匹配元素的功能由浏览器底层提供，性能因此极大地提高。 

这里需要注意的一点,**选择符API是单独的规范，和DOM 规范 没有关系**。

CSS选择符常用的有以下几个:
* tagName  匹配标签
* .className 匹配类名
* \#id 匹配id

选择符API的**1级**方法有这两个:
* querySelector(css选择符)  返回后代节点中，与该选择符**匹配的第一个元素**，如果没有找到，返回null。
* querySelectorAll(css选择符) 返回后代节点中，与该选择符匹配的所有元素的**NodeList有序静态集合**，如果没有找到，返回空集合。

这里唯一需要注意的一点就是，选择符api querySelectorAll 返回的集合虽然是NodeList实例，但是却是**静态的快照**,在浏览器底层，和我们之前在DOM1级中说的NodeList动态集合是**不一样的实现**！
这是选择符API规范里专门规定的，返回对象必须是 静态集合。


选择符的**2级**方法则为 Element类型 新增了一个方法 matchesSelector(css选择符) ,该方法的调用元素如果和选择符匹配，那么返回true，否则返回false。
需要注意的是，该方法在不同引擎中的调用方式是不同的，在IE中是msMatchesSelector,在火狐中是mozMatchesSelector,在谷歌中是webkitMatchesSelector.

***

### 元素遍历

元素遍历规范是**单独的规范**。 用于进行**DOM树内 Element元素的遍历**。

在DOM1级中我们知道，Node类型有很多表示关系的属性，比如childNodes,parentNode，previousSibling，nextSibling，lastChild，firstChild等等。这些属性有一个共同的特点一一遍历的范围是在Node节点类型上。
也就是说，属性的值的类型限定是Node，因此就带来一个问题，如果我们想要迭代Element元素，则需要判断Node的nodeType属性，这是非常繁琐的。

因此，就有了元素遍历规范。 

元素遍历规范规定了在Element类型上必须实现以下5个属性:
* firstElementChild 返回元素的第一个直接子元素 对应 DOM1级中Node的firstChild 的 元素版本
* lastElementChild  返回元素的最后一个直接子元素 对应 DOM1级中Node的lastChild 的 元素版本
* previousElementSibling 返回元素的前一个同胞元素 对应 DOM1级中Node的previousSibling 的 元素版本
* nextElementSibling 返回元素的后一个同胞元素 对应 DOM1级中Node的nextSibling 的 元素版本
* childElementCount 返回元素的所有直接子元素的个数 对应 DOM1级中Node的childNodes.length 的 元素版本

同样的，这些**关系属性都是只读的**。因此不能操作这些关系属性来修改DOM结构。

***

### HTML5

HTML5规范中规定了大量的JavaScript API。其中部分API是和DOM规范重叠的。这些内容有些是在DOM4级规范中定义的。

#### 与特性class相关的扩充

元素的class表明了该元素所使用的CSS样式。

HTML5新增了下述方法:
* getElementsByClassName(className)  通过className获取该节点的**所有后代**中**包含**该className的NodeList动态有序集合。

getElementsByClassName在DOM实现中是位于 **Document类型和Element类型**上。

同时针对元素的CSS类名，在**Element类型上**新增了**classList属性**，该属性返回一个**Set集合DOMTokenList类型**对象。

该对象提供了对元素类名的控制方法:
* add(className) 在类名列表中添加className
* remove(className) 在类名列表中移除className
* contains(className) 检测类名列表中是否含有className
* replace(old,new) 替换类名列表中的old为new
* toggle(className) 如果类名列表中有className则删除，没有则添加

同时还提供了以下属性:
* length 获取类名列表的长度
* value  获取元素的完整class特性值，也就是元素的className属性

同时还提供了下列访问方法:
* item(index) 获取类名列表中的第index个className
* 数组\[index\]访问方式 

需要注意的是，这两个方法**都是访问方法**，并**不能修改**类名列表classList的内容。 而**修改classList的value属性可以修改整个classList**。

***

#### 焦点管理

HTML5中添加了辅助管理DOM焦点的功能。

在**Document类型上添加了activeElement**只读访问器属性，这个属性的值为当前文档的焦点元素。

元素获取的焦点的方式有下面3种:
* 页面加载完毕后 页面焦点为**body元素**
* 用户输入或者使用tab切换焦点
* 可以成为焦点的元素主动调用focus方法

默认的，如果页面**正在加载**，那么document.activeElement的值为**null**.

在**HTMLElement类型上添加了focus方法**，用于将元素设置为焦点，需要注意的是，必须调用者元素可以成为焦点这个方法才会起作用。

在**Document类型上添加了hasFocus方法**，用于判断当前文档是否正处于焦点状态。如果用户不在操作这个页面，那么这个页面就是不处于焦点状态。
但是需要注意的是，**不处于焦点状态并不代表不能拥有焦点元素,甚至不处于焦点状态的文档的焦点元素还能发生改变**

***

#### HTMLDocument新增属性

这里说的属性虽然说是在HTMLDocument新增的，其实是在Document类型上新增的，只不过HTMLDocument通过继承Document类型也获取了这些属性罢了。

在Document上新增了一些属性，下面的这些属性都是**只读的访问器属性**:
* head 可以快速获取文档的head元素
* compatMode 获取页面的渲染模式 ，常见值为 "CSS1Compat"
* readyState 获取**当前文档和文档的资源**的加载状态

readyState具有下面三种值:
* loading 文档正在加载
* interactive 文档加载完毕了，但是文档里的资源还没加载完毕
* complete 文档和文档的均加载完毕

当readyState的值改变时，会触发 **document对象上的 onreadystatechange事件**。

***

#### 字符集属性

在Document对象上有以下属性可能表示文档的字符集信息：
* charset 表示文档实际使用的字符集，需要注意的是，这个属性的值在不同浏览器同不一定相同，比如GB2312字符集，在IE中返回"GB2312"，在谷歌中返回的是"GBK"
* characterSet 也是表示文档实际使用的字符集，在谷歌火狐中可以用，在IE中不可用。 等价于 charset，**都是只读的访问器属性**。
* defaultCharacter 表示文档的默认字符集应该是什么，依据是浏览器或者操作系统的设置。 目前在IE中能用，谷歌火狐中不能使用。

这个charset属性可以在文档的head元素中的 meta 中设置,  比如 \<meta charset="GB2312"> 就可以设置文档的字符集为 GB2312

***

#### 自定义数据属性(标准的自定义特性)

HTML5规定可以为我们的元素上添加非标准的特性， 如果这个特性名称的前缀以 data- 开头，那么就是 **标准的自定义特性**的。 

对于标准的自定义特性，在HTMLElement类型上实现了**dataset属性**,该属性的值是一个**DOMStringMap类型对象**,用于保存键值对的映射。 此时，这种标准自定义特性也可以叫做自定义数据属性。

所谓自定义数据属性，其实就是指的是新增的标准自定义特性节点在元素的dataset对象上访问，并且这种访问的方式就跟访问普通数据一样，并没有data-前缀。

在dataset属性的键值对映射中:**标准的自定义属性的 data- 会被去除**。我们可以通过访问dataSet对象的 **去除data-的特性名 的属性**来访问元素的**该自定义特性值**.

>> 举个例子， 假设标准自定义特性为 data-myname="reveur"  ,特性名去除 data-前缀后就是myname, 那么直接使用 元素.dataset.myname就可以访问该特性值 "reveur"。

同时在这个键值对映射中,键名还有额外规定: dataset对象的键名中不能存在-号。如果存在-号，那么-号会被删除，-号后的下一个小写字母变为大写字母。

>> 举个例子,假设标准自定义特性为 data-my-name="reveur"  , 在dataset对象的键中，该特性的键名可不是 my-name 而是 myName。

反之，如果键名中存在大写字母，那么特性名中就会变成 -号外加小写字母的形式。

>> 举个例子，假设设置dataset.A="1",那么在该元素的特性中， 特性节点是 data--a="1" 

还需要注意一点，自定义数据属性的特性名中:
* 不能包含大写A-Z的字母  getAttribute(attrName)访问特性方法可以识别，但是dataset属性访问无法识别
* 能以xml开头  getAttribute(attrName)访问特性方法 和 dataset属性访问 均可识别。
* 不能包含分号  getAttribute(attrName)访问特性方法 和 dataset属性访问 均无法识别。

***

#### 插入元素(HTML代码)

在Element类型上有以下三个属性和方法用于直接插入HTML代码:
* innerHTML 访问器属性,用于获取和设置**节点的所有后代**的HTML代码
* outerHTML 访问器属性,用于获取和设置**节点及其后代**的HTML代码
* insertAdjacentHTML(位置,HTML代码) 在指定位置插入HTML代码


insertAdjacentHTML方法的 **位置参数** 必须为下列的字符串之一:
* beforebegin   在本节点之前  插入一段HTML代码
* afterbegin    在本节点的第一个子节点前    插入一段HTML代码
* beforeend     在本节点的最后一个子节点后   插入一段HTML代码
* afterend      在本节点后   插入一段HTML代码

在谷歌浏览器中，位置字符串参数不区分大小写。

需要注意的是，对于上述方法或属性来说，写入的HTML代码和读取出的HTML代码可能不一致。 这是因为**对于某些特殊字符来说，在HTML代码中会被转义**。比如 & 会被转义 为 &amp;。

同时，插入的HTML代码中如果包含 script元素，**通过这种方式插入的脚本元素中的代码并不会执行或生效**。 这和 DOM API插入元素的有区别的。

当我们对节点的outerHTML写入时，基本等同于使用新的HTML代码替换该节点。 被替换的老节点并没有被删除，只是在文档树中没有位置罢了，依旧是可以访问的。

使用以上方式插入HTML代码的性能是要高于单纯使用DOM API进行节点插入操作的。 
这是因为浏览器会创建一个HTML解析器，这个解析器是在浏览器级别运行的，而不是在JS代码的层面。
当然，创建和销毁HTML解析器也是具有开销的。

***

#### scrollIntoView()方法

在Element类型上新增了scrollIntoView()方法，该方法用于将页面滚动到该元素上，并且尽可能的让调用的元素的顶部和视口的顶部对齐。

对元素调用focus()方法也可以达到同样的效果，但是，focus方法**仅对可以成为焦点的元素生效**。

*** 

### 专有扩展

所谓专用扩展，指的是各个浏览器自己额外新增的扩展内容，这些扩展内容可能会在成为事实标准后进入规范，或者是影响规范。

#### IE的文档模式

文档模式是IE引入的概念，用于决定文档可以使用哪个级别的CSS，JavaScript可以使用哪些API，以及如何对待文档类型(doctype)。

IE的文档模式可以通过 **document的documentMode属性**获取。 根据IE浏览器的版本，返回对应的数字。比如IE8就返回8.

可以在文档的head中使用 meta信息告诉浏览器应该采取什么模式来处理文档.

>> <meta http-equiv="X-UA-Compatible" content="IE=8"> 这句代码就会告诉IE浏览器以IE8的标准模式来渲染界面。

其他浏览器并不支持文档模式，仅IE支持。因此这里就不深入了。

***

#### children 属性

在 Element,Document,DocumentFragment 类型上定义了一个只读访问器属性children。

该属性会返回节点的 直接**子元素**的HTMLCollection动态集合。

这个方法是和DOM1级的 Node的childNodes对比的，相比childNodes返回所有的直接子节点集合，children返回的是直接子元素集合。由于DOM操作其实往往只是操作元素，因此更加实用。

这个属性已经被目前所有的浏览器支持，因此已经可以说是事实规范了。

***
 
#### contains 方法

Node类型上新增了contains方法，这个方法用于返回调用元素是否包含参数节点，也就是说 参数节点是否是调用节点的后代节点。这个方法基本上已经被目前所有的浏览器都支持。

在DOM3级规范中,在Node类型上有compareDocumentPosition方法用于描述节点之间的位置关系,对于 refNode.compareDocumentPosition(node)来说:
**掩码位** 00000 一一 11111 
* 如果有1 那么表示 node相对refNode是无关的(不在同一个文档内);
* 如果有2 那么表示 node相对refNode在文档树前面
* 如果有4 那么表示 node相对refNode在文档树后面
* 如果有8 那么表示 node是refNode的祖先节点
* 如果有16 那么表示 node是refNode的后代节点

举个例子:如果真存在包含关系，那么refNode.compareDocumentPosition(node)的返回值必定是20.

我们常用 & 按位与来获取具体掩码位是否被占据，比如 refNode.compareDocumentPosition(node)&16就是考察node是否是refNode的后代节点。如果是，那么运算结果是非0的。使用这个规范方法可以模拟contains.

#### 插入文本

innerText和outerText这两个属性是在**HTMLElement类型上定义的访问器属性**，用于访问和设置元素内部的文本内容。

读取元素的innerText时，会按照从上到下，从左往右的顺序，拼接所有的文本节点的字符串内容并返回。

和innerText相似的属性是DOM3级规范中在**Node类型上定义的textContent属性**，这个属性大体和innerText一致，不过还是有区别:
* textContent属性是Node拥有，对于不能包含文本节点的节点，该属性**返回null**。
* textContent属性的字符串可以包含style 和script元素下的文本字符串，而innerText则不行。
* innerText不会返回隐藏元素的文本，而textContent会。

***

#### 滚动

scrollIntoViewIfNeeded()方法只有在调用元素**不在当前视口中**时才会触发滚动，否则是不会触发滚动的。在触发滚动后，会尽可能让调用元素位于**当前视口的垂直方向的中部**。

目前谷歌浏览器支持这个方法。