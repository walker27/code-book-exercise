'use strict';
var {
    makeHr, log
} = require('./support');

/*==================== 数值的扩展 ====================*/
/**
 * 1.二进制和八进制表示法
 * 2.Number.isFinite(),Number.isNaN()
 * 3.Number.parseInt(),Number.parseFloat()
 * 4.Number.isInteger()
 * 5.Number.EPSILON
 * 6.安全整数和Number.isSafeInteger()
 * 7.Math对象的扩展
 * 8.指数运算符
 */
makeHr('1.二进制和八进制表示法');
// 从ES5开始，在严格模式之中，八进制就不再允许使用前缀0表示，ES6进一步明确，要使用前缀0o表示。
// 非严格模式
// (function(){
//   console.log(0o11 === 011);
// })() // true

// // 严格模式
// (function(){
//   'use strict';
//   console.log(0o11 === 011);
// })() // Uncaught SyntaxError: Octal literals are not allowed in strict mode

makeHr('2.Number.isFinite(),Number.isNaN()');
//Number.isFinite(),Number.isNaN() 2个方法与全局中的区别在于,
//传统方法先调用Number()将非数值的值转为数值，再进行判断，而这两个新方法只对数值有效，非数值一律返回false。
makeHr('3.Number.parseInt(),Number.parseFloat()');
//Number.parseInt(),Number.parseFloat() 2个方法与全局中的方法表现一致

makeHr('4.Number.isInteger()');
// Number.isInteger()用来判断一个值是否为整数。
// 需要注意的是，在JavaScript内部，整数和浮点数是同样的储存方法，所以3和3.0被视为同一个值。

log(Number.isInteger(25)) // true
log(Number.isInteger(25.0)) // true
log(Number.isInteger(25.1)) // false
log(Number.isInteger("15")) // false
log(Number.isInteger(true)) // false

makeHr('5.Number.EPSILON');
// ES6在Number对象上面，新增一个极小的常量Number.EPSILON。

Number.EPSILON
// 2.220446049250313e-16
Number.EPSILON.toFixed(20)
// '0.00000000000000022204'
// 引入一个这么小的量的目的，在于为浮点数计算，设置一个误差范围。我们知道浮点数计算是不精确的。
// 但是如果这个误差能够小于Number.EPSILON，我们就可以认为得到了正确结果。


makeHr('6.安全整数和Number.isSafeInteger()');

// JavaScript能够准确表示的整数范围在-2^53到2^53之间（不含两个端点），超过这个范围，无法精确表示这个值。

Math.pow(2, 53) // 9007199254740992

9007199254740992  // 9007199254740992
9007199254740993  // 9007199254740992

Math.pow(2, 53) === Math.pow(2, 53) + 1
// true
// 上面代码中，超出2的53次方之后，一个数就不精确了。

// ES6引入了Number.MAX_SAFE_INTEGER和Number.MIN_SAFE_INTEGER这两个常量，用来表示这个范围的上下限。

Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1
// true
Number.MAX_SAFE_INTEGER === 9007199254740991
// true

Number.MIN_SAFE_INTEGER === -Number.MAX_SAFE_INTEGER
// true
Number.MIN_SAFE_INTEGER === -9007199254740991
// true

// Number.isSafeInteger()则是用来判断一个整数是否落在这个范围之内。

Number.isSafeInteger('a') // false
Number.isSafeInteger(null) // false
Number.isSafeInteger(NaN) // false
Number.isSafeInteger(Infinity) // false
Number.isSafeInteger(-Infinity) // false

Number.isSafeInteger(3) // true
Number.isSafeInteger(1.2) // false
Number.isSafeInteger(9007199254740990) // true
Number.isSafeInteger(9007199254740992) // false

Number.isSafeInteger(Number.MIN_SAFE_INTEGER - 1) // false
Number.isSafeInteger(Number.MIN_SAFE_INTEGER) // true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER) // true
Number.isSafeInteger(Number.MAX_SAFE_INTEGER + 1) // false
// 注意，验证运算结果是否落在安全整数的范围时，不要只验证运算结果，而要同时验证参与运算的每个值。

Number.isSafeInteger(9007199254740993)
// false
Number.isSafeInteger(990)
// true
Number.isSafeInteger(9007199254740993 - 990)
// true
9007199254740993 - 990
// 返回结果 9007199254740002
// 正确答案应该是 9007199254740003
// 上面代码中，9007199254740993不是一个安全整数，但是Number.isSafeInteger会返回结果，显示计算结果是安全的。这是因为，这个数超出了精度范围，导致在计算机内部，以9007199254740992的形式储存。

9007199254740993 === 9007199254740992
// true


makeHr('7.Math对象的扩展');
/* Math.trunc() */
// Math.trunc方法用于去除一个数的小数部分，返回整数部分。
Math.trunc(4.1) // 4
Math.trunc(4.9) // 4
Math.trunc(-4.1) // -4
Math.trunc(-4.9) // -4
Math.trunc(-0.1234) // -0
// 对于非数值，Math.trunc内部使用Number方法将其先转为数值。


