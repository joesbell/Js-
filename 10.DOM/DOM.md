# DOM

DOM是文档对象对象模型(Document Object Model)，用于描述针对HTML和XML文档的API。 

我们可以通过DOM提供的这些API,对文档的节点树进行添加移除修改。

JavaScript是操作DOM的一种方式，一种实现，也是目前最为广泛使用的实现，通过JavaScript我们能够操作DOM对象从而对文档进行操作。

***

### 节点层次

在DOM中，文档是被描述为一个**多层次节点的结构**。 每个节点都拥有各自的特点、数据和方法,并和其他节点具有着联系。

整个文档形成了**以某个节点为根节点的树形结构**。 这个根节点我们叫做**文档节点**，也叫做**文档元素**。

在HTML中， html元素是通过Element节点表示，特性元素是通过Attr节点表示，注释节点是通过Comment节点表示。文档中的每一个数据都挂靠在节点上，没有例外。
 
总有具有**12种节点**，而这所有的节点都继承自同一个父类型。


#### Node(节点)类型

DOM1级定义的Node接口是所有节点必须实现的接口，而与之对应的，在JavaScript中， 这个Node接口是作为Node类型进行实现的。 因此，所有的节点都共享着共有的属性和方法。


##### Node属性中表示自身节点属性的属性

Node类型有3个表示自身节点属性的属性：
* nodeType 用于描述节点类型
* nodeName 用于描述节点名称
* nodeValue 用于描述节点值

而HTML文档中一共拥有12种类型的节点：
* ELEMENT_NODE	                    元素节点            nodeType的值:1
* ATTRIBUTE_NODE	                特性节点            nodeType的值:2
* TEXT_NODE	                        文本节点            nodeType的值:3
* CDATA_SECTION_NODE	            CDATA节点           nodeType的值:4
* ENTITY_REFERENCE_NODE	            实体引用名称节点     nodeType的值:5
* ENTITY_NODE	                    实体节点            nodeType的值:6
* PROCESSING_INSTRUCTION_NODE	    处理指令节点         nodeType的值:7
* COMMENT_NODE	                    注释节点            nodeType的值:	8
* DOCUMENT_NODE	                    文档节点            nodeType的值:	9
* DOCUMENT_TYPE_NODE	            文档类型节点         nodeType的值:10
* DOCUMENT_FRAGMENT_NODE	        文档片段节点         nodeType的值:11
* NOTATION_NODE	                    DTD声明节点         nodeType的值:	12

利用节点的nodeType属性我们可以迅速地判断节点的类型。一般而言判断节点的类型，最好直接使用该节点的nodeType属性同**代表该节点类型的数字**进行比较，这样可以最大限度的兼容。

##### Node属性中表示节点关系的属性
Node类型中有以下表示节点关系的属性：
* childNodes 返回包含该节点的所有**直接子节点的类数组NodeList对象**。需要注意的是，这个对象是基于DOM结构动态执行查询的结果，因此是会随着DOM结构变化而时刻变化的并且开销较大。
* parentNode 返回该节点的**直接父节点**
* nextSibling 返回该节点的下一个同胞节点。 如果该节点已经是最后一个子节点，那么返回null。
* previousSibling 返回该节点的上一个同胞节点。 如果该节点已经是第一个子节点，那么返回null。
* firstChild 返回该节点的第一个直接子节点。 如果该节点没有直接子节点，那么返回null。
* lastChild 返回该节点的最后一个直接子节点。 如果该节点没有直接子节点，那么返回null。
* ownerDocument  返回包含该节点的文档节点(根节点)。 即使该节点被移除，该属性依旧指向文档节点。因为**被删除只是说在文档结构中没有该节点的位置罢了，并不是真正从文档中删除**。
* hasChildNodes() 返回该节点是否包含子节点。

一个父节点的可以有多个直接子节点，这些都子节点都是父节点的childNodes列表中的一个，父节点同时还可以通过lastChild或者firstChild属性来直接索引最后一个或者第一个直接子节点。

而对于位于同一个父节点下的所有直接子节点来说，他们互相都是同胞节点，可以使用nextSibling属性或者previousSibling属性来访问其相邻的同胞节点。

##### Node属性中操作节点的方法

首先我们需要明白的是，上面所说的表示节点关系的属性都是只读属性，也就是说，不能通过为节点关系属性赋值而改变节点结构。

