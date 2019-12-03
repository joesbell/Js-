# HTML5脚本编程

HTML5定义了新的HTML标签，与之对应的，JavaScript也提供了新的API用来更好的实现功能。

***

### 跨文档消息传递

为了更好的和当前文档的内嵌框架页面以及当前文档打开的窗口进行通信，HTML5提供了 **window.postMessage()方法**用于提供跨文档的消息传递。

该方法可以用于跨域(协议不同，域名不同，端口不同)通信,使用该方法进行通信的前提是获取其他文档的 window 对象。 因此，通信的文档之间必须是内嵌关系或者是打开与被打开的关系。

使用语法如下 otherWindow.postMessage(message,targetOrigin,transfer),其中:
* otherWindow 表示当前窗口要发送信息到哪个窗口中。
* message 表示发送的信息内容，会被自动序列化。
* targetOrigin 指定接受的窗口的 协议 域名 端口。 只有和指定的targetOrigin的匹配的窗口才能收到信息。
* transfer 可选的 Transferable 对象， 这些对象的所有权会移交给其他窗口。

而相应的， otherWindow中通过 监听 **message事件** 来获取传递的信息，该事件对象具有以下属性:
* source 指向发送该信息的窗口window对象。
* origin 表示发送消息的窗口的 协议 域名 端口 信息。
* data   表示消息的内容。

在使用这些方法的时候，最好在监听message事件中 根据 origin 属性 验证发送方的身份。同时，在发送信息时，指定确定的targetOrigin，以免信息被泄露。

***

### 拖拽事件

拖拽事件**DragEvent**继承于MouseEvent，而MouseEvent继承于UIEvent。

对于被拖动的元素来说，具有以下拖拽事件:
* dragstart 表示开始拖拽。 只在开始拖拽的时候触发一次。表现类似mousedown
* drag      表示拖拽中。 会在拖拽过程中**不停触发**。  表现类似mousemove
* dragend   表示拖拽结束。 只在拖拽结束时触发一次。 表现类似mouseup

而对于拖动的目标位置元素来说，具有以下拖拽事件:
* dragenter 当拖拽元素进入 目标元素时，就会触发一次。
* dragmove  在拖拽元素在 目标元素上移动时，会**不停触发**。
* dragleave 当拖拽元素离开 目标元素时，就会触发一次。
* drop      当拖拽元素**成功放置在** 目标元素时，会触发一次。

一个完整的拖拽过程，一定是以 dragstart事件开始，以dragend事件结束。随着鼠标移动，中间伴随着 drag 事件。

如果进入了其他元素，那么还会首先触发 dragenter事件，鼠标在目标元素上移动时还会触发 dragmove事件，当鼠标移出目标元素时还会触发dragleave事件。 如果成功放置到该目标元素，那么 drop 事件就会触发。

这里需要注意的是，不是所有的元素都能作为目标元素，对于这些元素而言，是不能触发drop事件的，取而代之的是只会触发dragleave事件。 

要想在所有元素上都能触发drop事件，也就是说让所有元素都变成可放置的目标元素，那么我们应该**阻止目标元素的dragenter和dragover事件的默认行为**，使其变成可放置的元素，其表现形式就是移入鼠标后不再出现斜杠标识。

***

#### dataTransfer对象

在拖拽事件中，事件对象具有**dataTransfer属性**指向一个DataTransfer类型的对象，该对象用于存储拖拽事件中 **拖拽元素和目标放置元素之间的信息交换**。

这个对象和ClipboardEvent剪贴板事件对象的clipboardData属性是一样的。

在**dragstart事件**时，我们可以调用该对象的 setData(type,value) 来存储对应类型的数据。
而在**drop事件**中，我们可以调用该对象的 getData(type) 来获取相应类型的数据。

如果存储的类型是纯文本，那么type类型就是 "text/plain" ，当然因为兼容问题， "text"也是没问题的。
如果存储的类型是一个URL地址，那么type类型就是 "text/uri-list".

如果拖动的是个文件，那么dataTransfer对象的**files属性**里包含则 文件的信息，据此，我们可以做到拖动上传文件的功能。

***

#### dropEffect和effectAllowed

dropEffect和effectAllowed均是**DataTransfer对象的属性**，用于指定 **浏览器为拖动事件附加的鼠标样式**。

