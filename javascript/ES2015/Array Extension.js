'use strict';
var {
    makeHr, log
} = require('./support');

/*==================== 数组的扩展 ====================*/
/**
 * 1.Array.from()
 * 2.Array.of()
 * 3.数组实例的copyWithin()
 * 4.数组实例的find()和findIndex()
 * 5.数组实例的fill()
 * 6.数组实例的entries()，keys()和values()
 * 7.数组实例的includes()
 * 8.数组的空位
 * 9.数组推导
 */


makeHr('1.Array.from()');

// Array.from方法用于将两类对象转为真正的数组：
//  类似数组的对象（array-like object）和可遍历（iterable）的对象（包括ES6新增的数据结构Set和Map）。
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};

// ES5的写法
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']

// ES6的写法
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']
// console.log(arrayLike,arr2);

// 如果参数是一个真正的数组，Array.from会返回一个一模一样的新数组。

Array.from([1, 2, 3]);
// [1, 2, 3]
// 值得提醒的是，扩展运算符（...）也可以将某些数据结构转为数组。

// arguments对象
function foo() {
    var args = [...arguments];
}

// NodeList对象
[... {
    '0': 1,
    '1': 2,
    '2': 4,
    length: 3
}]
// 扩展运算符背后调用的是遍历器接口（Symbol.iterator），如果一个对象没有部署这个接口，就无法转换。Array.from方法则是还支持类似数组的对象。所谓类似数组的对象，本质特征只有一点，即必须有length属性。因此，任何有length属性的对象，都可以通过Array.from方法转为数组，而此时扩展运算符就无法转换。

Array.from({
    length: 3
});
// [ undefined, undefined, undefinded ]
// 上面代码中，Array.from返回了一个具有三个成员的数组，每个位置的值都是undefined。扩展运算符转换不了这个对象。

// Array.from还可以接受第二个参数，作用类似于数组的map方法，用来对每个元素进行处理，将处理后的值放入返回的数组。

Array.from(arrayLike, x => x * x);
// 等同于
Array.from(arrayLike).map(x => x * x);

Array.from([1, 2, 3], (x) => x * x)
    // [1, 4, 9]

// 不兼容环境替代方案
const toArray = (() =>
    Array.from ? Array.from : obj => [].slice.call(obj)
)();

// 下面的例子是取出一组DOM节点的文本内容。
// let spans = document.querySelectorAll('span.name');
// //map()
// let names1 = Array.prototype.map.call(spans, s => s.textContent);
// //Array.from()
// let names2 = Array.from(spans, s => s.textContent)

// console.log(Array.from({length:2},()=>'jack'));

function typesof() {
    return Array.from(arguments, value => typeof value);
}
// console.log(typesof(null, [], NaN));
// ['object', 'object', 'number']


// Array.from()的另一个应用是，将字符串转为数组，然后返回字符串的长度。因为它能正确处理各种Unicode字符，可以避免JavaScript将大于\uFFFF的Unicode字符，算作两个字符的bug。

function countSymbols(string) {
  return Array.from(string).length;
}


makeHr('2.Array.of()');

// Array.of方法用于将一组值，转换为数组。
Array.of(3,11,8); // [3,11,8]
Array.of(3); //[3]
Array.of(3).length; //1

// 这个方法的主要目的，是弥补数组构造函数Array()的不足。因为参数个数的不同，会导致Array()的行为有差异。

// Array.of方法可以用下面的代码模拟实现。

function ArrayOf(){
  return [].slice.call(arguments);
}

makeHr('2.数组实例的copyWithin()');


// 数组实例的copyWithin方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，会修改当前数组。

// Array.prototype.copyWithin(target, start = 0, end = this.length)
// 它接受三个参数。

// target（必需）：从该位置开始替换数据。
// start（可选）：从该位置开始读取数据，默认为0。如果为负值，表示倒数。
// end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示倒数。
// 这三个参数都应该是数值，如果不是，会自动转为数值。
// 注: 替换的长度等于(end - 1) - start + 1

// 对于没有部署TypedArray的copyWithin方法的平台
// 需要采用下面的写法
[].copyWithin.call(new Int32Array([1, 2, 3, 4, 5]), 0, 3, 4);
// Int32Array [4, 2, 3, 4, 5]

makeHr('4.数组实例的find()和findIndex()');

// 数组实例的find方法，用于找出*第一个*符合条件的数组成员。
// 它的参数是一个回调函数，所有数组成员依次执行该回调函数，
// 直到找出第一个返回值为true的成员，然后返回该成员。
// 如果没有符合条件的成员，则返回undefined。

[1, 4, -5, 10].find((n) => n < 0);
// -5

// 上面代码找出数组中第一个小于0的成员。

[1, 5, 10, 15].find(function(value, index, arr) {
  return value > 9;
}); // 10
// 上面代码中，find方法的回调函数可以接受三个参数，
// 依次为当前的值、当前的位置和原数组。


// 数组实例的findIndex方法的用法与find方法非常类似，
// 返回第一个符合条件的数组成员的位置，
// 如果所有成员都不符合条件，则返回-1。