改变节点的位置关系，只能通过Node属性中操作节点的方法来进行:
* appendChild(node) 在父节点的直接子节点中，插入node作为最后一个直接子节点。 如果node原来就在父节点的直接子节点列表中，那么该方法为将**该node移动到最后一个直接子节点的位置**。 方法结果返回node。
* insertBefore(node,refNode) 在父节点的直接子节点中，**插入node作为已存在的refNode的previousSibling**同胞节点。如果node本身就存在在子节点列表中，那么首先会**被移除后再进行插入操作**。如果refNode为null，该方法等效于appendChild(node)。 方法结果返回node。
* removeChild(node) 在父节点中的直接子节点中，移除node节点。 **被移除的node节点依旧属于该文档，只是在该文档中没有位置罢了**。 方法结果返回node。
* replaceChild(node,oldNode) 在父节点中的直接子节点中,替换oldNode节点为node节点。 方法结果**返回oldNode**。

以上是具有子节点的父节点所支持的方法，如果该节点不能作为父节点,那么调用以上方法可能会直接报错。

而通用的操作节点的方法只有两个:
* cloneNode(deepClone) 用于克隆节点，如果参数为true,那么执行深复制，克隆该节点及其整个后代节点树。否则仅仅克隆该节点本身。 同时，**克隆的仅仅是节点的特性，节点的属性是不会被克隆的，因此节点上的监听事件也不会被克隆**。
* normalize() 用于将后代中的 **连续的文本节点合并** 以及 **删除nodeValue=""的文本节点**

具体细节参看 Node类型一一操作节点的方法.html 和 节点的normalize方法的注意事项.html

***

#### Document类型

Document类型是一种特殊的Node节点，表示的是整个文档，在HTML中，Document类型继承自HTMLDocument，其实例就是 document对象。

##### Document类型中的自身属性

对于Document类型来说:
* nodeType的值是 9
* nodeName的值是 #document
* nodeValue的值是 null
* parentNode的值是 null
* ownerDocument的值是 null
* 可以拥有最多一个DocumentType节点，最多一个Element节点。

##### Document类型中索引子节点的属性

Document类型有一些非常方便的索引其子节点的属性:
* doctype 索引到该文档的 DocumentType类型节点
* documentElement 索引到html节点
* body 索引到body节点

##### Document类型中关于请求的属性

Document类型上有一些关于请求的属性:
* URL 完整的地址。该属性只读的。
* referrer 点击到当前页面的的来源页面的URL,如果没有，那么为空。 该属性只读
* domain 表示当前页面的域名， 主要用于同源策略。 该属性可设置，但是一旦设置为更大的域后，不能缩小。

这些属性值都是**根据HTTP请求头获取**的。

关于 domain设置为更大的域后不能缩小：

    假设 域名 a.b.com下的网页中出现了漏洞，那么攻击就只能到此为止了。
    因为最多将domain设置为b.com. 那么至少 c.b.com 是安全的,是无法和被攻击的a.b.com通信的。这正是因为无法放大后再缩小。
    否则,一旦同级域名出现漏洞，这个漏洞会扩散到整个同级所有域名下。因为总是可以设置 domain= b.com 后再设置 domain=xxx.b.com。最终导致漏洞影响扩大。
    这就是为什么domain只能设置为更大的域而不能缩小的原因了。
    
domain属性的最大用处是用于同源页面的通信：
比如两个页面域名分别是 xxx.b.com 和 yyy.b.com ，由于domain不相同，因此无法互相访问对方的window对象。
而由于domain属性允许放大，所以将这两个页面的domain属性都设置为 b.com后，两个页面就能互相访问对方的window对象了。

##### Document类型自中查找元素的属性

Document类型提供了以下查找元素的方法:
* getElementById(id)  返回页面中元素**ID特性同id完全相同(包括大小写)**的元素。 如果没找到，**返回null**。
* getElementsByTagName(tagName) 返回页面中 **元素的标签名和tagName相同(不区分大小写)** 的元素的HTMLCollection集合,该集合依旧是**动态的HTMLCollection**，会根据DOM变化而改变。如果没有，**返回空HTMLCollection集合，不是[]数组！**。
    
    在HTMLCollection集合中，寻找元素不仅可以使用**数组的方括号表示法**\[index\],还可以直接使用方法 **item(index)**,甚至还可以根据元素的name特性使用 **namedItem(name)**来寻找元素。
    但是需要注意的是，在NodeList集合中是没有namedItem方法的。

