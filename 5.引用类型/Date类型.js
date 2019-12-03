
//用于创建当前时间的日期对象。
var date=new Date();

console.log(date.toLocaleString());

//我们需要知道的是 Date的构造函数其实需要的是一个 毫秒数作为参数来生成日期对象的。
date=new Date(0);
console.log(date.toLocaleString());

//Date.parse方法将输入的字符串当作 本地时间 ,并生成一个毫秒数。
console.log(Date.parse("7/19/1994")); //774547200000
//于是这里我们得到的日期对象就是 本地时间 1994/7/19的日期对象。 如果将其转化为GMT时间打印，那么由于当前时区在+8区，因此实际GMT0时区的时间是 1994/7/18 16点。
//但是我们需要知道的是， 不论时区是什么，同一时刻创建的当前时间对象的毫秒数都是相同的，不同的只是时间输出罢了。
date=new Date(774547200000);
console.log(date.toLocaleString());

date=new Date(Date.parse("7/19/1994"));
console.log(date.toLocaleString());

date=new Date("7/19/1994");  //  直接传入一个时间格式的字符串，其实在后台， 会调用 Date.parse()方法将字符串转化为毫秒数。
console.log(date.toLocaleString());

// 除了 Date.parse()之外还有Date.UTC()可以将某种格式的日期 当作标准GMT时间而非本地 转换为表示日期的毫秒数。
// 而且需要注意的是，其月份参数是从0开始的。
console.log(Date.UTC(1994,6,19)); //774576000000
date=new Date(774576000000);
console.log(date.toLocaleString());

//与此相同的是， Date构造函数也能接受这种 与 Date.UTC()方法相同的参数，唯一不同的是，此时是将参数当作本地时间计算的。

date=new Date(1994,6,19);
//等价于以下生成方式.
// date=new Date("7/19/1994"); 都是本地时间下的 毫秒数 转化为日期类型。
console.log(date.toString());

console.log(Date.now()); //返回当前时间 所代表的毫秒数值
date=new Date(Date.now());





//返回带有本地时区信息的本地时间字符串
console.log(date.toString());
//返回本地区域设置的 本地时间字符串
console.log(date.toLocaleString());
//返回时间所代表的毫秒数
console.log(date.valueOf());




console.log(date.toDateString());
console.log(date.toLocaleDateString())
console.log(date.toUTCString())

