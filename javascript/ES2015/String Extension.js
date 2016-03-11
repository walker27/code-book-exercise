'use strict';
var {makeHr,log}=require('./support');
// console.log(a);
// var makeHr = a.makeHr;
// var log = a.log;
/**
 * 1. 字符的Unicode表示法
 */
makeHr('1. 字符的Unicode表示法');

'\u0061';// "a"

// 若后面的值超过0xFFFF 则需要写上大括号
'\u{20BB7}';// "𠮷"

'\u{41}\u{42}\u{43}';// "ABC"

let hello = 123;
hell\u{6f};// 123

// '\u{1F680}' === '\uD83D\uDE80'
// true

'\z' === 'z';  // true
// 下面这句在babel-node中测试失败，原因是strict模式不允许八进制字面量
// '\172' === 'z'; // true
'\x7A' === 'z'; // true
'\u007A' === 'z'; // true
'\u{7A}' === 'z'; // true


/**
 * 2. codePointAt()
 */
makeHr('2.codePointAt()');

// JavaScript内部，字符以UTF-16的格式储存，每个字符固定为2个字节。
// 对于那些需要4个字节储存的字符（Unicode码点大于0xFFFF的字符），JavaScript会认为它们是两个字符。

var s = '𠮷';// \u{20BB7}

s.length;// 2
s.charAt(0);// ''
s.charAt(1);// ''
s.charCodeAt(0);// 55362
s.charCodeAt(1);// 57271

var s2 = '𠮷a'
s2.codePointAt(0);// 134071 == 0xD842
s2.codePointAt(1);// 57271 == 0xDFB7
s2.codePointAt(0).toString(16);// "20BB7"
s2.charCodeAt(2);// 97
for (let ch of s) {
  ch.codePointAt(0).toString(16);
}

// codePointAt方法是测试一个字符由两个字节还是由四个字节组成的最简单方法。
function is32Bit(c){
  return c.codePointAt(0) > 0xFFFF;
}

is32Bit("𠮷");// true
is32Bit("a");// false

/**
 * 3.String.fromCodePoint()
 */
makeHr('3.String.fromCodePoint()');

// ES5提供String.fromCharCode方法，用于从码点返回对应字符，但是这个方法不能识别32位的UTF-16字符（Unicode编号大于0xFFFF）。

String.fromCharCode(0x20BB7);// "ஷ"
// 上面代码中，String.fromCharCode不能识别大于0xFFFF的码点，所以0x20BB7就发生了溢出，最高位2被舍弃了，最后返回码点U+0BB7对应的字符，而不是码点U+20BB7对应的字符。

// ES6提供了String.fromCodePoint方法，可以识别0xFFFF的字符，弥补了String.fromCharCode方法的不足。在作用上，正好与codePointAt方法相反。

String.fromCodePoint(0x20BB7);// "𠮷"
String.fromCodePoint(0x78, 0x1f680, 0x79) === 'x\uD83D\uDE80y';// true
// 上面代码中，如果String.fromCharCode方法有多个参数，则它们会被合并成一个字符串返回。

// 注意，fromCodePoint方法定义在String对象上，而codePointAt方法定义在字符串的实例对象上。

/**
 * 4.字符串的遍历器接口
 */
makeHr('4.字符串的遍历器接口');

// ES6为字符串添加了遍历器接口 (详见《Iterator》)，使得字符串可以被for...of循环遍历。

for (let codePoint of 'foo') {
  console.log(codePoint);
}
// "f"
// "o"
// "o"
// 除了遍历字符串，这个遍历器最大的优点是可以识别大于0xFFFF的码点，传统的for循环无法识别这样的码点。

var text = String.fromCodePoint(0x20BB7);

for (let i = 0; i < text.length; i++) {
  console.log(text[i]);
}
// " "
// " "

for (let i of text) {
  console.log(i);
}
// "𠮷"
// 上面代码中，字符串text只有一个字符，但是for循环会认为它包含两个字符（都不可打印），而for...of循环会正确识别出这一个字符。

/**
 * 5.at()
 */
makeHr('5.at()');

// ES5对字符串对象提供charAt方法，返回字符串给定位置的字符。该方法不能识别码点大于0xFFFF的字符。
'abc'.charAt(0) // "a"
'𠮷'.charAt(0) // "\uD842"
// 上面代码中，charAt方法返回的是UTF-16编码的第一个字节，实际上是无法显示的。