* getElementsByName(name) 返回页面中**元素的name特性和name相同的元素**的NodeList集合。如果没找到，**返回空NodeList集合，不是[]数组！**。

这里需要注意的是，**getElementsByTagName 返回的是 HTMLCollection 对象**, 而 **getElementsByName 返回的是 NodeList 对象**.


##### document对象上的特殊集合

在document对象上有一些特殊集合:
* document.anchors 包含文档中所有带name特性的 <a>元素
* document.applets 包含文档中所有的<applet>元素  等效于 document.getElementsByTagName("applet")
* document.forms   包含文档中所有的<form>元素  等效于document.getElementsByTagName("form")
* document.images  包含文档中所有的<img>元素   等效于document.getElementsByTagName("img")
* document.links   包含文档中所有带href特性的 <a>元素

可以说，这些特殊集合都可以通过 getElementsByTagName 配合一些判断获取。因此document对象上的特殊集合属性其实没有多大用处。

##### DOM一致性检测

**document.implementation对象**拥有一个方法**hasFeature(type,level)** 用于检测浏览器实现了DOM的哪些部分。但是需要注意的是，这个方法不一定准确。因为浏览器可以在不实现DOM的某些特性时依旧针对这个方法返回true。
所以大体上，这个DOM一致性检测是没有什么用处的。

##### document对象上的 文档写入

document对象提供了对文档流进行写入的功能， document.write()的作用是将字符串写入文档流中。 需要注意的是 document.write是在 **文档流**上写入数据，如果一个**文档已经加载完，那么文档流就会被关闭**.

此时，调用document.write方法时，会**首先调用document.open()方法打开一个新的文档流，而这将清空原本文档的所有内容**，然后再写入，最后我们可以通过document.close()方法告诉浏览器文档流已经写入完毕，当然，最后不调用也可以。

需要注意的是，文档写入在严格型的XHTML中是无法使用的。

***

#### Element类型

Element 元素类型是最常用的节点类型了。 其作用主要用于表现 XML和HTML元素，提供对 元素的标签名，子节点和特性节点的访问。

##### Element类型的自身属性

Element类型中的自身属性:
* nodeType 的值是 1
* nodeName 的值是 标签名
* nodeValue 的值是 **null**
* parentNode 的值 可能是Document或者Element类型
* 子节点的类型多种多样

Element类型的标签名 除了使用 nodeName获取外,还可以使用 tagName属性获取，这是在Element原型上带有的属性，而Element原型继承自Node原型。

在**HTML文档**中，对于Element的标签名来说，尽管在文档中可以是大写也可以是小写(虽然**推荐是小写标签**)，但是，一旦使用 tagName或者nodeName获取该Element的标签名时，**实际返回的却全是大写**的。

在**XML文档**中则不同，XML文档中的Element的tagName或者nodeName返回的标签名**一律跟XML文档中的标签名大小写保持一致**。

##### HTML中的Element一一HTMLElement的5大基础标准特性

对于Element类型，我们这里着重说HTML文档中的Element类型，也就是HTMLElement类型。

HTMLElement类型具有一些标准特性：
* id  对应 元素属性上的id , 在Element原型上
* class 对应 元素属性上的**className** ，在Element原型上
* title 对应 元素属性上的title， 在HTMLElement原型上
* dir 对应 元素属性上的dir, 在HTMLElement原型上
* lang 对应 元素属性上的lang, 在HTMLElement原型上

**继承自Element的元素的标准特性不仅是上面这5个，具体可以查看Element原型和HTMLElement原型上的属性**。比如style，就在HTMLElement的原型上，style是属性，同时style也是DOM元素的特性。

不同继承自HTMLElement类型的元素的标准特性是不一定一样的，有可能**某些类型的元素的标准特性在这个基础上添加了一些**。因此只能说**这些特性是所有Element都具有**的。

但是我们需要记住的是，这5个标准特性**是一定能通过修改属性同时影响特性的**。 

其他的标准特性，**不一定会**修改属性的同时影响特性。

比如说 HTMLElement原型上的onclick，**虽然也是特性，但是修改属性onclick并不会改变特性的值**，只会影响实际作用。


##### 特性和属性 

