var max=Number.MAX_VALUE;
var min=Number.MIN_VALUE;

alert("最大值是:"+max);
alert("最小值是:"+min);

alert(max+"是否在可表示范围之间?"+isFinite(max));

max=max*2;
alert("超出范围后是:"+max);
alert(max+"是否在可表示范围之间?"+isFinite(max));