// ES7提供了字符串实例的at方法，可以识别Unicode编号大于0xFFFF的字符，返回正确的字符。Chrome浏览器已经支持该方法。

'abc'.at(0) // "a"
'𠮷'.at(0) // "𠮷"

/**
 * 6.normalize()
 * 语调和重音符号
 */
makeHr('6.normalize()');

// 为了表示语调和重音符号，Unicode提供了两种方法。一种是直接提供带重音符号的字符，比如Ǒ（\u01D1）。
// 另一种是提供合成符号（combining character），即原字符与重音符号的合成，两个字符合成一个字符，比如O（\u004F）和ˇ（\u030C）合成Ǒ（\u004F\u030C）。

// 这两种表示方法，在视觉和语义上都等价，但是JavaScript不能识别。

'\u01D1'==='\u004F\u030C' //false

'\u01D1'.length // 1
'\u004F\u030C'.length // 2
// 上面代码表示，JavaScript将合成字符视为两个字符，导致两种表示方法不相等。

// ES6提供字符串实例的normalize()方法，用来将字符的不同表示方法统一为同样的形式，这称为Unicode正规化。
'\u01D1'.normalize(); // Ǒ
'\u01D1'.normalize() === '\u004F\u030C'.normalize();// true

// true
// normalize方法可以接受四个参数。
//    -NFC，默认参数，表示“标准等价合成”（Normalization Form Canonical Composition），
//          返回多个简单字符的合成字符。所谓“标准等价”指的是视觉和语义上的等价。
//          
//    -NFD，表示“标准等价分解”（Normalization Form Canonical Decomposition），
//          即在标准等价的前提下，返回合成字符分解的多个简单字符。
//          
//    -NFKC，表示“兼容等价合成”（Normalization Form Compatibility Composition），返回合成字符。
//          所谓“兼容等价”指的是语义上存在等价，但视觉上不等价，比如“囍”和“喜喜”。（这只是用来举例，normalize方法不能识别中文。）
//          
//    -NFKD，表示“兼容等价分解”（Normalization Form Compatibility Decomposition），
//           即在兼容等价的前提下，返回合成字符分解的多个简单字符。

'\u004F\u030C'.normalize('NFC').length // 1
'\u004F\u030C'.normalize('NFD').length // 2
//    上面代码表示，NFC参数返回字符的合成形式，NFD参数返回字符的分解形式。

// 不过，normalize方法目前不能识别三个或三个以上字符的合成。这种情况下，还是只能使用正则表达式，通过Unicode编号区间判断。

/**
 * 7.includes(), startsWith(), endsWith()
 */
makeHr('7.includes(), startsWith(), endsWith()');

// 传统上，JavaScript只有indexOf方法，可以用来确定一个字符串是否包含在另一个字符串中。ES6又提供了三种新方法。

//    includes()：返回布尔值，表示是否找到了参数字符串。
//    startsWith()：返回布尔值，表示参数字符串是否在源字符串的头部。
//    endsWith()：返回布尔值，表示参数字符串是否在源字符串的尾部。
var s = 'Hello world!';

s.startsWith('Hello') // true
s.endsWith('!') // true
s.includes('o') // true
// 这三个方法都支持第二个参数，表示开始搜索的位置。

var s = 'Hello world!';

s.startsWith('world', 6) // true
s.endsWith('Hello', 5) // true
s.includes('Hello', 6) // false
// 上面代码表示，使用第二个参数n时，endsWith的行为与其他两个方法有所不同。
// 它针对前n个字符，而其他两个方法针对从第n个位置直到字符串结束。


/**
 * 8.repeat()
 */
makeHr('8.repeat()');

// repeat方法返回一个新字符串，表示将原字符串重复n次。

'x'.repeat(3) // "xxx"
'hello'.repeat(2) // "hellohello"
'na'.repeat(0) // ""

// 参数如果是小数，会被取整。
'na'.repeat(2.9); // "nana"
// // 如果repeat的参数是负数或者Infinity，会报错。
// 'na'.repeat(Infinity);
// // RangeError
// 'na'.repeat(-1);
// // RangeError

// 但是，如果参数是0到-1之间的小数，则等同于0，这是因为会先进行取整运算。0到-1之间的小数，取整以后等于-0，repeat视同为0。
'na'.repeat(-0.9) // ""

// 参数NaN等同于0。
'na'.repeat(NaN) // ""