/* Math.sign() */
// Math.sign方法用来判断一个数到底是正数、负数、还是零。

// 它会返回五种值。

// 参数为正数，返回+1；
// 参数为负数，返回-1；
// 参数为0，返回0；
// 参数为-0，返回-0;
// 其他值，返回NaN。


/* Math.cbrt() */
// Math.cbrt方法用于计算一个数的立方根。

Math.cbrt(-1) // -1
Math.cbrt(0)  // 0
Math.cbrt(1)  // 1
Math.cbrt(2)  // 1.2599210498948734
// 对于非数值，Math.cbrt方法内部也是先使用Number方法将其转为数值。

Math.cbrt('8') // 2
Math.cbrt('hello') // NaN

/* Math.clz32() */
// JavaScript的整数使用32位二进制形式表示，Math.clz32方法返回一个数的32位无符号整数形式有多少个前导0。

Math.clz32(0) // 32
Math.clz32(1) // 31
Math.clz32(1000) // 22
Math.clz32(0b01000000000000000000000000000000) // 1
Math.clz32(0b00100000000000000000000000000000) // 2

/* Math.imul() */
// Math.imul方法返回两个数以32位带符号整数形式相乘的结果，返回的也是一个32位的带符号整数。

Math.imul(2, 4);          // 8
Math.imul(-1, 8);         // -8
Math.imul(-2, -2);        // 4
// 如果只考虑最后32位，大多数情况下，Math.imul(a, b)与a * b的结果是相同的，
// 即该方法等同于(a * b)|0的效果（超过32位的部分溢出）。
// 之所以需要部署这个方法，是因为JavaScript有精度限制，超过2的53次方的值无法精确表示。
// 这就是说，对于那些很大的数的乘法，低位数值往往都是不精确的，Math.imul方法可以返回正确的低位数值。

(0x7fffffff * 0x7fffffff)|0 // 0
// 上面这个乘法算式，返回结果为0。
// 但是由于这两个二进制数的最低位都是1，所以这个结果肯定是不正确的，
// 因为根据二进制乘法，计算结果的二进制最低位应该也是1。
// 这个错误就是因为它们的乘积超过了2的53次方，JavaScript无法保存额外的精度，就把低位的值都变成了0。
// Math.imul方法可以返回正确的值1。

Math.imul(0x7fffffff, 0x7fffffff) // 1


/* Math.fround() */
// Math.fround方法返回一个数的单精度浮点数形式。

Math.fround(0);     // 0
Math.fround(1);     // 1
Math.fround(1.337); // 1.3370000123977661
Math.fround(1.5);   // 1.5
Math.fround(NaN);   // NaN
// 对于整数来说，Math.fround方法返回结果不会有任何不同，区别主要是那些无法用64个二进制位精确表示的小数。
// 这时，Math.fround方法会返回最接近这个小数的单精度浮点数。



/* Math.hypot() */
// Math.hypot方法返回所有参数的平方和的平方根。

Math.hypot(3, 4);        // 5
Math.hypot(3, 4, 5);     // 7.0710678118654755
Math.hypot();            // 0
Math.hypot(NaN);         // NaN
Math.hypot(3, 4, 'foo'); // NaN
Math.hypot(3, 4, '5');   // 7.0710678118654755
Math.hypot(-3);          // 3
// 上面代码中，3的平方加上4的平方，等于5的平方。

// 如果参数不是数值，Math.hypot方法会将其转为数值。只要有一个参数无法转为数值，就会返回NaN。


/* 对数方法 */
// （1） Math.expm1()
// 
// Math.expm1(x)返回ex - 1，即Math.exp(x) - 1。
// 
// （2）Math.log1p()
// 
// Math.log1p(x)方法返回1 + x的自然对数，即Math.log(1 + x)。如果x小于-1，返回NaN。
// 
// （3）Math.log10()
// 
// Math.log10(x)返回以10为底的x的对数。如果x小于0，则返回NaN。
// 
// （4）Math.log2()
// 
// Math.log2(x)返回以2为底的x的对数。如果x小于0，则返回NaN。


/*三角函数方法*/
// ES6新增了6个三角函数方法。

// Math.sinh(x) 返回x的双曲正弦（hyperbolic sine）
// Math.cosh(x) 返回x的双曲余弦（hyperbolic cosine）
// Math.tanh(x) 返回x的双曲正切（hyperbolic tangent）
// Math.asinh(x) 返回x的反双曲正弦（inverse hyperbolic sine）
// Math.acosh(x) 返回x的反双曲余弦（inverse hyperbolic cosine）
// Math.atanh(x) 返回x的反双曲正切（inverse hyperbolic tangent）



makeHr('8.指数运算');
// ES7新增了一个指数运算符（**），目前Babel转码器已经支持。

// 2 ** 2 // 4
// 2 ** 3 // 8
// 指数运算符可以与等号结合，形成一个新的赋值运算符（**=）。

// let a = 2;
// a **= 2;
// 等同于 a = a * a;

// let b = 3;
// b **= 3;
// 等同于 b = b * b * b;