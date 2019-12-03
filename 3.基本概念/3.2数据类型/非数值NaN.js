var a= 0/0;

alert(a/10+1); //NaN运算都会返回 NaN

alert(a==NaN); //NaN不与任何值相等

alert(isNaN("321")); //可以被转化为 321数值类型 因此返回false。
alert(isNaN("true")); // 该字符串不能被转化为 数值类型，因此返回 true。
alert(isNaN(true)); // 该布尔类型会被转化为 数值 1，因此返回false。
alert(isNaN(NaN)); // 该字符串不能被转化为数值类型， 因此返回 true.