// 如果repeat的参数是字符串，则会先转换成数字。
'na'.repeat('na') // ""
'na'.repeat('3') // "nanana"

/**
 * 9.padStart(),padEnd();
 */
makeHr('9.padStart(),padEnd();');

// ES7推出了字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或尾部补全。
// padStart用于头部补全，padEnd用于尾部补全。

// 'x'.padStart(5, 'ab'); // 'ababx'
// 'x'.padStart(4, 'ab'); // 'abax'
// 
// 'x'.padEnd(5, 'ab') // 'xabab'
// 'x'.padEnd(4, 'ab') // 'xaba'
// 上面代码中，padStart和padEnd一共接受两个参数，第一个参数用来指定字符串的最小长度，第二个参数是用来补全的字符串。

// 如果原字符串的长度，等于或大于指定的最小长度，则返回原字符串。
// 'xxx'.padStart(2, 'ab') // 'xxx'
// 'xxx'.padEnd(2, 'ab') // 'xxx'

// 如果省略第二个参数，则会用空格补全长度。
// 'x'.padStart(4) // '   x'
// 'x'.padEnd(4) // 'x   '

/**
 * 10.模板字符串;
 */
makeHr('10.模板字符串;');

// 传统的JavaScript语言，输出模板通常是这样写的。
// $("#result").append(
//   "There are <b>" + basket.count + "</b> " +
//   "items in your basket, " +
//   "<em>" + basket.onSale +
//   "</em> are on sale!"
// );
// 上面这种写法相当繁琐不方便，ES6引入了模板字符串解决这个问题。

// $("#result").append(`
//   There are <b>${basket.count}</b> items
//    in your basket, <em>${basket.onSale}</em>
//   are on sale!
// `);
// 模板字符串（template string）是增强版的字符串，用反引号（`）标识。它可以当作普通字符串使用，也可以用来定义多行字符串，或者在字符串中嵌入变量。

// 普通字符串
`In JavaScript '\n' is a line-feed.`;

// 多行字符串
`In JavaScript this is
 not legal.`;

console.log(`string text line 1
string text line 2`);

// 字符串中嵌入变量
var name = "Bob", time = "today";
`Hello ${name}, how are you ${time}?`;
// 上面代码中的字符串，都是用反引号表示。如果在模板字符串中需要使用反引号，则前面要用反斜杠转义。

var greeting = `\`Yo\` World!`;
// 如果使用模板字符串表示多行字符串，所有的空格和缩进都会被保留在输出之中。

// $("#warning").html(`
//   <h1>Watch out!</h1>
//   <p>Unauthorized hockeying can result in penalties
//   of up to ${maxPenalty} minutes.</p>
// `);
// 模板字符串中嵌入变量，需要将变量名写在${}之中。

function authorize(user, action) {
  if (!user.hasPrivilege(action)) {
    throw new Error(
      // 传统写法为
      // 'User '
      // + user.name
      // + ' is not authorized to do '
      // + action
      // + '.'
      `User ${user.name} is not authorized to do ${action}.`);
  }
}
// 大括号内部可以放入任意的JavaScript表达式，可以进行运算，以及引用对象属性。

var x = 1;
var y = 2;

`${x} + ${y} = ${x + y}`;
// "1 + 2 = 3"

`${x} + ${y * 2} = ${x + y * 2}`;
// "1 + 4 = 5"

var obj = {x: 1, y: 2};
`${obj.x + obj.y}`;
// 3
// 模板字符串之中还能调用函数。

function fn() {
  return "Hello World";
}

`foo ${fn()} bar`;
// foo Hello World bar
// 如果大括号中的值不是字符串，将按照一般的规则转为字符串。比如，大括号中是一个对象，将默认调用对象的toString方法。

// 如果模板字符串中的变量没有声明，将报错。

// // 变量place没有声明
// var msg = `Hello, ${place}`;
// // 报错
// 由于模板字符串的大括号内部，就是执行JavaScript代码，因此如果大括号内部是一个字符串，将会原样输出。

`Hello ${'World'}`;
// "Hello World"
// 如果需要引用模板字符串本身，可以像下面这样写。

// 写法一
let str = 'return ' + '`Hello ${name}!`';
let func = new Function('name', str);
log(func('Jack')) // "Hello Jack!"

// 写法二
let str2 = '(name) => `Hello ${name}!`';
let func2 = eval.call(null, str2);
log(func2('Jack')) // "Hello Jack!"