在**dragstart事件**中，我们可以设置effectAllowed属性来表明这个拖动可以支持的操作:
* all 全都支持
* copy 支持复制
* move 支持移动
* link 支持链接
* none 全不支持
* uninitialized 未初始化，效果等同于all

而在 **dragover和dragenter事件**中，我们可以设置dropEffect属性来表明目标放置元素上支持哪些操作:
* copy 支持复制
* move 支持移动
* link 支持链接
* none 全不支持

只有在 effectAllowed支持某个操作的前提下，dropEffect属性设置的**允许值**才会生效。

这里一定要注意的一点是，**dropEffect和effectAllowed属性仅仅只会影响浏览器附加的鼠标样式，真实的拖拽操作效果，需要独立实现，并且和这个鼠标样式可以没有任何关系！**

***

#### 让元素可拖动

默认的，其实只有 图片 文字 链接 是可以拖动的。 其中 文字必须在在被选中状态才是可拖动的，而图片和链接在任何情况下都是可拖动的。

HTML5中，为所有的元素增加了 **draggable属性**，只要设置该属性为true，那么就可以变成可拖动元素。

***

#### dataTransfer对象的其他属性

dataTransfer还有几个不常用的方法:
* addElement(ele) 在**dragstart事件**触发时，这个方法可以将**当前的拖拽元素替换为ele**。目前只有火狐浏览器支持。
* setDragImage(ele,x,y) 在**dragstart事件**触发时，这个方法可以将ele元素设置为鼠标下方显示的图像，其中(x,y)代表鼠标在图像中的位置。 ele可以是图像，也**可以是任何元素**，这些元素会被渲染后显示。

***

### 媒体元素

HTML5新增了两个媒体标签元素：
* HTMLVideoElement 视频元素
* HTMLAudioElement 音频元素

这两个元素均继承自 **HTMLMediaElement** 类型，因此有着相似的方法和属性。

这里介绍一下常用的属性和方法:
* play() 开始播放
* pause() 暂停播放
* controls 布尔值，表示是否显示播放器内置控件。
* muted 布尔值，表示是否静音
* volume 浮点数，表示音量，值在 0到1 之间
* playbackRate 浮点数，表示播放速度，值在 0到1 之间
* loop 布尔值，表示是否循环播放
* canPlayType(type) 播放器是否支持type类型的媒体播放

而常用的事件如下:
* canplay 表示媒体已经可以播放的事件
* canplaythrough 表示媒体应该已经加载了足够的数据而可以不停止的播放到结束。
* ended 播放完成 
* playing 正在播放
* play 开始播放
* volumechange volume值或muted值改变
* ratechange playbackRate播放速度值改变。

***

### 历史状态管理

历史状态管理的最重要的用途其实是在单页应用中作为路由模块。 

目前的单页应用基本有两种路由实现方式:
* hash 
* html5新提供的pushState API

hash方式的路由实现的核心就是监听 hashchange 事件。 而HTML5 pushState API 才是这里要说的。

History对象拥有以下关于历史状态管理的方法:
* pushState(stateObj,title,url) **新建**一个历史记录指向url，将stateObj状态信息存入历史记录，title就是HTML中的title暂时无用。
* replaceState(stateObj,title，url) **替换**当前页面的历史记录指向url，将stateObj状态信息存入历史记录，title就是HTML中的title暂时无用。

这两个方法都会修改当前的url指向，但是需要注意的是，显示的依旧是原来的页面，甚至连url是否存在浏览器都不会进行检测也不会去加载。同时使用这两个方法时也不会触发 hashchange事件。

而通过监听**window对象上的 popstate事件**，我们则可以使用到这些 state 信息，这些state信息位于**事件对象的state属性**上，以及**history对象的state属性**上。
 
popstate事件只在浏览器的历史记录发生变化时才会发生，但是 调用history.pushState()或者history.replaceState()本身并**不会触发popstate事件**. 

popstate事件**只会在浏览器的某些行为下触发**, 比如点击后退，前进按钮，或者在JavaScript中调用history.back()、history.forward()、history.go()。
需要注意的是，**只有通过pushState创建和replaceState替换**的历史记录条目，popstate事件的事件对象的state属性才**不为null**，其余情况下的popState事件的state属性都是null值。