这里我们需要区别的是 特性和属性:
* 特性： **DOM节点上的特性节点包含的属性**。
* 属性： **节点对象自身的JS属性**。

换句话说 :

    <div id="myid" class="myclass" dir="ltr" title="mytitle" lang="en">内容</div>
    对于这个HTMLElement节点来说，标签上的 id class dir title lang 是 这个HTMLElement节点的特性。
    而属性则是 该HTMLElement节点对象的属性:
    var obj=document.getElementById("myid");
    obj.id  对应节点的id特性
    obj.className 对应节点的class特性
    obj.dir 对应节点的dir特性
    obj.title 对应节点的title特性
    obj.lang  对应节点的lang特性

对于这几个标准特性来说，**特性和属性是有联系的**一一修改对应HTMLElement对象的属性的同时也会修改DOM节点上的特性内容，同时效果反映在DOM节点上。

HTMLElement类型的节点同时还可以有自定义特性，一般而言,自定义特性最好以 data- 前缀开头，以便区分。对于这些自定义特性来说，是无法直接通过HTMLElement对象的属性来获取值的。

下面我们就说 获取 Element或者说是 HTMLElement元素的特性的方式.

##### Element类型获取特性

每一个Element类型的对象都具有特性，这些特性可以是标准特性，也可以是用户自定义的特性，我们可以通过以下方法获取并控制特性:
* getAttribute(attrName) 获取attrName特性的值， **如果元素没有该特性，那么返回null**
* setAttribute(attrName,attrValue) 设置特性名attrName的特性的值为attrValue，如果该特性不存在，那么就是新建一个特性并设置值。通过这种方式**设置的特性名，自动会转化为小写**。
* removeAttribute(attrName) 删除特性名为attrName的特性。 **并不仅仅只是删除特性值，而是完全删除整个特性**

这里需要注意的是，**特性名本身是不区分大小写的**。

同时，有两类比较特殊的特性:
* **style特性** 当使用元素的**属性访问**时，返回的是一个**CSSStyleDeclaration对象**，而通过**特性访问**时，返回的只**是DOM标签里style里的字符串**。  **修改属性时会影响特性值**.
* **onXXXX的事件处理相关特性** 当使用元素的**属性访问时**，返回的是一个**Function对象**，而通过**特性访问**时，返回的只是**是DOM标签里事件处理特性里的字符串**。 **同时修改属性并不会影响特性值。**

具体 参看 HTMLElement元素的特性相关方法.html

##### 获取并操作特性节点

Element类型是唯一一个使用特性节点的类型的DOM节点。 而获取特性节点集合的方式就是通过 attributes属性 获取 NamedNodeMap集合对象，这个对象也是一个动态集合，会根据DOM节点的特性实时进行改变。
而上面我们所提到的特性其实就是Element的特性节点。 

NamedNodeMap集合对象具有以下方法操作特性节点:
* getNamedItem(name) 返回nodeName属性等于name的特性节点 **如果找不到该特性节点，那么返回null**
* setNamedItem(attrNode) 设置attrNode为特性节点
* removeNamedItem(name) 移除nodeName属性等于name的特性节点，**并返回该特性节点**,这里和 Element.prototype.removeAttribute方法不同。
* item(index) 获取集合中位于index位置的特性节点。

特性节点的nodeName就是特性名，特性节点的nodeValue就是特性值。

一般而言,这些方法是可以被Element类型上获取特性的方法所取代的。


##### 创建元素

document.createElement(tagName) 提供了创建Element对象的方法，更为准确的说，是提供了创建HTMLElement对象的方法。

该方法会**根据传入的tagName的不同，自动识别并创建对应的各种HTMLElement元素**。

比如传入"p",那么创建的对象就是HTMLParagraphElement类型，而传入"div"，则创建的对象是HTMLDivElement类型。如果是不存在的标签名，那么创建的就是HTMLUnknownElement类型。当然，这些类型都是继承HTMLElement的。

虽然从道理上来讲，document文档对象应该提供一个创建XML元素的方法，但是，考虑到应用场景大体是在HTML文档，所以并没有提供专门的创建XML元素的方法。 

因此，在HTML中，创建**类似XML元素**(之所以说类似，是因为真正的XML元素的标签名是区别大小写的)的方式依旧是document.createElement(HTML标签只是一些特别的XML的标签)，
对应的，创建出来的元素对象类型是HTMLUnknownElement，可以当做XML元素来使用。

