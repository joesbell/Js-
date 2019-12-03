# DOM2 和 DOM3

在DOM1级规范中已经定义了HTML和XML文档的底层结构和基本接口及API,DOM2级和DOM3级则**在DOM1级基础上**提供了更多的接口API，同时也支持更高级的XML特性。

正如DOM1级规范分为 DOM1级 Core 和 DOM1级 HTML一样,DOM2级规范分为以下几类:
* DOM2级 核心Core 在DOM1级基础上为节点添加更多属性和方法
* DOM2级 视图View 为文档定义基于样式信息的不同视图
* DOM2级 事件Event 说明事件和文档如何交互
* DOM2级 样式Style 定义如何**访问和修改CSS样式**信息
* DOM2级 遍历和范围Traversal and Range 引入了**遍历DOM文档和选择特定范围的新接口**。
* DOM2级 HTML 在DOM1级 HTML的基础上添加更多属性方法和新接口。

***

### DOM变化

DOM2级核心没有引入新的类型，只是为**现有的类型**增加的新的方法和新的属性。DOM2级视图和DOM2级HTML也是只是为 现有类型 增加新的方法和新的属性。


***
#### 针对XML命名空间的变化

针对XML命名空间，其实是针对XHTML文档。网页如果想要支持XML命名空间，必须是XHTML格式。

要使用XHTML，首先得为XHTML引入 DTD文档类型定义文件,XHTML的DTD有三种类型:
* 严格类型

    \<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" 
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
    
* 过渡类型

    \<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    
* 框架类型

    \<!DOCTYPE html
    PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN"
    "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
    
一般而言使用过渡类型即可。

在**Element类型**上定义了关于命名空间的3个属性:
* localName 不带命名空间前缀的节点名称
* prefix  命名空间前缀。     **如果没指定为null**。
* namespaceURI 命名空间URI。**如果没指定为null**。
在带有命名空间前缀的情况下， 元素的 **tagName==nodeName==prefix+":"+localName**，而不带有命名空间前缀的情况下，这三者相等。

在**Node类型**上定义了关于命名空间3个方法：
* lookupPrefix(命名空间) 返回元素在该命名空间下的前缀
* lookupNamespaceURI(命名空间前缀)  返回在元素在该前缀下的命名空间URI
* isDefaultNamespace(命名空间) 如果元素的默认命名空间为该命名空间返回true，否则返回false。 或者说 **如果该元素的命名空间没有前缀，那么返回true**。

在**Document类型**上新增了三个有关命名空间的方法:
* 1.createElementNS(namespaceURI,tagName) 创建一个属于namespaceURI命名空间的tagName元素
* 2.createAttributeNS(namespaceURI,attrName) 创建一个属于namespaceURI命名空间的attrName特性
* 3.getElementsByTagNameNS(namespaceURI,tagName) 获取namespaceURI命名空间下的所有标签名为tagName的节点的**动态HTMLCollection**集合

而关于命名空间下的特性，在**Element类型**上还新增了以下方法:
* getAttributeNS(namespaceURI,attrName) 获取命名空间namespaceURI下的特性名为attrName的特性值
* getAttributeNodeNS(namespaceURI,attrName) 获取命名空间namespaceURI下的特性名为attrName的特性节点
* getElementsByTagNameNS(namespaceURI,tagName) 获取命名空间namespaceURI下的标签名为tagName的节点HTMLCollection集合。 和Document下该方法虽然功能相同，但是却不是同一个函数。
* hasAttributeNS(namespaceURI,attrName) 返回元素是否拥有命名空间namespaceURI下的特性名为attrName的特性
* removeAttributeNS(namespaceURI,attrName) 删除元素命名空间namespaceURI下的特性名为attrName的特性
* setAttributeNS(namespaceURI,attrName,attrValue) 元素设置命名空间namespaceURI下的特性名为attrName的特性值为attrValue
* setAttributeNodeNS(attrNode) 元素设置attrNode为特性节点。

在**NamedNodeMap类型**上新增了有关命名空间的下列方法:
* getNamedItemNS(namespaceURI,localName) 获取命名空间namespaceURI下名为localName的节点
* setNamedItemNS(node) 在集合中添加node节点。
* removeNamedItemNS(namespaceURI,localName) 移除命名空间namespaceURI下名为localName的节点

