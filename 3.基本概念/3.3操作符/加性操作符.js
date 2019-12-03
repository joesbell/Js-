var num1,num2,num3;


/*
 ************加法操作符  +  ********************
 */

/*
 * 如果两个操作数都是数值，那么进行 普通的加法运算。
 */

num1=Infinity;
num2=Infinity;
num3=num1+num2;
console.log(num1+"+"+num2+"="+num3);  //+号无穷相加为 该符号无穷 Infinity

num1=-Infinity;
num2=-Infinity;
num3=num1+num2;
console.log(num1+"+"+num2+"="+num3); //-号无穷相加为 该符号无穷 -Infinity

num1=Infinity;
num2=-Infinity;
num3=num1+num2;
console.log(num1+"+"+num2+"="+num3);  //异号无穷相加为 NaN


/*
 * 基本类型运算时的大纲:
 * 有字符串则使用**String()转型函数**转化为两个字符串进行拼接。
 * 没有字符串则使用**Number()转型函数**转化为两个数值进行加法操作。
 *
 */

//没有字符串
num1=5;
num2=null;
num3=num1+num2;
console.log(num1+"+"+num2+"="+num3);  //5

num1=true;
num2=5;
num3=num1+num2;
console.log(num1+"+"+num2+"="+num3);  // 6

num1=true;
num2=null;
num3=num1+num2;
console.log(num1+"+"+num2+"="+num3);  // 1

num1=undefined;
num2=null;
num3=num1+num2;
console.log(num1+"+"+num2+"="+num3);  //NaN

//有字符串
num1=5;
num2="5";
num3=num1+num2;
console.log(num1+"+"+num2+"="+num3);  //55


num1=undefined;
num2="null";
num3=num1+num2;
console.log(num1+"+"+num2+"="+num3);  //undefinednull

//
console.log("+ 操作的顺序性:从左往右 顺序进行 + 操作");

num1=10;
num2=5;
console.log(num1+"+"+num2+"="+num1+num2);  // 结果是 105
console.log(num1+num2+"是"+num1+"+"+num2+"的结果"); //结果是 15


/*
 ************减法操作符  -  ********************
 */

/*
 * 减法操作符 只需要进行 Number()转型即可
 */

//都是数值时，特殊情况。

num1=Infinity;
num2=Infinity;
num3=num1-num2;
console.log(num1+"-"+num2+"="+num3);  //NaN

num1=-Infinity;
num2=-Infinity;
num3=num1-num2;
console.log(num1+"-"+num2+"="+num3);  //NaN

num1=Infinity;
num2=-Infinity;
num3=num1-num2;
console.log(num1+"-"+num2+"="+num3);  //Infinity

num1=-Infinity;
num2=Infinity;
num3=num1-num2;
console.log(num1+"-"+num2+"="+num3);  //-Infinity


// 有非数值的情况， Number()转型为字符。

num1=true;
num2="";  //空字符串
num3=num1-num2;  // 转型后 1-0
console.log(num1+"-"+num2+"="+num3);  //1

num1=true;
num2=" ";  // 只包含空格的字符串
num3=num1-num2;  // 转型后 1-0
console.log(num1+"-"+num2+"="+num3);  //1


num1=5;
num2=null;
num3=num1-num2;  // 转型后 5-0
console.log(num1+"-"+num2+"="+num3);  //5

num1=1;
num2="23";
num3=num1-num2;  // 转型后 1-23
console.log(num1+"-"+num2+"="+num3);  //-22

num1=true;
num2=undefined;
num3=num1-num2;  // 转型后 1-NaN
console.log(num1+"-"+num2+"="+num3);  //NaN


console.log("----------------------------");
console.log("----------------------------");
console.log("----------------------------");
console.log("----------------------------");
console.log("----------------------------");


/*
 * 引用类型的 + 操作
 */


// 修改Object原型的方法，方便识别到底调用的是哪个
Object.prototype.toString=function () {
    return "Object的toString";
};
Object.prototype.valueOf=function () {
    return "Object的valueOf";
};



//第一 :优先使用自身的valueOf 获取基本类型返回值
num1={

    valueOf: function(){
        return 1;
    },
    toString:function () {
        return "reveur";
    }
};

num2={
    valueOf: function(){
        return 2;
    },
    toString:function () {
        return "mike";
    }
};

num3=num1+num2;
console.log(num1+"+"+num2+"="+num3);


