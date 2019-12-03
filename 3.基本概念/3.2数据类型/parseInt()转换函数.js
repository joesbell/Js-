//识别空字符串
var a=" ";
alert(typeof a+"类型:"+a+"被转化为"+parseInt(a)); // NaN

a="hi1234";
alert(typeof a+"类型:"+a+"被转化为"+parseInt(a)); //NaN

//识别 负数
a="   -321.2";
alert(typeof a+"类型:"+a+"被转化为"+parseInt(a)); //-321


//识别 16进制
a="  0xafhi.hi";
alert(typeof a+"类型:"+a+"被转化为"+parseInt(a)); //175

//不能识别 8进制 (ES3中可以识别8进制)
a=" 070";
alert(typeof a+"类型:"+a+"被转化为"+parseInt(a)); //70

//也能识别 带有正号的数。
a=" +321";
alert(typeof a+"类型:"+a+"被转化为"+parseInt(a)); //321


a="  1234hi";
alert(typeof a+"类型:"+a+"被转化为"+parseInt(a)); //1234



alert("使用带有基数的 parseInt()函数");
a="010";
alert(typeof a+"类型:"+a+"被转化为"+parseInt(a,8)); //8

alert(typeof a+"类型:"+a+"被转化为"+parseInt(a,16)); //16

alert(typeof a+"类型:"+a+"被转化为"+parseInt(a,10)); //10

alert(typeof a+"类型:"+a+"被转化为"+parseInt(a,7)); //7

alert(typeof a+"类型:"+a+"被转化为"+parseInt(a,36)); //36

alert(typeof a+"类型:"+a+"被转化为"+parseInt(a,37)); //NaN
