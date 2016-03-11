'use strict';
var {makeHr,log}=require('./support');

makeHr('1.RegExp构造函数');
// ES6允许RegExp构造函数接受正则表达式作为参数，这时会返回一个原有正则表达式的拷贝。
var regex = new RegExp(/xyz/i);

// 如果使用RegExp构造函数的第二个参数指定修饰符，则返回的正则表达式会忽略原有的正则表达式的修饰符，只使用新指定的修饰符。
new RegExp(/abc/ig, 'i').flags
// "i"

makeHr('2.字符串的正则方法');

// 字符串对象共有4个方法，可以使用正则表达式：match()、replace()、search()和split()。

// ES6将这4个方法，在语言内部全部调用RegExp的实例方法，从而做到所有与正则相关的方法，全都定义在RegExp对象上。

// String.prototype.match 调用 RegExp.prototype[Symbol.match]
// String.prototype.replace 调用 RegExp.prototype[Symbol.replace]
// String.prototype.search 调用 RegExp.prototype[Symbol.search]
// String.prototype.split 调用 RegExp.prototype[Symbol.split]