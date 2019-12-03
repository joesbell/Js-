/*
 * 跟myCall的实现如出一辙。
 */

//1.首先我们要想清楚参数的问题， apply方法的第一个参数是 this对象的取值，其次是arguments对象或者参数数组
function myApply(){

    //检测是否针对的是函数
    if(typeof this !="function"){
        throw new Error(this+"不是函数");
    }

    //我们要明白的是，如果传入null或者undefined或者不传值(undefined),this取值就认为是全局window调用，否则就是传入对象。
    var targetObj= (arguments[0]==null)?window:arguments[0]; //目标调用对象。
    targetObj=Object(targetObj);
    var result; //返回结果
    var params=null; //实际参数

    //2.同时准备实现 传入对象调用函数了。

    //很简单的一句代码，为 目标对象添加一个方法指向目标函数，再调用即可
    var targetMethod=this;
    targetObj["applyMethod"]=targetMethod;

    //判断有无参数传入
    if(arguments[1]==null){
        result=targetObj.applyMethod();
    }else{
        //准备处理参数了。 对于 arguments对象和参数数组的处理都一样。反正都可以使用 数组[index]访问
        params=[];
        for(var i=0;i<arguments[1].length;i++){
            params.push("arguments[1]["+i+"]");
        }
        //参数的传递只能这样实现
        eval("result=targetObj.applyMethod("+params+")");
    }

    //最后删除这个方法属性。
    delete targetObj.applyMethod;
    return result;
}



