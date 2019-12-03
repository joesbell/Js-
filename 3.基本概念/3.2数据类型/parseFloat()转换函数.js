var a="   +3.156";
alert(typeof a+"类型:"+a+"被转化为"+parseFloat(a));  //3.156

a=" -.03";
alert(typeof a+"类型:"+a+"被转化为"+parseFloat(a)); //-0.03

a= " 321.2.2";
alert(typeof a+"类型:"+a+"被转化为"+parseFloat(a)); //321.2

a=" 000002";
alert(typeof a+"类型:"+a+"被转化为"+parseFloat(a)); //2

a=" 0x321";
alert(typeof a+"类型:"+a+"被转化为"+parseFloat(a)); //0

//带有 16进制格式的字符串均会被转化为0
a=" 0x321.21"
alert(typeof a+"类型:"+a+"被转化为"+parseFloat(a)); //0

//返回整数
a=" 9.00000000"
alert(typeof a+"类型:"+a+"被转化为"+parseFloat(a)); //9


a= "9e2";

alert(typeof a+"类型:"+a+"被转化为"+parseFloat(a)); //900

//e后面的小数点会被视作停止解析的标识
a=" 9e2.9";
alert(typeof a+"类型:"+a+"被转化为"+parseFloat(a)); //900

a=" 3.1415e2adsa";
alert(typeof a+"类型:"+a+"被转化为"+parseFloat(a)); //314.15