在IE中，这个方法不仅可以传入标签名，还能传入完整的标签内容，里面附带有特性。但是需要注意的是，其他浏览器不支持这种用法，因此最好不要使用。

##### Element类型的getElementsByTagName

Element类型同样拥有getElementsByTagName(tagName)获取该元素的**所有后代**（不仅仅是直接子元素）中标签名为tagName的元素的HTMLCollection集合。 
但是需要注意的是，Element类型的这个方法和document.getElementsByTagName并不是同一个方法。

***

#### Text类型

在HTML中，所有的文本节点都是由Text类型元素表示。Text类型只能表示**纯文本内容**。 文本节点中不能包含HTML代码，除非经过转义。

##### Text类型的自身属性

Text类型中的自身属性:
* nodeType 的值是 3
* nodeName 的值是 #text
* nodeValue 的值是 纯文本的内容
* parentNode 的值 **只能是 Element类型**
* **不支持子节点**

##### 文本节点的相关属性

文本节点具有一些相关属性，这些相关属性有些是继承Text类型，有些是继承CharacterData类型。

继承CharacterData类型的属性如下:
* data 表示文本内容，值和nodeValue一样。
* length 表示文本的长度
* appendData(text) 将text内容添加到文本节点的末尾
* deleteData(offset,length) 删除从位置offset开始的length个字符
* insertData(offset,text) 将text文本插入到文本节点中的offset位置
* replaceData(offset,length,text) 使用text替换文本中的offset位置开始的length个字符。
* substringData(offset,length) 返回文本节点内容 从offset位置开始length个字符串 组成的子字符串。

继承Text类型的方法如下:
* splitText(offset) 将原本文本节点切分为两个文本节点，其中 \[0,offset) 范围的内容为原本文本节点， \[offset,原本长度-1\]范围的内容为新的文本节点，该新的文本节点会返回。

##### 创建文本节点

document.createTextNode(text) 方法是Document文档类型提供的创建文本节点的方法。

对于文本节点来说，其nodeValue文本内容是不能包含HTML代码的，如果包含了，那么在创建该文本节点的时候，某些字符**会被自动转义**。

***

#### Comment类型

Comment类型是文档中表示注释的类型。

##### Comment类型的自身属性

Comment类型中的自身属性:
* nodeType 的值是 8
* nodeName 的值是 #comment
* nodeValue 的值是 注释的内容
* parentNode 的值 **Document或Element类型**
* **不支持子节点**

##### Comment类型的相关属性和方法

首先我们要明白的是 Comment类型和Text类型一样，都**继承自 CharacterData 类型**，因此拥有所有CharacterData类型的方法和属性。
 
我们可以说，Comment注释类型就是一种特殊的Text文本类型。

document.createComment(comment)是Document文档类型提供的创建注释节点的方法。

***

#### CDATASection类型

CDATASection节点类型是一种原始数据节点，这里的原始是指CDATASection类型的节点的**内容不会被解析**。 **只有XML文档支持**这种类型的节点，HTML文档是不支持的。

##### CDATASection类型的属性

CDATASection类型**继承自Text类型**。 因此不但拥有Text类型的属性方法，也拥有CharacterData类型的属性方法。

CDATASection类型中的自身(Node)属性:
* nodeType 的值是 4
* nodeName 的值是 #cdata-section
* nodeValue 的值是 CDATA 数据
* parentNode 的值 **Document或Element类型**
* **不支持子节点**

至于继承自Text和Character属性的方法就不提了，参看Text类型。

需要注意的是，在HTML中想要创建CDATASection类型节点必须借助 **document.implementation.createDocument**() 方法创建一个 **XMLDocument类型**对象，再通过这个XML文档对象创建CDATASection对象。

***

#### DocumentType类型

DocumentType类型是一种非常不常用的类型，主要用于说明 文档类型 的节点。

>> <!DOCTYPE html> 就是DocumentType类型节点。

这里简单的说下其自身(Node)的属性:
* nodeType 的值是 10
* nodeName 的值是 doctype的名称
* nodeValue 的值是 null
* parentNode 的值 **Document类型**
* **不支持子节点**

DocumentType的name属性值和nodeName属性相同，均代表 <!DOCTYPE XXX> 标签内的XXX内容。

