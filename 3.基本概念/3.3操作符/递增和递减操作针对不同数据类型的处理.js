


// undefined 类型
var num=undefined;

alert("类型为"+typeof num +"的数据"+num+"经过++num操作后取值为:"+(++num));   //NaN

//Null类型

num=null;
alert("类型为"+typeof num +"的数据"+num+"经过++num操作后取值为:"+(++num));  // 1

//不能转换为数值的String类型
num="321blue";
alert("类型为"+typeof num +"的数据"+num+"经过++num操作后取值为:"+(++num));  //NaN

//可以转换为数值的String类型
num="321";
alert("类型为"+typeof num +"的数据"+num+"经过++num操作后取值为:"+(++num)); //322

//浮点数
num=3.21;
alert("类型为"+typeof num +"的数据"+num+"经过++num操作后取值为:"+(++num)); //4.21

//Boolean类型
num=true;

alert("类型为"+typeof num +"的数据"+num+"经过++num操作后取值为:"+(++num)); //2






// 没有 valueOf，因此使用toString后进行转换
num={

    toString: function(){
        return "321";
    }

};

alert("类型为"+typeof num +"的数据"+num+"经过++num操作后取值为:"+(++num)); //322

//两个方法同时存在，因此使用 valueOf进行转换。
num={
    valueOf: function(){
        return "300";
    },

    toString: function(){
        return "321";
    }

};

alert("类型为"+typeof num +"的数据"+num+"经过++num操作后取值为:"+(++num)); //301

/*
 * 特别注意，当对象的 valueOf()方法返回的值转化为NaN时，不会再次调用 toString()方法尝试转换。
 * 只有当 valueOf()方法不存在时，才会调用 toString()方法并尝试转换。
 */
num={
    valueOf: function(){
        return "NOT";
    },

    toString: function(){
        return "321";
    }

};

alert("类型为"+typeof num +"的数据"+num+"经过++num操作后取值为:"+(++num)); //NaN

/*
 * 针对对象的测试也可以看出， valueOf方法 对 对象来说是优先的。
 */

