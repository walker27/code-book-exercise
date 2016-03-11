'use strict';
var { makeHr, log } = require('./support');
// import {makeHr, log} from './support';
/*==================== 函数的扩展 ====================*/
/**
 * 1.函数参数的默认值
 * 2.rest参数
 * 3.扩展运算符
 * 4.name属性
 * 5.箭头函数
 * 6.函数绑定*ES7*
 * 7.尾调用优化
 * 8.函数参数的尾逗号*ES7*
 */


makeHr('1.函数参数的默认值');

function welcome(name,welcomeWord = 'hello'){
  log(welcomeWord,name);
}
welcome('walker','welcome');
welcome('world','hello');
welcome('world','');

// 除了简洁，ES6的写法还有两个好处：
//     首先，阅读代码的人，可以立刻意识到哪些参数是可以省略的，不用查看函数体或文档；
//     其次，有利于将来的代码优化，即使未来的版本彻底拿掉这个参数，也不会导致以前的代码无法运行。

// 参数变量是默认声明的，所以不能用let或const再次声明。
// function foo(x = 5) {
//   let x = 1; // error
//   const x = 2; // error
// }
// 上面代码中，参数变量x是默认声明的，在函数体中，不能用let或const再次声明，否则会报错。

// 与解构赋值默认值结合使用
function foo({x,y = 5}){
  log(x,y);
}

foo({});//undefined,5
foo({x: 1});// 1,5
foo({x: 1, y: 2});//1,2
// foo();// TypeError: Cannot read property 'x' of undefined

function fetch(url,{body = '',method = 'GET', header = {}}){
  log(method);
}

fetch('http://example.com',{}); // "GET"

// fetch('http://example.com');//报错

function fetch(url, {method = 'GET'} = {}){
  log(method);
}
fetch('http://example.com');// 'GET'
// 上面代码中，函数fetch没有第二个参数时，函数参数的默认值就会生效，
// 然后才是解构赋值的默认值生效，变量method才会取到默认值GET

// 写法一
function m1({x = 0, y = 0} = {}) {
  // log([x,y]);
  return [x, y];
}
// 写法一函数参数的默认值是空对象，但是设置了对象解构赋值的默认值；

// 写法二
function m2({x, y} = { x: 0, y: 0 }) {
  // log([x,y]);
  return [x, y];
}
// 写法二函数参数的默认值是一个有具体属性的对象，但是没有设置对象解构赋值的默认值。

// 函数没有参数的情况
m1() // [0, 0]
m2() // [0, 0]

// x和y都有值的情况
m1({x: 3, y: 8}) // [3, 8]
m2({x: 3, y: 8}) // [3, 8]

// x有值，y无值的情况
m1({x: 3}) // [3, 0]
m2({x: 3}) // [3, undefined]

// x和y都无值的情况
m1({}) // [0, 0];
m2({}) // [undefined, undefined]

m1({z: 3}); // [0, 0]


// 函数的length属性
// 指定了默认值以后，函数的length属性，将返回没有指定默认值的参数个数。
// 也就是说，指定了默认值后，length属性将失真。
// (function(a){}).length // 1
// (function(a = 5){}).length // 0
// (function(a, b, c = 5){}).length // 2
// (function(...args) {}).length // 0


// 作用域
// 一个需要注意的地方是，
// 如果参数默认值是一个变量，则该变量所处的作用域，与其他变量的作用域规则是一样的，
// 即先是当前函数的作用域，然后才是全局作用域。

// var x = 1;

// function f(x, y = x) {
//   log(y);
// }

// f(2); // 2

// 如果调用时，函数作用域内部的变量x没有生成，结果就会不一样。

// let x = 1;

// function f(y = x) {
//   let x = 2;
//   log(y);
// }

// f() // 1
// 上面代码中，函数调用时，y的默认值变量x尚未在函数内部生成，
// 所以x指向全局变量，结果又不一样。
// 如果此时，全局变量x不存在，就会报错。
(() => {
  let foo = 'outer';

  function bar(func = x => foo) {
    let foo = 'inner';
    log(func()); // outer
  }

  bar();
})();

(() => {
  let foo = 'outer';
  let f = x => foo;

  function bar(func = f) {
    let foo = 'inner';
    console.log(func()); // outer
  }

  bar();
})();


// 如果写成下面这样，就会报错。
// function bar(func = () => fooq) {
//   let fooq = 'inner';
//   console.log(func());
// }

// bar() // ReferenceError: foo is not defined