// 这两个方法都可以接受第二个参数，用来绑定回调函数的this对象。

// 另外，这两个方法都可以发现NaN，弥补了数组的IndexOf方法的不足。

[NaN].indexOf(NaN);
// -1

[NaN].findIndex(y => Object.is(NaN, y));
// 0
// 上面代码中，indexOf方法无法识别数组的NaN成员，
// 但是findIndex方法可以借助Object.is方法做到。

makeHr('5.数组实例的fill()');

// fill方法使用给定值，填充一个数组。

['a', 'b', 'c'].fill(7);
// [7, 7, 7]

new Array(3).fill(7);
// [7, 7, 7]
// 上面代码表明，fill方法用于空数组的初始化非常方便。
// 数组中已有的元素，会被全部抹去。

// fill方法还可以接受第二个和第三个参数，
// 用于指定填充的起始位置和结束位置。

['a', 'b', 'c'].fill(7, 1, 2);
// ['a', 7, 'c']
// 上面代码表示，fill方法从1号位开始，
// 向原数组填充7，到2号位之前结束。

makeHr('6.数组实例的entries(),keys()和values()');

// ES6提供三个新的方法——entries()，keys()和values()——用于遍历数组。
// 它们都返回一个遍历器对象（详见《Iterator》一章），
// 可以用for...of循环进行遍历，
// 唯一的区别是
//  keys()是对键名的遍历、
//  values()是对键值的遍历，
//  entries()是对键值对的遍历。

for (let index of ['a', 'b'].keys()) {
  // console.log(index);
}
// 0
// 1

for (let elem of ['a', 'b'].values()) {
  // console.log(elem);
}
// 'a'
// 'b'

for (let [index, elem] of ['a', 'b'].entries()) {
  // console.log(index, elem);
}
// 0 "a"
// 1 "b"
// 如果不使用for...of循环，
// 可以手动调用遍历器对象的next方法，进行遍历。

// let letter = ['a', 'b', 'c'];
// let entries = letter.entries();
// console.log(entries.next().value); // [0, 'a']
// console.log(entries.next().value); // [1, 'b']
// console.log(entries.next().value); // [2, 'c']

makeHr('7.数组实例的includes()*ES7*');

// Array.prototype.includes方法返回一个布尔值，
// 表示某个数组是否包含给定的值，
// 与字符串的includes方法类似。
// 该方法属于*ES7*，但Babel转码器已经支持。

[1, 2, 3].includes(2);     // true
[1, 2, 3].includes(4);     // false
[1, 2, NaN].includes(NaN); // true
// 该方法的第二个参数表示搜索的起始位置，默认为0。
// 如果第二个参数为负数，则表示倒数的位置，
// 如果这时它大于数组长度（比如第二个参数为-4，但数组长度为3），则会重置为从0开始。

[1, 2, 3].includes(3, 3);  // false
[1, 2, 3].includes(3, -1); // true

// 没有该方法之前，我们通常使用数组的indexOf方法，检查是否包含某个值。
// if (arr.indexOf(el) !== -1) {
//   // ...
// }
// indexOf方法有两个缺点，
//  一是不够语义化，它的含义是找到参数值的第一个出现位置，
//      所以要去比较是否不等于-1，表达起来不够直观。
//  二是，它内部使用严格相当运算符（===）进行判断，这会导致对NaN的误判。
[NaN].indexOf(NaN);
// -1

// includes使用的是不一样的判断算法，就没有这个问题。
[NaN].includes(NaN);
// true
// 下面代码用来检查当前环境是否支持该方法，
// 如果不支持，部署一个简易的替代版本。

const contains = (() =>
  Array.prototype.includes
    ? (arr, value) => arr.includes(value)
    : (arr, value) => arr.some(el => el === value)
)();
contains(["foo", "bar"], "baz"); // => false
// 另外，Map和Set数据结构有一个has方法，需要注意与includes区分。
// Map结构的has方法，是用来查找键名的，
//  比如Map.prototype.has(key)、WeakMap.prototype.has(key)、Reflect.has(target, propertyKey)。
// Set结构的has方法，是用来查找值的，
//  比如Set.prototype.has(value)、WeakSet.prototype.has(value)。

makeHr('8.数组的空位');

// 数组的空位指，数组的某一个位置没有任何值。
// 比如，Array构造函数返回的数组都是空位。

Array(3); // [, , ,]
// 上面代码中，Array(3)返回一个具有3个空位的数组。

// *注意*，空位不是undefined，一个位置的值等于undefined，依然是有值的。空位是没有任何值，in运算符可以说明这一点。

0 in [undefined, undefined, undefined]; // true
0 in [, , ,]; // false
// 上面代码说明，第一个数组的0号位置是有值的，第二个数组的0号位置没有值。

// ES5对空位的处理，已经很不一致了，大多数情况下会忽略空位。

// forEach(), filter(), every() 和some()都会跳过空位。
// map()会跳过空位，但会保留这个值
// join()和toString()会将空位视为undefined，
// 而undefined和null会被处理成空字符串。

