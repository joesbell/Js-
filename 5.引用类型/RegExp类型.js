
//创建正则表达式的两种方法。
var pattern1=/\.img/ig;
//等价的，唯一区别是对于转义字符得两次转义。因为多了一道解析 字符串的 工序。
var pattern2=new RegExp("\\.img","ig");


// 实例属性
console.log(pattern2.global);
console.log(pattern2.ignoreCase);
console.log(pattern2.multiline);

console.log(pattern2.source); //获取的字面量形式的pattern,只是没有flags标志了，也没有 / /这两个正斜杠了。
console.log(pattern2.lastIndex);  //下次搜索目标字符串的起始位置。

console.log("------------");

// 实例方法 exec

var pattern=/mom (and dad (and baby)?)?/g;
var target="mom and dad ~ no no no , mom and dad and baby";
console.log("本次匹配起始位置:"+pattern.lastIndex+",其字符是:"+target[pattern.lastIndex]);
var result= pattern.exec(target);

if(result!=null){
    console.log("本次匹配到的起点索引:"+result.index);
    console.log("本次匹配的目标字符串:"+result.input);
    for(var i=0;i<result.length;i++){
        console.log("捕获组"+i,"内容:"+result[i]);
    }
    //这里也说明了 下次搜索的起始位置=本次匹配字符串的第一个字符位置+本次匹配的字符串的长度
    console.log(pattern.lastIndex===(result.index+result[0].length));
}


console.log("-------------");
//由于开启了全局匹配g，因此再次调用会接着匹配。 如果关闭全局匹配g，那么会再次从头开始匹配。

console.log("本次匹配起始位置:"+pattern.lastIndex+",其字符是:"+target[pattern.lastIndex]);

result= pattern.exec(target);


if(result!=null){
    console.log("本次匹配到的起点索引:"+result.index);
    console.log("本次匹配的目标字符串:"+result.input);
    for(var i=0;i<result.length;i++){
        console.log("捕获组"+i,"内容:"+result[i]);
    }
    console.log(pattern.lastIndex===(result.index+result[0].length));
}


//需要注意的一点是 正则表达式的实例属性lastIndex并不会随着目标字符串被更换而重置。

console.log("本次匹配起始位置:"+pattern.lastIndex);

//因此这里虽然是更换了目标字符串并且看起来似乎能匹配，但是由于 正则实例的lastIndex已经不是0了。所以是无法匹配到的。因此返回的结果数组是null
result= pattern.exec("mom ");

console.log(result==null);


//实例 方法 test
pattern=/cat/i;
console.log(pattern.test("dsatcatvs"));
console.log(pattern.test("dsat cAt vs"));

// 继承的方法

console.log(pattern.toString());
console.log(pattern.toLocaleString());
console.log(pattern.valueOf());


// 构造函数的静态属性
console.log("-------------------")


pattern=/mom (and dad (and baby)?)?/g;
pattern.lastIndex=0;
target ="there are some words: mom and dad and baby. Is it very interesting?";
pattern.exec(target);

console.log("最近一次匹配成功的 目标字符串是:",RegExp.input);
console.log("最近一次匹配成功的 字符串是:",RegExp.lastMatch);
console.log("最近一次匹配成功的 字符串左边的子串是:",RegExp.leftContext);
console.log("最近一次匹配成功的 字符串右边的子串是:",RegExp.rightContext);
console.log("最近一次匹配成功的 捕获组是:",RegExp.lastParen); //最后一个非空字符串的 $num 取值
console.log("其捕获组1是:",RegExp.$1);
console.log("其捕获组2是:",RegExp.$2);
//需要注意的是 $1这些捕获组的值初始都是 空字符串。只有当匹配成功后才会更新。
console.log(RegExp.$3==="");

console.log("-----------")

pattern.exec(target); //这次匹配肯定失败的
console.log("最近一次的目标字符串是:",RegExp.input);
//匹配成功才会更新RegExp的静态属性
pattern.exec("there are some words: mom and dad and baby. Is it very interesting?there are some words: mom and dad and baby. Is it very interesting?");
console.log("最近一次的目标字符串是:",RegExp.input);

//可以看到 只要运用了正则的 test或者exec方法，都可以通过 RegExp的静态属性获取到具体的匹配情况。
/(a)(b)(c)/g.test("abc");
console.log(RegExp.lastParen==="c");//最后一个非空字符串的 $num 取值
