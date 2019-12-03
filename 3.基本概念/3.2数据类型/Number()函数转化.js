var a=true;
alert(typeof a+"类型:"+a+"被转化为"+Number(a));  // 1

a=null;
alert(typeof a+"类型:"+a+"被转化为"+Number(a)); // 0

a=undefined;
alert(typeof a+"类型:"+a+"被转化为"+Number(a)); // undefined;

a=321.21;
alert(typeof a+"类型:"+a+"被转化为"+Number(a)); // 本身

a="hello123";
alert(typeof a+"类型:"+a+"被转化为"+Number(a)); // NaN

a="0110";
alert(typeof a+"类型:"+a+"被转化为"+Number(a));  // 110. Number函数不会识别8进制！

a="0xa";
alert(typeof a+"类型:"+a+"被转化为"+Number(a)); //10

a="0.321";
alert(typeof a+"类型:"+a+"被转化为"+Number(a)); //0.321

a="";
alert(typeof a+"类型:"+a+"被转化为"+Number(a)); //0

a="           ";
alert(typeof a+"类型:"+a+"被转化为"+Number(a)); //0


/**
 * 对于 Object类型的Number强制转型，规则是 对于非Date类型的Object对象，优先使用valueOf获取原始值，获取失败则使用toString获取原始值并返回，均失败则抛出异常。
 * Date类型则顺序相反。
 * 最终对获取到的原始值进行Number转型。
 */
(function () {
    var a={toString:function(){return {}},valueOf:function(){return {}}};
    try{
        console.log(Number(a));
    }catch (e){
        console.log("由于toString和valueOf均无法获取对象a的原始值，所以抛出TypeError:",e.message);
    }

    //由于valueOf返回的不是原始值，所以使用toString获取原始值
    a={toString:function(){return "1"},valueOf:function(){return {}}};
    console.log(Number(a)==1);

    //当valueOf返回原始值时，不再调用toString获取原始值。
    a={toString:function(){return "1"},valueOf:function(){return 2}};
    console.log((Number(a)==2))

}());