// forEach方法
[,,'a'].forEach((x,i) => log(i)); // 1

// filter方法
['a',,'b'].filter(x => true); // ['a','b']

// every方法
[,'a'].every(x => x==='a');// true

// some方法
[,'a'].some(x => x !== 'a');// false

// map方法
[,'a'].map(x => 1); // [,1]

// join方法
[,'a',undefined,null].join('#'); // "#a##"

// toString方法
[,'a',undefined,null].toString(); // ",a,,"


// ES6则是明确将空位转为undefined。

// Array.from方法会将数组的空位，转为undefined，也就是说，这个方法不会忽略空位。

Array.from(['a',,'b']);
// [ "a", undefined, "b" ]
// 扩展运算符（...）也会将空位转为undefined。

[...['a',,'b']];
// [ "a", undefined, "b" ]
// copyWithin()会连空位一起拷贝。

[,'a','b',,].copyWithin(2,0); // [,"a",,"a"]
// fill()会将空位视为正常的数组位置。

new Array(3).fill('a'); // ["a","a","a"]
// for...of循环也会遍历空位。

let arr = [, ,];
for (let i of arr) {
  console.log(1);
}
// 1
// 1
// 上面代码中，数组arr有两个空位，for...of并没有忽略它们。如果改成map方法遍历，空位是会跳过的。

// entries()、keys()、values()、find()和findIndex()会将空位处理成undefined。

// entries()
[...[,'a'].entries()]; // [[0,undefined], [1,"a"]]

// keys()
[...[,'a'].keys()]; // [0,1]

// values()
[...[,'a'].values()]; // [undefined,"a"]

// find()
[,'a'].find(x => true); // undefined

// findIndex()
[,'a'].findIndex(x => true); // 0
// 由于空位的处理规则非常不统一，所以建议避免出现空位。

makeHr('9.数组推导*ES7*');

// 数组推导（array comprehension）提供简洁写法，
// 允许直接通过现有数组生成新数组。
// 这项功能本来是要放入ES6的，但是TC39委员会想继续完善这项功能，让其支持所有数据结构（内部调用iterator对象），不像现在只支持数组，所以就把它推迟到了*ES7*。
// Babel转码器已经支持这个功能。

// var a1 = [1, 2, 3, 4];
// var a2 = [for (i of a1) i * 2];

// log(a2); // [2, 4, 6, 8]
// 上面代码表示，通过for...of结构，数组a2直接在a1的基础上生成。

// 注意，数组推导中，for...of结构总是写在最前面，返回的表达式写在最后面。

// for...of后面还可以附加if语句，用来设定循环的限制条件。

// var years = [ 1954, 1974, 1990, 2006, 2010, 2014 ];

// [for (year of years) if (year > 2000) year];
// [ 2006, 2010, 2014 ]

// [for (year of years) if (year > 2000) if(year < 2010) year];
// [ 2006]

// [for (year of years) if (year > 2000 && year < 2010) year];
// [ 2006]
// 上面代码表明，if语句要写在for...of与返回的表达式之间，
// 而且可以多个if语句连用。

// 下面是另一个例子。

// var customers = [
//   {
//     name: 'Jack',
//     age: 25,
//     city: 'New York'
//   },
//   {
//     name: 'Peter',
//     age: 30,
//     city: 'Seattle'
//   }
// ];

// var results = [
//   for (c of customers)
//     if (c.city == "Seattle")
//       { name: c.name, age: c.age }
// ];
// log(results); // { name: "Peter", age: 30 }
// 数组推导可以替代map和filter方法。

// [for (i of [1, 2, 3]) i * i];
// 等价于
// [1, 2, 3].map(function (i) { return i * i });

// [for (i of [1,4,2,3,-8]) if (i < 3) i];
// 等价于
// [1,4,2,3,-8].filter(function(i) { return i < 3 });
// 上面代码说明，模拟map功能只要单纯的for...of循环就行了，模拟filter功能除了for...of循环，还必须加上if语句。

// 在一个数组推导中，还可以使用多个for...of结构，构成多重循环。

// var a1 = ['x1', 'y1'];
// var a2 = ['x2', 'y2'];
// var a3 = ['x3', 'y3'];

// [for (s of a1) for (w of a2) for (r of a3) log(s + w + r)];
// x1x2x3
// x1x2y3
// x1y2x3
// x1y2y3
// y1x2x3
// y1x2y3
// y1y2x3
// y1y2y3
// 上面代码在一个数组推导之中，使用了三个for...of结构。

// 需要注意的是，数组推导的方括号构成了一个单独的作用域，在这个方括号中声明的变量类似于使用let语句声明的变量。

// 由于字符串可以视为数组，因此字符串也可以直接用于数组推导。

// [for (c of 'abcde') if (/[aeiou]/.test(c)) c].join(''); // 'ae'

// [for (c of 'abcde') c+'0'].join(''); // 'a0b0c0d0e0'
// 上面代码使用了数组推导，对字符串进行处理。

// 数组推导需要注意的地方是，新数组会立即在内存中生成。这时，如果原数组是一个很大的数组，将会非常耗费内存。