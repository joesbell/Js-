// Global对象的 URI编码解码方法

var uri="http://www.reveur.space/my note/部分字符_-~!.html?user=reveur000#top";
result=encodeURI(uri);
//可以看到 uri中的 # / ? 均是保留原样，因为这是uri自身就有的特殊符号
console.log(result);
console.log(decodeURI(result));//解码获得原本的字符串

//而这个方法会对大多数特殊字符进行编码 ,但是部分字符比如 . _ 不会编码。  这里有点奇怪的是 ! 也不会被编码
result=encodeURIComponent(uri);
console.log(result);
console.log(decodeURIComponent(result));

//这是 eval方法。
eval("console.log(\"hello world!\")");



// Math内置对象的方法

// min 和 max 方法 ，接受的参数为 任意个数字
var max=Math.max(1,23,5,2,55);
console.log(max);
var min=Math.min(1,23,5,2,55);
console.log(min);
//但是当参数为数组的时候,我们只能借用 apply来调用方法了。
var array=[1,23,5,2,55];
max=Math.max.apply(Math,array);
console.log(max);

// 舍入方法. ceil floor round
console.log(Math.ceil(25.3));//26 向上舍入方法
console.log(Math.floor(25.9999)); //25 向下舍入
console.log(Math.round(25.49999));//25 四舍五入

// 随机数方法random
console.log(Math.random()) ; //返回的是一个 [0,1)返回内的数字

// 一些跟计算有关的方法 比如计算 绝对值 指数方法 开方方法 自然对数方法 正余弦方法。
console.log(Math.abs(-2)); //绝对值方法
console.log(Math.pow(2,3)); //指数方法 返回 2^3
console.log(Math.sqrt(4)); //开方方法 返回2
console.log(Math.log(Math.E)); //求 数的自然对数的方法
console.log(Math.exp(1)); //求 e^n次方的方法
console.log(Math.tan(Math.PI/4)); //求正切值。

//但是需要注意的是，一切跟浮点数有关的方法都是有误差的。