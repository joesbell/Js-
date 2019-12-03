/*
 *      == 相等操作符，先转化再比较。
 *
 *      基本规则： 1.类型不同时一律转化为Number数值比较。(除非是在对象valueOf()返回的类型恰好与另一个基本类型相同，那么转化为规则2)
 *               2.类型相同时比较 值相同或者引用的对象是否为同一对象。
 */

var data1;
var data2;
var result;


/*
 *    类型相同的两个操作数。 直接比较值是否相同或引用的是否是同一对象。
 */

//Number
data1=1;
data2=1;
result=data1==data2;
console.log(data1+"是否等于"+data2+"?"+result);  //true

//String
data1="js";
data2='js';
result=data1==data2;
console.log(data1+"是否等于"+data2+"?"+result); //true

//Boolean
data1=false;
data2=false;
result=data1==data2;
console.log(data1+"是否等于"+data2+"?"+result); //true

// 特别地 ， undefined==null
data1=null;
data2=undefined;
result=data1==data2;
console.log(data1+"是否等于"+data2+"?"+result); //true

//引用的是不同对象
data1={};
data2={};
result=data1==data2;
console.log(data1+"是否等于"+data2+"?"+result); //false

//引用相同对象。
data1={};
data2=data1;
result=data1==data2;
console.log(data1+"是否等于"+data2+"?"+result); //true


/*
 *          类型不同的操作数，则一律转化为 Number类型进行比较。
 */

// Boolean 和 Number
data1=false;
data2=0;
result=data1==data2;
console.log(data1+"是否等于"+data2+"?"+result); //true

// String 和 Number
data1="123";
data2=123;
result=data1==data2;
console.log(data1+"是否等于"+data2+"?"+result); //true

// 特别地， null和undefined在比较之前不能转型。

// Null和Number
data1=0;
data2=null;
result=data1==data2;
console.log(data1+"是否等于"+data2+"?"+result); //false

// Undefined和Number
data1=NaN;  //并且 NaN 和任何操作数比较都 不相等
data2=undefined;
result=data1==data2;
console.log(data1+"是否等于"+data2+"?"+result); //false


// 这里在证明 ，基本类型中的不同类型最终一定是转化为 Number类型进行比较
data1="0"; //如果这里最终是转化为布尔类型，那么应当转型为 true，因此相等性为false。
data2=false;
result=data1==data2;
console.log(data1+"是否等于"+data2+"?"+result);//实际上 结果是  true，说明两者都被转化为了 Number类型的0.


/**
 * 错误总结的起点
 */

// Number和 对象
data1=321;
data2={
    valueOf:function(){
        return "321";
    }
};//调用valueOf()方法后进行Number转型.
result=data1==data2;
console.log(data1+"是否等于"+data2+"?"+result);//true


// 这里在证明一种特殊情况，只有当对象的valueOf()返回的值与另一个操作数类型相同时，才会不转化为Number类型。
data1="123de";
data2={
    valueOf:function () {
        return "123de";
    }
};
result=data1==data2;
console.log(data1+"是否等于"+data2+"?"+result); //true  如果都转化为Number类型，那么应该返回false，因为NaN！=NaN


// Number 和 valueOf()返回值是对象的 对象进行相等性比较
//  对象的valueOf()在相等性比较中只会调用一次。
data1=321;
data2={
    valueOf:function(){
        //返回的是一个对象。
        return {
            valueOf : function () {
                return "321";
            }
        };
    }
};
result=data1==data2;
console.log(data1+"是否等于"+data2+"?"+result);//如果多次调用valueOf()最终应该返回true，实际上却返回的是false。


/**
 * 错误总结的终点
 */


/**
 * 对于Object类型与原始值类型进行相等性==比较。 本质是将 Object类型转化为原始值类型 与 原始值之间进行比较。
 */
