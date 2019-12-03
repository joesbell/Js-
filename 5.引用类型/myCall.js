

//1.首先我们要想清楚参数的问题， call方法的第一个参数是 this对象的取值，其后逐个罗列传入参数。
function myCall(){
    //我们要明白的是，如果传入null或者undefined或者不传值(undefined),this取值就认为是全局window调用，否则就是传入对象。
    var targetObj= (arguments[0]==null)?window:arguments[0]; //目标调用对象。
    targetObj=Object(targetObj);
    //由于没有实现call方法，因此这里要手动获取参数数组。
    var params=[];
    for(var i=1;i<arguments.length;i++){
        params.push('arguments['+i+']');
    }

    //检测是否针对的是函数
    if(typeof this !="function"){
        throw new Error(this+"不是函数");
    }
    var targetMethod=this;
    //至此,参数处理完毕。

    //2.现在开始准备实现 传入对象调用函数了。

    //很简单的一句代码，为 目标对象添加一个方法指向目标函数，再调用即可。
    targetObj["callMethod"]=targetMethod;
    var result=null;
    //参数的传递只能这样实现
    eval("result=targetObj.callMethod("+params.toString()+")");
    //最后删除这个方法属性。
    delete targetObj.callMethod;
    return result;
}

