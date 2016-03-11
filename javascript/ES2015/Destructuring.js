'use strict';
/**
 * 解构赋值
 * 1.支持默认值,当对象的属性值严格等于undefined时生效
 */
function log(obj) {
  for (var i in obj) {
    console.log(i + ':' + obj[i]);
  }
}
// 数组的解构赋值
(() => {
  console.log('----------数组的解构赋值----------');

  function defaultValue() {
    console.log('run defaultValue()');
    return 0
  }
  // 可以指定默认值
  // 支持嵌套
  // 若e能取到值，则不会执行defaultValue()方法
  let [a, , b, [c, d], e = defaultValue()] = [true, 0, 2, [3, 4], 5];
  log({
    'a': a,
    'b': b,
    'c': c,
    'd': d,
    'e': e
  });
})();
// 对象的解构赋值
(() => {
  // 需要解构的变量名与对象中的属性名一致
  // 或者在解构赋值中按照键值对的写法，键与对象中的属性一致，值则为新的变量名
  // 如下的xxx 称为模式,不会建立xxx变量,none称为变量
  console.log('----------对象的解构赋值----------');
  let {
    foo, bar, xxx: none
  } = {
    foo: 'aaa',
    bar: 'bbb',
    xxx: 'ccc'
  };
  log({
    'foo': foo,
    'bar': bar,
    'none': none
  });
  let c;
  let obj = {};
  let func;
  // 只有在外部加上小括号才能将声明和赋值分离,不然会被误认为块解构
  ({
    c, d: obj.d, e: func
  } = {
    c: 1,
    d: 222,
    e: function() {
      console.log('hello e');
    }
  });
  log({
    'c': c,
    'obj.d': obj.d
  })
  func();
})();
// 字符串的解构赋值
(() => {
  console.log('----------字符串的解构赋值----------');
  const [a, b, c, d, e] = 'hello';
  let {
    length: len
  } = 'hello';
  log({
    a: a,
    b: b,
    c: c,
    d: d,
    e: e,
    len: len
  })
})();
// 数值和布尔值的解构赋值
(() => {
  console.log('----------数值和布尔值的解构赋值----------');
  let {
    toString: s
  } = 123;
  let {
    toString: s1
  } = true;
  log({
    s: s === Number.prototype.toString,
    s1: s1 === Boolean.prototype.toString
  });
  // let {prop:x}=undefined; // TypeError
  // let {prop:y}=null; // TypeError
})();
// 函数参数的解构赋值
(() => {
  console.log('----------函数参数的解构赋值----------');

  function add([x, y]) {
    return x + y;
  }
  log({
    addFunc: add([2, 4])
  });

  function move({
    x = 0, y = 0
  } = {}) {
    return [x, y]
  }
  log({
    'x:3,y:8 ': move({
      x: 3,
      y: 8
    }),
    'x:3': move({
      x: 3
    }),
    '{}': move({}),
    '': move()
  });
  // 注意上下区别
  function move2({
    x, y
  } = {
    x: 0,
    y: 0
  }) {
    return [x, y]
  }
  log({
    'x:3,y:8 ': move2({
      x: 3,
      y: 8
    }), // 3,8
    'x:3': move2({
      x: 3
    }), // 3,undefined
    '{}': move2({}), // undefined,undefined
    '': move2() // 0,0
  });
  log({
    '': JSON.stringify([1, undefined, 3].map((x = 'yes') => x))
  })
})();
/**
 * 不能带圆括号的情况:
 *   1.变量声明语句中，模式不能带有圆括号
 *   // 全部报错
 *   var [(a)] = [1];
 *   var { x: (c) } = {};
 *   var { o: ({ p: p }) } = { o: { p: 2 } };
 *
 *   2.函数参数中，模式不能带圆括号:
 *   函数参数也属于变量声明，因此不能带有圆括号。
 *   // 报错
 *   function f([(z)]) { return z; }
 *
 *   3.不能将整个模式，或嵌套模式中的一层，放在圆括号之中。
 *   // 全部报错
 *   ({ p: a }) = { p: 42 };
 *   ([a]) = [5];
 *   [({ p: a }), { x: c }] = [{}, {}];
 *
 * 可以使用圆括号的情况:
 *   赋值语句的非模式部分，可以使用圆括号。
 *   [(b)] = [3]; // 正确
 *   ({ p: (d) } = {}); // 正确
 *   [(parseInt.prop)] = [3]; // 正确
 */