***

#### DocumentFragment类型

DocumentFragment类型是文档片段类型，是文档中的文档，在这个文档片段中的内容都不会在文档中具体呈现，并且这个文档片段也没有任何标记，就跟不存在一样。

##### DocumentFragment类型的相关属性

首先说继承自Node类型的属性:
* nodeType 的值是 11
* nodeName 的值是 #document-fragment
* nodeValue 的值是 **null**
* parentNode 的值 **null**
* ownerDocument 的值 **document**
* 子节点类型多种多样

创建DocumentFragment类型节点的方式只有一种: **document.createDocumentFragment()**方法.

##### DocumentFragment类型的应用

DocumentFragment类型主要应用于**临时存储节点树，防止多次渲染**。

当某个节点 appendChild(documentFragment)时，并不会真正的将documentFragment节点添加为子节点，而是将documentFragment节点的所有后代节点添加到相应位置上。

也就是说，文档片段类型是永远不会成为**文档树结构**的一部分的。

我们知道，每次更改DOM元素结构时，页面都会重新渲染，为了防止多次渲染，我们可以先将要添加的节点先放在文档片段类型对象中，最后再一次性放入文档树结构中。
需要注意的是，**文档片段中的元素的ownerDocument依旧是document对象**，毕竟文档片段并不是真正的文档。

***

#### Attr类型

Attr类型就是之前在Element类型中提到过的 特性节点类型。

##### Attr类型自身的属性

Attr类型自身的(Node)属性:
* nodeType 的值是 2
* nodeName 的值是 特性名
* nodeValue 的值是 特性值
* parentNode 的值 **null**而不是 Element类型
* **在HTML中不支持子节点，在XML中支持个别子节点类型**

##### Attr类型的相关属性

特性节点是Attr类型，具有Attr类型的相关属性:
* name 特性名
* value 特性值
* specified 是否被指定

 对于Element类型来说，获取特性不仅可以通过 getAttribute方法，也可以通过attributes属性获取特性节点集合再获取特性节点,还可以通过getAttributeNode方法获取特性节点. 
 
 而设置特性，不仅可以通过setAttribute方法，也可以通过setAttributeNode方法。
 
 创建特性节点的方法是**document.createAttribute(attrName)**方法。
 
 ***
 
 ### DOM操作技术
 
 ***
 
 #### 动态脚本
 
 所谓动态脚本，就是指在代码执行过程中加载的脚本，在页面加载时并不存在。
 
 一般而言，在HTML中引入脚本的方式有两种:
* 引入脚本文件：<script src="引入脚本文件的地址"></script> 
* 引入脚本代码：<script>脚本代码</script> 

所以,动态引入脚本的思路很清晰，就是在html文档中，动态创建新的script标签的元素，也就是HTMLScriptElement,并把该元素添加进文档树中。

不过这里需要注意的是浏览器兼容的问题，特别是引入脚本代码的方式，在IE中，是不能直接操作script元素的子节点的，只能使用script元素的**text属性**来指定JavaScript代码。

这样加载的代码，在效果上是等同于在全局环境中在使用 **eval函数** 执行动态引入的代码。 因为**其执行环境都是全局环境**。

***

#### 动态样式

所谓动态样式，就是指在网页首次加载后再加载的样式。

一般而言，在HTML中引入样式的方式有两种：
* 引入样式文件: <link rel="stylesheet" type="text/css" href="样式文件地址">
* 引入样式代码: <style type="text/css">样式代码</style>

所以,动态引入样式的思路同样很清晰，就是在html文档中，动态创建新的style 或者 link标签的元素，也就是HTMLStyleElement或者HTMLLinkElement,并把该元素添加进文档树中。

这里同样需要注意浏览器兼容的问题，特别是引入样式代码的方式，在IE中，是不能直接操作style元素的子节点的，只能通过**元素的styleSheet属性**获取样式再通过**cssText属性**来指定CSS代码。

***
#### 操作表格

通过核心DOM的API创建表格和修改表格是一件非常繁琐的事，因为涉及的标签多，涉及的元素多。 

为此，DOM API中专门为表格相关的元素提供了一些额外的属性和方法。


对于 table元素，**HTMLTableElement**提供了以下属性和方法：
* rows 获取表格内所有行的HTMLCollection对象。
* createTHead() 创建表头
* createTFoot() 创建表尾
* insertRow(index)  在index位置插入一行，index从0开始.
* deleteRow(index) 删除index位置的行元素。