上述提到的所有有关命名空间的方法实际上只有在文档拥有多个命名空间时才有必要使用。一般的HTML文档中，并没有多大用处，因为这些命名空间下的方法均有不要求命名空间的版本。
而这些不需要命名空间的版本往往会无视命名空间。

总的来说，这些有关命名空间的方法和属性的价值目前来看都不大。只需要有所了解即可。

***
#### 其他方面的变化

首先是在**DocumentType类型**上新增了两个属性：
* publicId
* systemId
通过这两个属性可以访问 DOCTYPE 声明中的详细内容。 如果**没有内容则返回空字符串**。

        
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"
        "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        
        在这段DOCTYPE声明中:
        publicId为 "-//W3C//DTD XHTML 1.0 Transitional//EN"
        systemId为 "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"
        
其次是在**Document类型**上新增了下列属性和方法(和命名空间无关的)：
* importNode(oldNode,deepClone) 从**另外一个文档**中克隆一个**新的节点**到本文档中。是否深度克隆节点树由deepClone参数决定。
* defaultView 始终指向文档自身的window(self)对象

在实际的浏览器实现中，发现Element类型的cloneNode方法也可以实现跨文档的克隆复制，这是不合规范的。从规范的角度来说，只有importNode方法才允许跨文档复制。 

在**DOMImplementation类型** (也就是**document.implementation对象**的类型)上新增了下列方法:
* createDocumentType(文档类型名,publicId,systemId) 创建一个DocumentType文档类型对象
* createDocument(命名空间,根元素，文档类型) 创建一个新的文档对象
* createHTMLDocument(title) 创建一个新的HTML文档对象，该HTML文档的title元素的内容为title

在**Node类型**上新增了两个方法:
* isSameNode(otherNode) 判断两个节点是否是同一个节点
* isEqualNode(otherNode) 判断两个节点的各个属性值是否完全相同

需要注意的是,isEqualNode的各个属性值相同必须是完全相同，并且是递归的。
也就是说两个节点如果有子节点的话，必须**子节点的数目相同**并且**子节点的各个属性也相同**,如此递归地下去，isEqualNode方法才会返回true。

在**HTMLIframeElement和HTMLFrameElement**类型上新增了**contentDocument属性**，指向框架窗口自身的document文档对象。
为了兼容IE8以下版本，可以使用**contentWindow属性**先获取框架窗口自身的window对象再获取document类型对象。

***

### 样式

在HTML定义样式的方式有以下3种：
* link元素 引入的外部样式表文件
* style元素 定义的嵌入式样式
* style特性 定义的针对某个元素的特定样式

在DOM2和DOM3级中围绕这三种方式，提供了一系列API。

***

#### 访问元素的样式

首先说通过**元素的style属性**获取**CSSStyleDeclaration类型对象**访问元素的style的方式，这种方式**只能**访问元素的**style特性定义的**针对该元素的特定样式信息。

在元素的**style特性**中指定的任何样式信息，都会在这个style属性上**表现出相应的同名属性**，特殊地:
* 对于font-size这种**具有 -号**的CSS属性名，转化为**驼峰命名**的fontSize属性进行访问。
* 对于与JavaScript中的关键字**float**相同的CSS属性名，转化为**cssFloat属性**来访问。(IE中是 styleFloat属性 )

相应的，修改这个style对象的各个属性，也会改变元素的style特性的值，并且会影响到元素本身的样式信息。也就是说，**元素的style特性和元素的style属性是同步的**。

CSSStyleDeclaration类型拥有下列属性和方法，有助于操作样式信息：
* cssText  表示元素style特性值的字符串，可读可写。 
* length   表示当前CSSStyleDeclaration对象包含的CSS属性的数量
* parentRule  
* getPropertyPriority(name) 获取CSS属性名为name的优先级，返回 "important" 或者 ""**空字符串**。
* getPropertyValue(name) 获取CSS属性名为name的属性值。如果没设置，那么返回 "" **空字符串**。 
* item(index) 返回第index个CSS属性名，也可以使用数组访问方式 \[index\] 来进行访问 
* removeProperty(name) 移除CSS属性名为name的属性。
* setProperty(name,value,priority) 为CSS属性名为name的属性设置属性值value，设置优先级为priority。优先级可选字符串为"important"或者""**空字符串**。

