# 在HTML中使用JavaScript


### \<script\>元素

在HTML页面中插入JavaScript的主要方法就是使用 \<script\>元素。对此分为两种:
* 内嵌JavaScript
* 引入外部JavaScript

\<script\>元素的6大属性:
* **async**(可选):立即下载脚本，但是并不妨碍其他操作。也是立即下载. 仅对外部脚本生效。
* **defer**(可选):表示脚本可以延迟到文档被完全解析和显示之后执行。**即 立即下载，延迟执行。** 仅对外部脚本生效。
* charset(可选):表示src属性指定的脚本的编码字符集。
* language(已废弃):表示编写代码的语言(JavaScript,VBScript...)
* **src**(可选):用于包含 该脚本的外部文件。
* **type**(可选):可以看作送language的替代属性，表示代码使用的脚本语言的内容类型(MIME类型)。
一般来说就是 text/javascript(默认，并且约定俗成). 但是实际上一般来说服务器传输的是MIME类型是application/x-javascript。

虽然 async和defer都是立即下载的，但是在执行顺序上来说是不同的，defer标记的脚本按照规范是顺序执行的，而async标记的脚本却不一定是。
但是在浏览器实际实现中,执行顺序不一定是按照HTML5规范来的。


### 在XHTML中使用 JavaScript

XHTML(可扩展超文本标记语言) 是将HTML作为XML的应用而重新定义的标准。 相比HTML更为严格。

在XHTML中， < 被严格作为一个新标签来解析，因此 脚本中的 小于号就不能使用 ，对此有两种解决方法:
* 使用 &lt; HTML实体替换 小于符号
* 使用XML中的 CData片段

CData片段的使用方式如下:

    <script>
        <![CDATA[

        脚本内容，这里面的内容将不会被解析。

        ]]>
    </script>

### \<noscript\>元素
在浏览器不支持JavaScript时或脚本被禁用后，浏览器就会显示 \<noscript\>元素间包含的内容。