//第二 :如果自身valueOf不存在，那么使用继承的valueOf 获取基本类型返回值
num1={

    toString:function () {
        return "reveur";
    }
};

num2={

    toString:function () {
        return "mike";
    }
};

num3=num1+num2;
console.log(num1+"+"+num2+"="+num3);

//第三 :如果自身valueOf存在但是返回基本类型失败，那么就使用 自身toString获取基本类型返回值。
num1={

    valueOf: function(){
        return {};
    },
    toString:function () {
        return "reveur";
    }
};

num2={
    valueOf: function(){
        return {};
    },
    toString:function () {
        return "mike";
    }
};

num3=num1+num2;
console.log(num1+"+"+num2+"="+num3);



//第四:如果自身valueOf不存在并且继承得来的valueOf获取基本类型失败，那么使用自身的toString(若有.否则参看第五) 获取基本类型返回值,成功则使用该值运算，失败则抛出异常

Object.prototype.valueOf=function () {
    return {};
};

//成功时
num1={

    toString:function () {
        return "reveur";
    }
};

num2={

    toString:function () {
        return "mike";
    }
};


num3=num1+num2;
console.log(num1+"+"+num2+"="+num3);

Object.prototype.toString=function () {
    return {};
};

// //失败时
// num1={
//
//     toString:function () {
//         return {};
//     }
// };
//
// num2={
//
//     toString:function () {
//         return {};
//     }
// };
//
//
// num3=num1+num2;
// console.log(num1+"+"+num2+"="+num3);

//第五 : 如果 自身toString不存在，那么使用继承的toString尝试获取基本类型返回值。成功则使用该值进行运算,失败则抛出异常

Object.prototype.toString=function () {
    return "Object的toString";
};

//成功时
num1={

};

num2={

};

num3=num1+num2;
console.log(num1+"+"+num2+"="+num3);


// //失败时
// Object.prototype.toString=function () {
//     return {};
// };
//
// num1={
//
// };
//
// num2={
//
// };
//
// num3=num1+num2;
// console.log(num1+"+"+num2+"="+num3);


/***
 * Date类型的加法运算是优先调用toString方法，其次才是调用valueOf方法获取原始值
 */
(function () {
    var date=new Date();
    date.toString=function(){
        return "date的toString";
    };
    date.valueOf=function(){
        return "date的valueOf";
    };
    console.log(date+1000); //"date的toString1000"
    console.log(date+""); //"date的toString"

    //此时由于toString方法获取不到原始值，所以才会调用valueOf方法
    date.toString=function () {
        return {};
    };
    console.log(date+1000); //"date的valueOf1000"
    console.log(date+""); //"date的valueOf"
    date.valueOf=function () { return {} };
    try{
        console.log(date+"");
    }catch (e){
        console.log("由于toString和valueOf均无法获取原始值，因此抛出异常:",e.message)
    }
}());


/**
 * 一个和加法操作符有关的例子。 同时牵扯到引用规范类型和 自增运算符，以及运算符优先级。
 */
(function () {
    console.log(++[[]][+[]]+[+[]]); //10

    //分析如下. 一元+号运算符优先级很高。  所以  +[]==0 因此上式等价于下面
    console.log(++[[]][0]+[0]);

    //首先我们要明确， 成员访问的优先级大于自增运算符。
    //所以这里的 ++[[]][0]等价与获取[[]]的第0个元素并自增 也就是 ++[].
    //但是这里需要注意的是，自增运算符是必须对引用而不是值使用的。 也就是说 ++[]这个表达式是会报错的。
    //所以我们用如下的引用a来替代[]
    var a=[];
    console.log(++a+[0]);
    //这里再简单的解释一下自增运算符， 自增运算符会将运算对象expr转化为Number数值，也就是  ToNumber(GetValue(expr))。
    //随后进行+1运算。  并执行PutValue(expr,+1运算后的值)，将运算后的值赋值给原本的引用。
    //所以 ++a 的执行流程就是  GetValue(a) == [] , ToNumber([])=0,  0+1=1 , a=1
    //所以就上式等价于 1+[0]
    console.log(1+[0]);
    //而 1+[0] 按照 加法流程， [0]的原始值类型为其toString方法的返回值(因为其valueOf返回自身并不是原始值)，也就是"0"
    console.log(1+"0");

    console.log(typeof (++[[]][+[]]+[+[]]) ==="string") //从这里也可以看出来，最终执行的是 1+"0"这个字符串连接操作。
    //所以最终结果为 "10"


}());