上面说的这种通过元素的style属性获取CSSStyleDeclaration对象的方式获取到的样式信息是**可读可写的**，但是可获取到的样式信息范围**仅限于元素上style特性指定的**。

为了获取元素真实的经过层叠后的样式信息，DOM2级样式为 document.defaultView 也就是 window对象新增了一个方法:**getComputedStyle(ele,pseudo-ele)**.
这个方法也是返回一个CSSStyleDeclaration类型的对象，不过该对象的样式信息是经过**层叠后的元素当前的真实样式信息**。 

需要注意的是，这个样式信息虽然也是CSSStyleDeclaration类型的对象，但是，这个对象是**只读的**，一旦发生写入操作就会抛出异常。

同时，对于那些没有手动设置值的CSS属性，在这个对象里的**值为默认值**而不是空字符串。 这些CSS属性的默认值是由浏览器自身决定的，不同的浏览器可能默认值不同。

IE低版本不支持这个方法，而是在元素上有个**currentStyle属性**返回计算后的样式信息。

***

#### 操作样式表

对于link和style引入的样式表信息，我们可以通过**CSSStyleSheet类型**的对象来进行访问和操作。

CSSStyleSheet类型继承自**StyleSheet类型**，因此CSSStyleSheet类型就继承了以下定义在StyleSheet类型上的属性:(**除了disabled之外全是只读属性**)
* disabled 表示是否禁用该样式表，如果设置值为true则表示禁用
* href     如果这个样式表是通过link元素引入，那么href表示样式表文件的地址，否则为**null**.
* media    表示该样式表所支持的媒体类型的集合。如果link或者style元素中没有设置media特性，那么集合为空列表。 而**空列表表示适用于所有媒体类型**。
* ownerNode 如果样式表是通过link或者style元素引入的，那么ownerNode就表示的是 style元素节点或者link元素节点。否则为null
* parentStyleSheet 如果样式表是通过@import引入的，那么parentStyleSheet表示的是引入样式表的那个样式表对象。
* title 表示ownerNode的title特性值
* type 表示样式表类型的字符串，对于CSS来说就是"text/css"

**CSSStyleSheet类型**新增了下列属性和方法:
* cssRules 样式规则的集合。在IE下是 rules属性
* ownerRule 如果样式是通过@import导入，那么ownerRule指向导入的那个样式表对象，否则为null。
* deleteRule(index) 删除cssRules集合中的第index个规则。在IE下为removeRule
* insertRule(rule,index) 在cssRules集合中的第index位置插入rule。在IE下为addRule

**获取CSSStyleSheet对象**的方式有两种:
* 通过link或者style元素的**sheet属性**获取该link或者style元素引入的样式表 (在IE下为styleSheet属性)
* 通过**document对象的styleSheets属性**获取文档所有样式表信息的**动态集合**

实际上CSSStyleSheet对象的**样式信息**是由一条又一条的CSSRule对象的**样式规则**组成的。

**CSSRule类型**具有以下属性：
* cssText 表示CSS规则的**完整字符串**。这个字符串是 **只读的**。 格式： 选择符 { 样式内容 }
* parentRule 如果没有通过import引入规则，那么为null
* parentStyleSheet 表示包含这条样式规则的样式表对象。
* type 表示样式规则的类型。值是几个常量。一般而言为1 表示是 style rule。

而**CSSStyleRule类型**继承自CSSRule,又引入了下列属性：
* selectorText 表示这条规则的选择符。
* style 表示这条规则本身的CSSStyleDeclaration对象。

现在我们来总结一下：
* CSSStyleSheet类型表示的是**层叠样式表对象**。
* CSSRule类型表示的是**样式规则对象**.
* CSSStyleDeclaration类型表示的是 **具体的样式信息描述**。

在一个CSSStyleSheet对象下，可以有多个CSSRule对象，通过cssRules属性可以访问到这些CSSRule对象的集合。而每个CSSRule对象都有一个属性style指向CSSStyleDeclaration对象来描述具体的样式信息。

我们可以通过link或者style元素的sheet属性获取CSSStyleSheet对象，也可以通过document.styleSheets获取文档中引入的所有CSSStyleSheet对象的动态集合。

获取到具体的层叠样式表对象后，我们可以通过insertRule或者deleteRule等方法新增或者删除CSSRule样式规则，这些样式规则中包含具体的CSSStyleDeclaration对象来描述具体的样式信息。