对于 tbody元素,**HTMLTableSectionElement**提供了以下属性和方法:
* rows 获取tbody内的所有行的HTMLCollection对象
* insertRow(index) 在tbody的index位置插入一行，index从0开始.
* deleteRow(index) 删除tbody内index位置的行元素。

对于 tr元素,**HTMLTableRowElement**提供了以下属性和方法:
* cells 获取该行内所有单元格的HTMLCollection对象
* insertCell(index) 在行内的index位置插入一个单元格
* deleteCell(index) 删除行内的index位置的单元格

通过使用这些属性，我们能够非常方便的，并且有逻辑的直观操作表格。

    例如，假设我们要创建第一行tr，我们只需要调用tbody.insertRow(0) 就能创建该行tr元素，并且可以通过 tbody.rows[0]来获取该tr元素引用。
    如果我们要在这一行内新建td元素，那么我们只需要调用 tbody.rows[0].insertCell(0)即可创建首个td元素，并且可以通过tbody.rows[0].cells[0]快速获取该td元素的引用。
    
***

#### 动态集合

在DOM中，动态集合有以下三种类型:
* HTMLCollection
* NodeList
* NamedNodeMap 

而我们大多数情况下遇到的是前两种，NamedNodeMap在对Element的attributes属性访问元素的特性节点集合时会遇到。 

不管怎么说，这三者都是 动态的集合， 会根据DOM文档结构变化而得到更新。

因此，我们在使用上面提及的一些方法时，需要注意，如果会频繁访问这些动态集合，最好先将其转换为真正的数组对象，由此避免每次返回都会查询DOM结构的开销。

***

### 总结

这里所有的内容其实都是在讲一个东西: **DOM 1级** 的规范。

首先DOM1级是一个语言中立和平台中立的接口，允许程序动态访问和更新文档的内容，结构，样式。

DOM 1级 分为两个部分:
* **Core DOM**  针对**XML和HTML**文档提供低级基础接口，用于表示任何的结构化文档。 
* **HTML DOM**  提供**针对HTML文档**的**额外的更高级别的接口**，可与 Core DOM 1级接口一起使用，更为方便的访问HTML文档。

#### Core DOM 1级

Core DOM 1级 规定了整个文档的结构。 

整个文档是由Node节点构成的文档树组成。 这些Node接口的定义都是由 Core DOM 1级规范 提供的。

具体而言，Core DOM 1级规范规定了 文档具有 12种 类型的Node节点。 Core DOM 1级规范 规定了这些类型所具备的属性和方法。

Core DOM 1级还规定了两种动态集合:
* **有序的**节点动态集合**NodeList** 
* **根据name属性索引的无序**节点动态集合**NamedNodeMap**  (在实现中，也可以按照序数索引访问，但是，底层实现就是一个无序列表)

为了扩展Node类型操作文本内容的功能，Core DOM 1级还规定了 **CharacterData接口(继承自Node)**.

可以看到 Core DOM 1级 所规定的内容里，并没有区分 XML 和 HTML 文档。 这些东西都是通用的最基础的低级接口。

#### HTML DOM 1级

为了更好得操作HTML文档，因此就有了专门针对HTML额外提供的高级接口，这些接口都非常明显表明了其身份一一自身往往带有HTML字眼。

比如Document是Core DOM 1级规定的Node类型的一种节点，为了更好的操作HTML中的Document节点，HTML DOM 1级 定义了 HTMLDocument类型继承自Document类型用来提供额外的属性和方法。

HTML DOM 1级 接口大多数都集中在 Element类型的扩展上，因此有许多 HTMLXXXXElement，这些都是由 HTML DOM 1级定义的。

HTMLCollection 是 HTML DOM 1级定义的一种动态的节点列表,可以通过**顺序索引**或者**name**或者**id**属性来访问具体的节点。具体而言，HTMLCollection提供了两种访问的接口:
* item(index) 通过顺序索引访问节点
* namedItem(name or id) **优先搜索id匹配**的节点，如果找不到，那么搜索name匹配的节点，但**仅搜索使用了name属性的元素**。 

同时，HTMLElement上提到的5大基础标准特性:id class dir lang title 也是在 HTML DOM 1级中定义的。