console.log("------更正开始--------");
(function () {
    data1=321;
    data2={
        valueOf:function(){
            return {
                valueOf : function () {
                    return "321";
                }
            };
        }
    };
    console.log(data1==data2);
    data1=Object.prototype.toString();
    //这里可以看出来，在转化为原始值过程中，一般情况下，是优先使用valueOf方法获取原始值，失败则使用toString方法获取原始值，均失败则抛出TypeError异常
    console.log(data1==data2);
}());


/**
 * 在对象的 ToPrimitive规范方法无法获取原始值类型时，会抛出异常。
 */
(function () {
    data1=321;
    data2={
        valueOf:function() {
            return {
                valueOf: function () {
                    return "321";
                }
            };
        },
        toString:function () {
            return {};
        }
    };
    try{
        //尝试使用 ToPrimitive(data2)规范方法获取原始值，但是失败。
        console.log(data1==data2);
    }catch (e){
        console.log("由于在转化为原始值的过程中valueOf和toString方法获取的均不是原始值，因此抛出异常:",e.message)
    }
}());

/**
 *  这里增加一个例子说明一下 比较步骤。  [] == 0
 */
(function () {


    var a=[];
    console.log( (a==0) === true);

    //由于 一个是对象一个是原始值类型，因此尝试将对象转换为原始值进行比较.

    //由于[]是非Date类型对象，因此优先选择valueOf方法获取原始值，但是[].valueOf()为[]，非原始值类型，因此尝试使用toString()方法获取原始值。
    console.log(a.valueOf()==a);

    //Array对象的toString方法是特殊的，是对数组对象里的每一个元素调用toString方法获取原始值，并使用逗号分隔。

    var ele1={
        toString:function () {
            return "string1";
        },
        valueOf:function () {
            return "valueOf1"
        }
    };
    var ele2={
        toString:function () {
            return "string2";
        },
        valueOf:function () {
            return "valueOf2"
        }
    };
    console.log([ele1,ele2].toString()); //"string1,string2"

    //而对于 空数组，则直接返回 ""空字符串.
    console.log([].toString()=="");

    //因此，上面对[]空数组获取原始值时，当valueOf方法失败后尝试调用toString获取原始值后返回 空字符串成功。
    //因此 []==0  的比较转化为 "" == 0 的比较。
    //根据规范，String和Number均是原始值类型，因此转化为Number类型比较
    //因此 最终转化为比较 0 == 0。 返回true
    console.log(Number("")==0);//true

}());


/**
 * 特殊的Date类型对象的相等性比较是优先调用toString方法的。
 */
(function () {

    var date=new Date();
    date.toString=function () { return "toString" };
    date.valueOf=function () { return "valueOf" };
    //从结果上可以看出来，Date类型是非常特殊的，在获取原始值时，优先尝试使用toString方法获取原始值，获取失败才转而使用valueOf方法获取原始值的。
    console.log( (date=="valueOf") ===false);
    console.log( (date=="toString") ===true);
    date.toString=function () { return {} };
    //这里印证了我们的观点， toString不再返回原始值而是返回一个 Object类型对象。
    console.log( (date=="valueOf") ===true);
    console.log( (date=="toString") ===false);
}());

console.log("------更正结束--------");
/*
 *          不相等操作符 !=  的结果 就是  == 相等操作符的结果 进行逻辑非 ! 即可
 */




/*
 *  全等：类型相同的前提下，如果是基本类型，则必须值相同，如果是对象，则必须是同一对象。
 */

data1=null;
data2=undefined;
result=data1===data2;
console.log(data1+"是否全等于"+data2+"?"+result); //false

data1=null;
data2=null;
result=data1===data2;
console.log(data1+"是否全等于"+data2+"?"+result); //true

data1=undefined;
data2=undefined;
result=data1===data2;
console.log(data1+"是否全等于"+data2+"?"+result); //true

data1=NaN;
data2=NaN;
result=data1===data2;
console.log(data1+"是否全等于"+data2+"?"+result); //false