***

#### 元素大小

元素如何确定在页面中的大小并不属于样式规范的内容，但是却和样式的相关属性相关，并且十分常用。

***

##### 偏移量 offsetXXX

元素的偏移量是相对于定位元素的。

所谓定位元素offsetParent，table对于其下面的td就是其定位元素，同理body对于其下面的table也是其定位元素。**body元素没有定位元素**。

定位元素和父元素没有任何关系，他们很可能不是同一个元素。 我们可以通过设置样式中的 **position:relative** 来让一个元素成为定位元素，
将元素设置为**绝对定位position:absolute**，也可以让一个元素成为定位元素。

基于定位元素，元素具有下列属性(**均是只读属性**):
* offsetTop 自身相对于定位元素的垂直方向偏移量
* offsetLeft 自身相对于定位元素的水平方向偏移量
* offsetHeight 自身在垂直方向占据空间的大小(**包括边框大小**)
* offsetWidth 自身在垂直方向占据空间的大小(**包括边框大小**)

需要注意的是，偏移量相关的元素必须是在**页面布局上的具有可见性(占据位置)**的，也就是说**visibility可以为hidden，但是display一定不能为none**，否则offset相关属性都为0。
同时，所有的偏移量相关的属性都是需要实时的计算的，准确的说，是**等待页面重排**完成以后再进行获取。因此最好不要频繁访问这些offset相关的属性。

***

##### 客户区大小 clientXXX

客户区的大小指的是元素及其内边距(**不包含边框**)所占据的空间大小。

客户区大小的有以下属性定义在**Element类型上**(**均为只读**):
* clientWidth 表示水平方向的元素及其内边距所占据的空间大小。
* clientHeight 表示垂直方向的元素及其内边距所占据的空间大小。
* clientTop 表示**上边框大小**!而不是距离视口上方长度
* clientLeft 表示**左边框大小**!而不是距离视口左边长度

对于一些特殊元素，比如span，其客户区大小相关的**clientXXX属性永远返回0**。

和偏移量相同，使用客户区大小相关的属性，也是每次访问都需要重新计算的，因此最好不要频繁访问。


***

##### 滚动大小 scrollXXX

滚动大小，指的是**包含滚动内容的元素**的大小。

在Element类型上，具有以下属性跟滚动大小有关:
* scrollTop    滚动元素中被隐藏在滚动元素视口上部的内容的高度。 **可读可写**
* scrollLeft   滚动元素中被隐藏在滚动元素视口左边的内容的宽度。 **可读可写**
* scrollHeight 滚动元素自身内容区域的高。 **只读**
* scrollWidth 滚动元素自身内容区域的宽。 **只读** 

通过控制可写属性 scrollTop和scrollLeft我们可以滚动内容区域，就跟在拖动滚动条一样。

不同浏览器的滚动条区域是不同的，有的滚动条在body元素上，有的滚动条在html元素上。
因此如果窗口发生了滚动，当body.scrollXXX为0时，不妨试试document.documentElement.scrollXXX来获取滚动距离。

计算浏览器默认滚动条宽度的方式是通过 元素的offsetWidth-元素的scrollWidth.原理是offsetWidth是包含元素带有的滚动条区域的，而scrollWidth只是包含元素的滚动区域。
但是某些元素比如HTML元素比较特殊，scrollWidth等于offsetWidth，不符合这个规律。


***

### 遍历

DOM2级遍历规范规定了两个用于辅助完成DOM树遍历的类型:
* NodeIterator
* TreeWalker

这两个都可以基于给定的根节点进行 **深度优先遍历**。 

需要注意的是这里的遍历是以**Node节点类型**为最小遍历单位的。 

之前我们曾经讲过 DOM扩展中的 DOM元素遍历，当时我们说过那不是DOM规范里的，DOM元素遍历的最小单位是 Element元素。

***

#### NodeIterator

NodeIterator类型可以通过 **document.createNodeIterator**方法来进行创建,这个方法包含下列参数:
* 指定的根节点
* 遍历哪些节点  这是个位掩码，存储在NodeFilter上，总共有13个，分别对应**12个Node类型和全部节点类型**。 互相可以使用 | 进行位运算，来组合多个节点类型。
* 遍历的过滤器  可以有两种方式:1. 包含 acceptNode方法的对象 作为过滤器。  2.单纯的函数 作为过滤器。
* 是否进行实体扩展 这个在HTML文档中无用。