(()=>{
  // 利用参数默认值，可以指定某一个参数不得省略，如果省略就抛出一个错误。
  function throwIfMissing(){
    // throw new Error('Missing parameter');
    // console.error('Missing parameter');
  }
  function foo(mustBeProvided = throwIfMissing()){
    return mustBeProvided;
  }
  foo();
  // 从上面代码还可以看到，参数mustBeProvided的默认值等于throwIfMissing函数的运行结果（即函数名之后有一对圆括号），这表明参数的默认值不是在定义时执行，而是在运行时执行（即如果参数已经赋值，默认值中的函数就不会运行），这与python语言不一样。

  // 另外，可以将参数默认值设为undefined，表明这个参数是可以省略的。
  // function foo(optional = undefined) { ··· }
})();


makeHr('2.rest参数');

(()=>{
  function add(...values){
    let sum = 0;
    for(var val of values){
      sum += val;
    }
    return sum;
  }

  log(add(2,5,4));
})();
// 注意，rest参数之后不能再有其他参数（即只能是最后一个参数），否则会报错。


makeHr('3.扩展运算符');
// 扩展运算符（spread）是三个点（...）。
// 它好比rest参数的逆运算，将一个数组转为用逗号分隔的参数序列。
log([1,2,3],...[1,2,3]);

(() => {
  function push(array, ...items) {
    // push可以接收多个参数的
    array.push(...items);
  }

  function add(x, y) {
    return x + y;
  }
  var numbers = [4, 38];
  log(add(...numbers)); //42
  // 上面代码中，array.push(...items)和add(...numbers)这两行，都是函数的调用，
  // 它们的都使用了扩展运算符。该运算符将一个数组，变为参数序列。

  // 扩展运算符与正常的函数参数可以结合使用，非常灵活。
  function f(v, w, x, y, z) {}
  var args = [0, 1];
  f(-1, ...args, 2, ...[3]);
})();

// 如果将扩展运算符用于数组赋值，只能放在参数的最后一位，否则会报错。
// const [...butLast, last] = [1, 2, 3, 4, 5];// 报错
// const [first, ...middle, last] = [1, 2, 3, 4, 5];// 报错

// 扩展运算符还可以将字符串转为真正的数组。

log([...'hello']);// [ "h", "e", "l", "l", "o" ]
// 上面的写法，有一个重要的好处，那就是能够正确识别32位的Unicode字符。

log('x\uD83D\uDE80y'.length); // 4
log([...'x\uD83D\uDE80y'].length); // 3

(() => {
  // 任何Iterator接口的对象，都可以用扩展运算符转为真正的数组。

  // var nodeList = document.querySelectorAll('div');
  // var array = [...nodeList];
  // 上面代码中，querySelectorAll方法返回的是一个nodeList对象。它不是数组，而是一个类似数组的对象。这时，扩展运算符可以将其转为真正的数组，原因就在于NodeList对象实现了Iterator接口。

  // 对于那些没有部署Iterator接口的类似数组的对象，扩展运算符就无法将其转为真正的数组。

  let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
  };

  // let arr = [...arrayLike]; // TypeError: Cannot spread non-iterable object.
  let arr2 = [...Array.from(arrayLike)]; 
  console.log(arr2);
  // 上面代码中，arrayLike是一个类似数组的对象，但是没有部署Iterator接口，扩展运算符就会报错。这时，可以改为使用Array.from方法将arrayLike转为真正的数组。
})();

makeHr('4.name属性');

// 函数的name属性，返回该函数的函数名。
(() => {
  function foo() {};
  log(foo.name); // "foo"
  // 这个属性早就被浏览器广泛支持，但是直到ES6，才将其写入了标准。

  // 需要注意的是，ES6对这个属性的行为做出了一些修改。如果将一个匿名函数赋值给一个变量，ES5的name属性，会返回空字符串，而ES6的name属性会返回实际的函数名。

  var func1 = function() {};

  // ES5
  // log(func1.name); // ""

  // ES6
  log(func1.name); // "func1" ? 注:试不出来 结果与上同
  // 上面代码中，变量func1等于一个匿名函数，ES5和ES6的name属性返回的值不一样。
  
  const bar = function baz() {};
  // ES6
  log(bar.name); // "baz"  

  // Function构造函数返回的函数实例，name属性的值为“anonymous”。
  log((new Function).name); // "anonymous" 注:试不出来 结果为空

  // bind返回的函数，name属性值会加上“bound ”前缀。
  function foob() {};
  log(foob.bind({}).name); // "bound foob"

  log((function(){}).bind({}).name); // "bound "
})();


makeHr('5.箭头函数');

