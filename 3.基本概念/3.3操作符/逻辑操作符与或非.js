
/*
 * ----------------逻辑非 ！----------------------
 * -----------本质是: Boolean(exp)的 取反运算。-----
 */



var expression ;


/*
 *------------------逻辑非取值为false的情况------------------
 */

//对象
expression = new Object();
alert(expression+"的逻辑非结果是:"+!expression); // false;

//字符串
expression ="hello";
alert(expression+"的逻辑非结果是:"+!expression); // false;

//只要是非0的数
expression =321;
alert(expression+"的逻辑非结果是:"+!expression); // false;

expression =Number.NEGATIVE_INFINITY;
alert(expression+"的逻辑非结果是:"+!expression); // false;

expression =Infinity;
alert(expression+"的逻辑非结果是:"+!expression); // false;

//布尔值true
expression =true;
alert(expression+"的逻辑非结果是:"+!expression); // false;


/*
 *------------------逻辑非取值为true的情况------------------
 */


// 布尔值 false
expression =false;
alert(expression+"的逻辑非结果是:"+!expression); // true;

// 空字符串
expression ="";
alert(expression+"的逻辑非结果是:"+!expression); // true;

// null
expression =null;
alert(expression+"的逻辑非结果是:"+!expression); // true;

// undefined
expression =undefined;
alert(expression+"的逻辑非结果是:"+!expression); // true;

// NaN
expression =NaN;
alert(expression+"的逻辑非结果是:"+!expression); // true;

// 数值0
expression =0;
alert(expression+"的逻辑非结果是:"+!expression); // true;



/*
 * ------------------逻辑与 &&----------------------
 * 本质是短路操作，只要遇到求值为false的表达式就返回该表达式
 */
expression = "321"&&true&&Infinity&&NaN&&321&&null;
alert(expression);   //NaN


/*
 * ------------------逻辑或 ||----------------------
 * 本质是短路操作，只要遇到求值为true的表达式就返回该表达式
 */

expression = null||NaN||0||""||"hello"||false;
alert(expression); //"hello"