通过以上方法即可创建一个用于深度遍历指定节点的遍历器。

NodeIterator类型具有以下方法:
* nextNode() 首次调用nextNode(),返回指定的根节点。 如果已经遍历到了最后一个节点，再次调用时返回null。
* previousNode() 如果nextNode方法已经返回null时，调用previousNode返回最后一个节点。 如果已经遍历到了最初指定到的根节点，再次调用时返回null、

通过这两个方法，我们就可以遍历整个DOM树了，还可以选择顺序深度遍历还是逆序深度遍历。 顺序和逆序深度遍历的结果的顺序是相反的。

***

#### TreeWalker

TreeWalker是NodeIterator的更高级版本，功能更加强大。

TreeWalker对象可以通过 document.createTreeWalker方法进行创建。参数同创建NodeIterator**基本一致**。

这里说明一下和NodeIterator的**区别**:
* **过滤器的返回值区别**

    过滤器的返回值中除了**NodeFilter.FILTER_ACCEPT和NodeFilter.FILTER_SKIP**，还有一个额外的**NodeFilter.FILTER_REJECT**。
    在NodeIterator的过滤器返回值中NodeFilter.FILTER_SKIP和NodeFilter.FILTER_REJECT效果是一致的，都表示仅仅跳过(过滤掉)该节点。
    但是在TreeWalker中，NodeFilter.FILTER_REJECT返回值表示的是 **不仅跳过该节点，还要跳过该节点的子树**。
* **创建遍历器时的当前节点的区别**

    对于NodeIterator类型来说，创建该类型的遍历器后，当前节点可以说是为null，必须通过nextNode()方法才能获取指定的根节点。
    但是对于TreeWalker类型来说，**创建遍历器时的当前节点就是指定的根节点**，不需要再调用nextNode()方法获取指定的根节点了。

TreeWalker类型提供了以下**方法**:
* parentNode()
* nextNode()
* previousNode() 
* firstChild() 
* lastChild() 
* nextSibling() 
* previousSibling() 

这些方法的作用是将TreeWalker中的当前节点变更为某个节点并返回该节点。

同时提供了以下**属性**:
* currentNode 该属性指向TreeWalker遍历器的当前节点，是一个**可读可写的访问器属性**,我们可以直接修改currentNode属性来更改遍历器的遍历位置,**甚至可以跟创建该遍历器时指定的根节点及其节点子树无关**!

通过上面TreeWalker提供的属性和方法，我们可以自由地在DOM树中进行遍历，而不仅仅只是前后节点遍历，可以这么说，通过TreeWalker，我们可以自由地在DOM树间随心所欲地行走。

***

### 范围

DOM2级范围规范中定义了 范围(Range)接口。范围接口提供了更为精细地选择DOM节点范围的方式。

***

#### DOM(标准)中的范围

DOM2级规范中规定Document类型上提供创建范围的**createRange**()方法。

范围由Range类型实例表示，Range类型提供了很多方法和属性，下面逐一说明。

关于**范围在文档中的位置**，Range类型提供了下列属性:
* startContainer  包含范围的起点的节点( 范围中第一个节点的父节点)
* endContainer    包含范围的终点的节点( 范围中最后一个节点的父节点) 
* startOffset     范围在startCountainer中的偏移量。如果startContainer是文本，注释，CDATA节点，那么表示范围跳过的字符数，否则，表示startContainer到范围起点间**子节点**(而不是元素)的个数
* endOffset       范围在endContainer中的偏移量。计算同startOffset.
* commonAncestorContainer: startContainer和endContainer的**最近祖先节点**(在DOM树中最深的那个)。

***

##### 简单的范围选择

关于**简单的设置范围起始**,Range类型提供了下列方法:
* selectNode(node)  以**node节点及其子节点树**作为范围。
    
    此时:
    startContainer为node的父节点。
    endContainer为node的父节点。
    startOffset为node在其父节点的直接子节点数组中的索引。
    endOffset为node在其父节点的直接子节点数组中的索引+1。 
    
* selectNodeContents(node)  以**node的子节点树**作为范围。 此时startContainer为node节点。

    此时:
    startContainer为node。
    endContainer为node。
    startOffset为0。
    endOffset为node的直接子节点数组的长度。 
    
