
var num = 0 ;

alert(num+"的2进制"+num.toString(2));  // 0

num = ~num;

alert(num+"的2进制"+num.toString(2));  // -1


// Infinity在位操作时被当作了0
num = Infinity;
num =~num;

alert(num+"的2进制"+num.toString(2));  // -1

//  NaN 也是被当作了0
num = NaN;
num = ~num;

alert(num+"的2进制"+num.toString(2));  // -1



/*
 * 左移不会影响符号位。
 */
num=16;

alert( num.toString(2)+"左移4位:"+(num<<4).toString(2)+",其值是:"+(num<<4));//256

num=-16;
alert( num.toString(2)+"左移4位:"+(num<<4).toString(2)+",其值是:"+(num<<4));//-256


/*
 * 正常来说 右移就是 除以关系
 */

num= 16;
alert( num.toString(2)+"右移4位:"+(num>>4).toString(2)+",其值是:"+(num>>4)); //1

num= -16;
alert( num.toString(2)+"右移4位:"+(num>>4).toString(2)+",其值是:"+(num>>4)); //-1

/*
 * 但是如果原本数字全部右移没了。 那么
 * 对于正数来说，最终结果是 0000000000000...0000，也就是0
 * 对于负数来说，最终结果是 1111111111111...1111，也就是-1
 */

num= 8;
alert( num.toString(2)+"右移4位:"+(num>>4).toString(2)+",其值是:"+(num>>4)); //0

num= -8;
alert( num.toString(2)+"右移4位:"+(num>>4).toString(2)+",其值是:"+(num>>4)); //-1

/*
 * 对于原本正数来说， 无符号右移和有符号右移是等效的。
 * 但是对于 负数来说，则完全不同。 负数的无符号右移非常大。
 */

num= 8;
alert( num.toString(2)+"无符号右移4位:"+(num>>>4).toString(2)+",其值是:"+(num>>>4)); //0

num= -8;
alert( num.toString(2)+"无符号右移4位:"+(num>>>4).toString(2)+",其值是:"+(num>>>4)); // 2^28-1 = 268435455


