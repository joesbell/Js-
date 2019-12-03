
//Object创建 基本包装类型的方式
console.log("Object创建 基本包装类型的方式");
var a=new Object("this is String");
console.log(a instanceof String);
a=new Object(false);
console.log(a instanceof Boolean);
a=new Object(213);
console.log(a instanceof Number);

//这有些特别， Object构造函数接受一个对象实例为参数时，返回的对象并不是新建的对象，而是作为参数的对象。
var b=new Object(a);
console.log(a instanceof Number);
console.log(a===b); //因此这里是同一个对象。
console.log("-------------------");


// Boolean 包装类型

// 其值为 Boolean()函数转换后的 布尔值的Boolean对象。
console.log("Boolean 包装类型");
var bool=new Boolean("");
console.log(bool); //false
bool=new Boolean(null);
console.log(bool); //false;
bool=new Boolean(undefined);
console.log(bool); //false;
bool=new Boolean(NaN);
console.log(bool); //false
bool=new Boolean("  ");
console.log(bool); //true

//需要注意的是， 在 逻辑运算时， false的Boolean对象实例 也是当作true的。 因为这是 基本类型boolean所规定的:非null对象都是true。

console.log(new Boolean(false) && true); //true

console.log(new Boolean(true).toString()==="true");
console.log(new Boolean(true).valueOf()===true); //valueOf返回的是基本类型 boolean

console.log("-------------------");

// Number 包装类型

console.log("Number 包装类型");
a=new Number(321);
console.log(a.valueOf()===321);
console.log(a.toString()==="321");

// toString方法还可以传入一个基数,返回数值的 对应 进制的 字符串表示。
a=10;
console.log( a.toString(2) ); //1010
console.log( a.toString(7));  //13

a=10.014523;
console.log(a.toFixed(2));
console.log(a.toExponential(4));
console.log(a.toPrecision(1));
console.log(a.toPrecision(2));

console.log("-------------------");

// String 包装类型
console.log("String 包装类型");

a= new String(false);
console.log(a.toString()==="false");
console.log(a.toLocaleString()==="false");
console.log(a.valueOf()==="false");

console.log(a.length); //每个String包装类型对象都具有 length这个实例属性
console.log(a.__proto__.hasOwnProperty("length"));

console.log("-------------------");
//String类型的字符方法
console.log("String 字符方法");

console.log(a.charAt(0)==="f");
console.log(a.charAt(0)===a[0]); //支持数组方式的访问
console.log(a.charCodeAt(0));
console.log("陈".charCodeAt(0)); //不仅可以获取ascii编码的字符，还能获取unicode编码的字符编码。

console.log("-------------------");
//String类型的字符串方法
console.log("String 字符串方法");
a= a.substr(0,0).concat("123456789");
console.log(typeof a); // 返回的是一个string基本类型了。
console.log(a);//123456789
console.log(a.slice(0,8)); // 12345678
console.log(a.substring(2,3)); //3
console.log(a.substr(2,3)); //345

console.log("-------------------");
//String类型的位置方法
console.log("String 位置方法");
a=new String("asd12353dsa32asd");
console.log(a.indexOf("asd"));
console.log(a.lastIndexOf("asd"));

console.log("-------------------");
// trim 删除所有前置和后置的空白符
a=new String("  \nhello world  ");
console.log(a.trim());
console.log(typeof a.trim()==="string");

//对 只有空白符的字符串 返回 一个空字符串
a=new String("   \n \t");
console.log(a.trim()==="");

console.log("-------------------");
//String类型的正则方法

console.log("String 正则方法");
//match方法

console.log("String 正则match方法");
//在不开启 g全局匹配下，与 RegExp实例的exec返回结果一致。
a=new String("cat bat sat fat");
var matches=a.match(/(.)at/);
console.log(matches.length);
console.log(matches.index);
console.log(matches.input);  //这个也是string基本类型数据
(function(){
    for(var i=0;i<matches.length;i++){
        console.log("第"+i+"个捕获组匹配到的是:"+matches[i]);
    }
}());

console.log(RegExp.input);
console.log(RegExp.lastMatch);
console.log(RegExp.lastParen);
console.log(RegExp.leftContext);
console.log(RegExp.rightContext);
console.log(matches instanceof Array);

console.log("----------------");


//在开启g全局匹配下，就不同了。
a=new String("cat bat sat fat tat");
matches=a.match(/(.)at/g);
console.log(matches.length);
console.log(matches.index); //没有了
console.log(matches.input); //没有了

//返回的结果数组变成了 在字符串中匹配到的所有子串了。
(function(){
    for(var i=0;i<matches.length;i++){
        console.log("在整个字符串中第"+i+"个匹配到的是:"+matches[i]);
    }
}());
console.log(RegExp.input);
console.log(RegExp.lastMatch);
console.log(RegExp.lastParen);
console.log(RegExp.leftContext);
console.log(RegExp.rightContext);
console.log(matches instanceof Array);