* setStartBefore(refNode)  以**refNode的上一个同胞节点**为边界，**refNode在范围里**。

    此时:
    startContainer为refNode的父节点。
    startOffset为refNode在其父节点的直接子节点数组中的索引。
    
* setStartAfter(refNode) 以refNode为边界，**refNode不在范围里**。

    此时:
    startContainer为refNode的下一个同胞节点的父节点。 **如果下一个同胞节点为null，那么使用refNode的父节点。**
    startOffset为refNode在其父节点的直接子节点数组中的索引+1。
    
* setEndBefore(refNode) 以refNode为边界， **refNode不在范围里**。

    此时:
    endContainer为refNode的上一个同胞节点的父节点。 **如果上一个同胞节点为null，那么使用refNode的父节点。**
    endOffset为refNode在其上一个同胞节点的父节点的直接子节点数组中的索引。
    
* setEndAfter(refNode) 以**refNode的下一个同胞子节点**为边界， **refNode在范围里**。

    此时:
    endContainer为refNode的父节点。
    endOffset为refNode在其父节点的直接子节点数组中的索引+1。
    

可以看到，简单的选择范围的方法，选择空间较小，只能**在节点的前后一个节点的范围内选择某个节点作为边界**。

***

##### 复杂的范围选择

不同于简单的范围选择只能在某个节点的前后节点间选择节点作为边界，复杂的范围选择的边界选择范围是任意的。

复杂的范围选择使用以下两个方法完成：
* setStart(refNode,offset) 设置范围起始容器和偏移

    此时：
    startContainer为refNode,
    startOffset为offset

* setEnd(refNode,offset) 设置范围终止容器和偏移
    
    此时：
    endContainer为refNode,
    endOffset为offset

实际上，简单的范围选择的方法完全可以使用这两个方法来替代。复杂的范围选择的更大的作用是用于选择节点内部的一部分纳入范围。
甚至，我们可以选择文本节点下的部分文本字符串，这是普通的简单范围选择办不到的。

***

##### 复制和删除DOM范围中的内容

对于范围之内的内容，Range提供了以下方法用于删除内容:
* deleteContents()  直接删除范围内的内容，对范围外自动补全标签。**返回undefined**
* extractContents() 删除范围内的内容，对范围内内容和范围外内容自动补全标签。 返回一个DocumentFragment对象，该对象包含被删除的已自动补全标签的内容。

也提供以下方法用于复制范围内的内容:
* cloneContents() 复制范围内的内容并返回一个DocumentFragment对象，该文档片段下的被复制的内容标签会被自动补全。源文档DOM不会改变。

上面所说的智能补齐标签是自动在后台进行的，无需我们干涉，这种自动补全总会保证格式是良好的一一也就是标签闭合符合规范。

***

##### 新增DOM范围中的内容

Range类型提供了以下方法用于新增DOM范围里的内容:
* insertNode(node)  在起始范围之前新增一个node，只受起始节点位置的影响，不会更改原本DOM的标签。
* surroundContents(node) 在整个范围外部新增一个节点node，使node成为原本范围的直接父节点。 **范围的endContainer和startContainer必须是同一个节点**，否则会抛出异常。

***

##### 折叠范围

折叠范围是非常简单，用途是调整范围的开始节点或终止节点。

Range类型提供了和折叠范围用惯的下列属性和方法：
* collapsed 表示范围是否已经折叠了。 如果**开始节点等于终止节点**，表示已折叠，返回true。否则返回false。
* collapse(**toStart**) 如果toStart为true，那么表示设置终止节点为起始节点。否则设置起始节点为终止节点。 该函数调用后，范围必定折叠。此时collapsed属性返回true。 

我们只需要记住一点就行，**当且仅当范围的endContainer===startContainer 和 endOffset===startOffset时，collapsed属性返回true**。

***

##### 比较DOM范围

比较DOM范围，其实比较的就是两个范围的起点和终点。

Range类型提供了一个方法 **compareBoundaryPoints(how,srcRange)**,用于比较两个范围的起始和终止节点关系。
该方法返回值有三种情况：
* 0 两个选择节点相等
* 1 自身选择的节点在srcRange选择的节点的后面
* -1 自身选择的节点在srcRange选择的节点的前面