(() => {
  var f = v => v;
  log(f(3)); //3;
  // 由于大括号被解释为代码块，所以如果箭头函数直接返回一个对象，必须在对象外面加上括号。
  var getTempItem = id => ({id: id, name: "Temp"});

})();
// 使用注意点
// 箭头函数有几个使用注意点。
// 
// （1）函数体内的this对象，就是**定义**时所在的对象，而不是使用时所在的对象。
// 
// （2）不可以当作构造函数，也就是说，不可以使用new命令，否则会抛出一个错误。
// 
// （3）不可以使用arguments对象，该对象在函数体内不存在。如果要用，可以用Rest参数代替。
// 
// （4）不可以使用yield命令，因此箭头函数不能用作Generator函数。
// 
// 上面四点中，第一点尤其值得注意。this对象的指向是可变的，但是在箭头函数中，它是固定的。
// 
// 除了this，以下三个变量在箭头函数之中也是不存在的，指向外层函数的对应变量：arguments、super、new.target。
// 另外，由于箭头函数没有自己的this，所以当然也就不能用call()、apply()、bind()这些方法去改变this的指向。
// 箭头函数还有一个功能，就是可以很方便地改写λ演算。

// λ演算的写法
// fix = λf.(λx.f(λv.x(x)(v)))(λx.f(λv.x(x)(v)))

// ES6的写法
// var fix = f => (x => f(v => x(x)(v)))
//                (x => f(v => x(x)(v)));
// 上面两种写法，几乎是一一对应的。由于λ演算对于计算机科学非常重要，这使得我们可以用ES6作为替代工具，探索计算机科学。

makeHr('6.函数绑定*ES7*');
// 箭头函数可以绑定this对象，大大减少了显式绑定this对象的写法（call、apply、bind）。
// 但是，箭头函数并不适用于所有场合，所以ES7提出了“函数绑定”（function bind）运算符，用来取代call、apply、bind调用。
// 虽然该语法还是ES7的一个提案，但是Babel转码器已经支持。
(()=>{
  var foo = {x:1};
  function bar(){
    log(this.x);
  }
  // foo::bar;
  
  // 如果双冒号左边为空，右边是一个对象的方法，则等于将该方法绑定在该对象上面。

  // var method = obj::obj.foo;
  // 等同于
  // var method = ::obj.foo;
  // 
  // let log = ::console.log;
  // 等同于
  // var log = console.log.bind(console);
  
  // 由于双冒号运算符返回的还是原对象，因此可以采用链式写法。
  // import { map, takeWhile, forEach } from "iterlib";
  //
  // getPlayers()
  // ::map(x => x.character())
  // ::takeWhile(x => x.strength > 100)
  // ::forEach(x => console.log(x));
})();


makeHr('7.尾调用优化');

// 什么是尾调用？
// 尾调用（Tail Call）是函数式编程的一个重要概念，本身非常简单，一句话就能说清楚，就是指某个函数的最后一步是调用另一个函数。

// ES6的尾调用优化只在严格模式下开启，正常模式是无效的。
// 
// 这是因为在正常模式下，函数内部有两个变量，可以跟踪函数的调用栈。
// 
// func.arguments：返回调用时函数的参数。
// func.caller：返回调用当前函数的那个函数。
// 尾调用优化发生时，函数的调用栈会改写，因此上面两个变量就会失真。严格模式禁用这两个变量，所以尾调用模式仅在严格模式下生效。

// 尾递归优化的实现

// 蹦床函数（trampoline）可以将递归执行转为循环执行。

function trampoline(f) {
  while (f && f instanceof Function) {
    f = f();
  }
  return f;
}
// 上面就是蹦床函数的一个实现，它接受一个函数f作为参数。只要f执行后返回一个函数，就继续执行。
// 注意，这里是返回一个函数，然后执行该函数，而不是函数里面调用函数，这样就避免了递归执行，从而就消除了调用栈过大的问题。
// 然后，要做的就是将原来的递归函数，改写为每一步返回另一个函数。

// 蹦床函数并不是真正的尾递归优化，下面的实现才是。

function tco(f) {
  var value;
  var active = false;
  var accumulated = [];

  return function accumulator() {
    accumulated.push(arguments);
    if (!active) {
      active = true;
      while (accumulated.length) {
        value = f.apply(this, accumulated.shift());
      }
      active = false;
      return value;
    }
  }
}

var sum = tco(function(x, y) {
  if (y > 0) {
    return sum(x + 1, y - 1)
  }
  else {
    return x
  }
});

log(sum(1, 100000));
// 100001
// 上面代码中，tco函数是尾递归优化的实现，它的奥妙就在于状态变量active。默认情况下，这个变量是不激活的。一旦进入尾递归优化的过程，这个变量就激活了。然后，每一轮递归sum返回的都是undefined，所以就避免了递归执行；而accumulated数组存放每一轮sum执行的参数，总是有值的，这就保证了accumulator函数内部的while循环总是会执行。这样就很巧妙地将“递归”改成了“循环”，而后一轮的参数会取代前一轮的参数，保证了调用栈只有一层。

makeHr('8.函数参数的尾逗号*ES7*');

// ES7有一个提案，允许函数的最后一个参数有尾逗号（trailing comma）。