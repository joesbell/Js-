var num1,num2;
var result;
/*
 *   当 两个操作数都是基本类型时：
 * 当且仅当 两个操作数都是字符串时，进行字符串比较操作
 * 其余情况，将原始操作数进行 **Number()** 转型后进行数值比较
 */

num1= null; //转型结果0
num2= true; //转型结果1
result=num1>num2;
console.log(num1+">"+num2+"的结果是"+result); //false


num1= "123"; //转型结果123
num2= true; //转型结果1
result=num1>num2;
console.log(num1+">"+num2+"的结果是"+result); //true


num1= true; //转型结果1
num2= undefined; //转型结果NaN
result=num1>num2;
console.log(num1+">"+num2+"的结果是"+result); //false


num1=  null; //转型结果0
num2= "-123null"; //转型结果NaN
result=num1>num2;
console.log(num1+">"+num2+"的结果是"+result); //false

num1= 5; //转型结果5
num2= "4.2"; //转型结果4.2
result=num1>num2;
console.log(num1+">"+num2+"的结果是"+result); //true


/*
    当原始操作数中有一个是对象时:
    对象有valueOf()方法就返回valueOf()方法结果，否则返回toString()方法结果。
* 如果另一个操作数和返回的结果中有数值，那么就统一Number()转型进行数值比较。
* 如果另一个操作数和返回的结果均为字符串，那么就统一进行字符串比较。(**这就是刚好能进行字符串比较**)
* 除此之外的情况一律 统一Number()转型进行数值比较
 */

//统一数值比较
num1={
    toString: function(){
        return "a";
    }
};  // 转型为 NaN

num2=100; //数值100

result=num1>num2;
//这里如果发生的是字符串比较，因为"a"的位置相比“1”靠后，那么应该返回的是 true。  实际上返回的 false。因为转型过程中出现了NaN
console.log(num1+">"+num2+"的结果是"+result); //false

//统一字符串比较
num1={
    toString: function(){
        return "a";
    }
};  // 字符串"a"

num2="2"; //字符串"2"
result=num1>num2;
//这里如果发生的是 数值比较，那么 "a"应该转化为NaN，就应该返回false，然而事实上是返回true，说明进行的是字符串比较
console.log(num1+">"+num2+"的结果是"+result); //true

// 除此之外 一律数值比较
num1={
    toString: function(){
        return "4.2";
    }
};  // 字符串"4.2" 转型为4.2

num2=true; //转型为1

result=num1>num2;

console.log(num1+">"+num2+"的结果是"+result); //true


/*
  当**原始操作数**中 均是对象时:
  对象有valueOf()方法就返回valueOf()方法结果，否则返回toString()方法结果。
* 如果两个返回的结果中有数值，那么就统一Number()转型进行数值比较。
* 如果两个返回的结果均为字符串，那么就统一进行字符串比较。(**这就是刚好能进行字符串比较**)
* 除此之外的情况一律 统一Number()转型进行数值比较
 */

//统一数值比较
num1={
    toString: function(){
        return 1;
    }
};  // 转型为 1

num2={
    valueOf: function(){
        return "-1";
    }
};; // 转型为 -1

result=num1>num2;
console.log(num1+">"+num2+"的结果是"+result); //true

//统一字符串比较
num1={
    toString: function(){
        return "10";
    }
};  // 转型为字符串"10"

num2={
    valueOf: function(){
        return "2";
    }
};; // 转型为字符串"2"
result=num1>num2;
//这里如果发生的是 数值比较，应该返回 true，实际上是返回false
console.log(num1+">"+num2+"的结果是"+result); //false

// 除此之外 一律数值比较
num1={
    toString: function(){
        return null;
    }
};  // 转型为0

num2={
    valueOf: function(){
        return "-1";
    }
};  //转型为-1

result=num1>num2;

console.log(num1+">"+num2+"的结果是"+result); //true


/*
 * 特别注意，NaN与一切操作数进行比较都返回 NaN
 */

num1=NaN;
num2=2;
result=num1>num2;
console.log(num1+">"+num2+"的结果是"+result); //false
result=num1<num2;
console.log(num1+"<"+num2+"的结果是"+result); //false

/*
 * 字符串比较规则是按照字符编码顺序进行比较的，并且是按位比较。
 */
num1="a";
num2="B";
result=num1>num2; // a的编码在 B的编码后面
console.log(num1+">"+num2+"的结果是"+result); //true


num1="21";
num2="3";
result=num1>num2; // 3的编码在 2的编码后面
console.log(num1+">"+num2+"的结果是"+result); //false

num1="23";
num2="210";
result=num1>num2; // 第一位相同，则比较第二位， 3的编码位于1后面
console.log(num1+">"+num2+"的结果是"+result); //true