比较节点的选择方式由how参数决定，而前后位置关系是按照**深度遍历优先**的顺序决定的。

how参数是由规定在Range上的常量中选择的:
* Range.END_TO_END  选择自身的和srcRange的结束节点进行比较。
* **Range.END_TO_START** 选择**自身的开始节点**和**srcRange的结束节点**进行比较。 
* **Range.START_TO_END**  选择**自身结束节点**的和**srcRange的开始节点**进行比较。 
* Range.START_TO_START 选择自身的和srcRange的结束节点进行比较。 

多次比较范围的起始和终止的节点关系，我们甚至可以得到2个范围的关系:相交，包含，前后等等。

*** 

##### 清理和拷贝范围

如果想要直接复制一个范围的拷贝，那么可以使用 **cloneRange**方法，该方法返回一个范围对象的副本。 但是该副本和原本的返回不会相互影响。

当完全使用完范围之后，最好使用 **detach**方法清理范围，以便将范围从文档中分离出来。

清理范围并不代表会将范围对象本身设为null，而仅仅是告诉引擎可以准备回收相关内存。为了达到这个目的，调用detach完毕后我们依旧需要手动将范围对象设为null.

***

#### IE8及其以前的范围

IE8及其以前的版本并不支持DOM范围，支持的是另外一种范围 一一 **文本范围**。 这是低版本IE浏览器专有的。

对于文本范围，可以通过 **document.body.createTextRange()** 创建。

文本范围主要提供了以下属性和方法获取**文本范围的基本自身属性**:
* text              属性。表示文本范围内的文本
* htmlText          属性。表示文本范围内的HTML代码。
* parentElement()   方法。获取文本范围的父元素。

文本范围具有以下方法来进行**简单的选择文本范围**:
* findText(text) 方法。将文本范围选择到text字符串所在的范围。返回值如果是true，那么说明存在这个text文本，否则等于是范围选择失败了。
* moveToElementText(node) 方法。类似于DOM范围中的selectNodeContents(node),此时，文本范围包含该node下的所有文本内容。

文本范围具有以下方法来进行 **复杂的选择文本范围**:
* move(单位,offset)        将文本范围的 起始和终止位置 设置为**以当前起始**偏移offset个单位的位置。
* moveStart(单位,offset)   将文本范围的 **起始位置** 设置为**以当前起始**偏移offset个单位的位置。
* moveEnd(单位,offset)     将文本范围的 **终止位置** 设置为**以当前终止**偏移offset个单位的位置。
* expand(单位)             将文本范围按照单位重置。缩小的文本范围会按照单位进行扩大。

这里需要特殊注意的一点，如果范围已经被折叠。首先调用moveStart**向后移动**起始位置后，**终止位置也会变成现在的起始位置，而不是原来的位置**。

选择单位是以下字符串常量：
* "character" 字符
* "word"      单词(连续 非空字符 组成)
* "sentence"  句子(连续 非感叹号，非句号，非问号字符 组成)
* "textedit"  文本编辑区，或者说当前的范围选区

**操作文本范围内的内容**的方式有两种:
* text赋值  为文本范围的text属性赋值，替换当前文本范围的内容为赋的值。
* pasteHTML(html代码) 将文本范围内的内容替换为html代码

**折叠文本范围**的相关方法和属性有两种：
* collapse(toStart) 同DOM范围的折叠方法一致。
* boundingWidth **文本范围的像素宽度**。 如果为0，说明已经被折叠。

**复制文本范围**的方法：
* duplicate() 返回一个文本范围的副本。 同DOM范围的 cloneRange()

**比较文本范围**的方法有以下几种:
* isEqual(textRange) 如果文本范围的起点和终点一致 返回true。
* compareEndPoints(how，srcRange) 这个方法和DOM范围的 compareBoundaryPoints类似。 
* inRange(range) 自身范围是否包含了range。

how字符串 代表如何选择节点:
* "StartToEnd" 将自身的起始节点和srcRange的终止节点比较
* "StartToStart" 将自身的起始节点和srcRange的起始节点比较
* "EndToEnd" 将自身的终止和srcRange的终止节点比较
* "EndToStart" 将自身的终止节点和srcRange的起始节点比较

这里的how的选择节点方式和标准的DOM范围的how的选择方式是**相反**的。