//这里要辨析一点， 正则匹配不是 indexOf位置方法！！！
//如果是位置方法，那么这里至少能找到2个aa，但是按照正则匹配的规则，下一次开始搜索的起始索引=上一次匹配到的起始索引+上一次匹配到的子串长度。
//因此 实际上 这里只能正则匹配到一个 aa。
console.log("----------");
a=new String("aaa");
matches=a.match(/aa/g);
console.log(matches.length);
(function(){
    for(var i=0;i<matches.length;i++){
        console.log("在整个字符串中第"+i+"个匹配到的是:"+matches[i]);
    }
}());

console.log("-------------------");

//search方法 ，与indexOf比较类似，但是匹配模式从完全字符匹配变成了 正则模式匹配。
console.log("String 正则search方法");
a=new String("t  his is a blue sky");
console.log(a.search(/\s+is/));  //可以看到这里通过正则匹配 匹配 空白符后紧跟is的字符串。


console.log("-------------------");
//replace方法比较多样化。 其接受的3个参数有3种情况

console.log("String 正则replace方法")

a=new String("cat bat sat fat tat");
// 1.两者都为字符串，那么只会首先创建一份副本,并将与  第一个参数字符串匹配的子串替换为第二个参数的字符串，并返回这个string基本类型的值。
console.log(a.replace("at","ond"));
// 2.第1个参数为 正则表达式， 第二个参数为字符串， 根据正则表达式是否开启全局模式 决定 是只替换第一个匹配子串还是 全部都替换。

//未开启全局g，因此只替换第一个匹配的子串
console.log(a.replace(/at/,"ond"));

//开启全局g，因此替换所有匹配子串
console.log(a.replace(/at/g,"ond"));

//需要注意的是 第二个字符串中是可以使用特殊字符序列来表示捕获组的，
console.log(a.replace(/.at/g,"word($&)")); // 这里的 $& 表示的是最近匹配到的一次的值。
console.log(a.replace(/(.at)/g,"word($1)")); // 这里的 $n n从1开始 表示的是捕获组1所匹配到的子串。前提在正则表达式中的确有这个捕获组存在，不然只会当普通字符替换。

//由于 第一个参数的正则中并不包含 第2个捕获组了，因此这里的 $2只被当作普通字符。
console.log(a.replace(/(.at)/g,"word($2)"));

//3.第1个参数为 正则表达式，第二个参数为函数。

//这个方法非常灵活，相比于第二个参数使用字符串时， 功能更加强大和精细。

//当正则表达式没有使用捕获组时， 函数的三个参数依次代表:当前匹配项，其在原本字符串中的索引， 原本字符串的toString()返回值:一个string基本类型
result=a.replace(/.at/g,function(match,index,originalText){
        console.log("当前匹配到:"+match,"其在原本数组中的索引为:"+index);
        if(match=="tat"){
            return "这一项是不允许存在的数据:保密";
        }else {
            return "这一项是允许存在的:"+match;
        }
    }
);
console.log(result);

//当正则表达式使用捕获组时， 函数的参数依次代表:当前匹配项,捕获组1匹配到的子串，捕获组2匹配到的子串 ... ，整个匹配项其在原本字符串中的索引， 原本字符串的toString()返回值:一个string基本类型
result=a.replace(/((.)at)/g,function(match,group1,group2,index,originalText){
        console.log("当前匹配到:"+match,"其在原本数组中的索引为:"+index,"其中捕获组1匹配到的子串是:"+group1,"捕获组2匹配到的子串是:"+group2);
        if("bf".indexOf(group2)==-1){
            return "这一项是不允许存在的数据:保密";
        }else {
            return "这一项是允许存在的:"+group1+",因为:"+group2+"是被允许的";
        }
    }
);
console.log(result);

//可以看到,这是更精细的处理。
console.log("-------------------");

//split方法
console.log("String 正则split方法");

a=new String("red,orange,yellow,green");
result=a.split(","); //使用字符串 分割
console.log(result);
console.log(result instanceof Array);

a=new String("red\torange\nyellow  green");
result=a.split(/\s+/,3); //使用正则表达式匹配子串 分割
console.log(result);

//当字符串为空时，直接返回字符串的每一个字符组成的数组。

a=new String("hello  world");
result=a.split("");
console.log(result);


// String 构造函数 静态方法 String.fromCharCode(任意个UNICODE编码)。用于将UNICODE编码转换为string基本类型值
console.log("----------");
console.log(String.fromCharCode(10)+"10是ASCII码中的换行编码");
console.log(String.fromCharCode("陈".charCodeAt(0))==="陈");
console.log("----------");



