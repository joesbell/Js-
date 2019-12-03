var num1,num2,num3;

/*
 *****************乘法运算规则*****************
 */

num1=5e200;
num2=5e200;
num3=num1*num2;
alert(num1+"*"+num2+"="+num3);


//NaN与任何数相乘都是NaN
num1=NaN;
num3=num1*num2;
alert(num1+"*"+num2+"="+num3);  //NaN

// 0 和 无穷 相乘 为NaN
num1=Infinity;
num2=0;
num3=num1*num2;
alert(num1+"*"+num2+"="+num3); //NaN

// 非0数和无穷相乘，结果为 无穷，其符号取决与非0数的符号。
num1=Infinity;
num2=-0.5;
num3=num1*num2;
alert(num1+"*"+num2+"="+num3); // -Infinity


//无穷乘以无穷等于无穷
num1=Infinity;
num2=Infinity;
num3=num1*num2;
alert(num1+"*"+num2+"="+num3); //Infinity


/*
 *****************除法运算规则*****************
 */

// 有限数 除以 无穷 等于 0
num1=1;
num2=5e400;
num3=num1/num2;
alert(num1+"/"+num2+"="+num3);  //0

num1=-1;
num2=Infinity;
num3=num1/num2;
alert(num1+"/"+num2+"="+num3);  //0


// 有NaN参与的运算都返回 NaN
num1=1;
num2=NaN;
num3=num1/num2;
alert(num1+"/"+num2+"="+num3);  //NaN

// 无穷除以无穷是 NaN
num1=Infinity;
num2=Infinity;
num3=num1/num2;
alert(num1+"/"+num2+"="+num3);  //NaN


// 0/0也是NaN
num1=0;
num2=0;
num3=num1/num2;
alert(num1+"/"+num2+"="+num3);  //Infinity

// 0除以任何 非0 非NaN (包含无穷) 等于 0
num1=0;
num2=Infinity;
num3=num1/num2;
alert(num1+"/"+num2+"="+num3);  //0

// 非0的有限数字 除以 0 ，返回 Infinity，符号由非0数字决定。
num1=-321;
num2=0;
num3=num1/num2;
alert(num1+"/"+num2+"="+num3);  //-Infinity

// 无穷除以 任何有限数 返回 无穷，符号由两者共同决定
num1=-Infinity;
num2=-32;
num3=num1/num2;
alert(num1+"/"+num2+"="+num3);  //Infinity


num1=-Infinity;
num2=-0;
num3=num1/num2;
alert(num1+"/"+num2+"="+num3);  //Infinity

num1=-Infinity;
num2=0;
num3=num1/num2;
alert(num1+"/"+num2+"="+num3);  //-Infinity


/*
 *****************求模运算规则*****************
 */

// Infinity 求模 任何数(包括0)  结果都是NaN ，可以认为是因为其除法结果是Infinity.
num1=Infinity;
num2=321;
num3=num1%num2;
alert(num1+"%"+num2+"="+num3);  //NaN

num1=Infinity;
num2=0;
num3=num1%num2;
alert(num1+"%"+num2+"="+num3);  //NaN

// 非0 非NaN 求模 0 结果也是 NaN。  可以认为是因为其除法结果是Infinity.
num1=-321;
num2=0;
num3=num1%num2;
alert(num1+"%"+num2+"="+num3);  //NaN

//Infinity 求模 Infinity  结果是NaN。 可以认为因为其除法结果都是NaN了。
num1=Infinity;
num2=Infinity;
num3=num1%num2;
alert(num1+"%"+num2+"="+num3);  //NaN


// 有限数字 求模 Infinity ，结果都是有限数字。
num1=0;
num2=Infinity;
num3=num1%num2;
alert(num1+"%"+num2+"="+num3);  //0

num1=-3;
num2=Infinity;
num3=num1%num2;
alert(num1+"%"+num2+"="+num3);  //0

// 0求模0 结果是NaN
num1=0;
num2=0;
num3=num1%num2;
alert(num1+"%"+num2+"="+num3);  //NaN

