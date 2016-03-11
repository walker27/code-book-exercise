'use strict';
var { makeHr,log } = require('./support');

// import {makeHr, log} from './support';
/*==================== 对象的扩展 ====================*/
/**
 *  1.属性的简洁表示法
 *  2.属性名表达式
 *  3.方法的name属性
 *  4.Object.is()
 *  5.Object.assign()
 *  6.属性的可枚举性
 *  7.属性的遍历
 *  8.__proto__属性，Object.setPrototypeOf()，Object.getPrototypeOf()
 *  9.Object.values()，Object.entries()
 * 10.对象的扩展运算符
 * 11.Object.getOwnPropertyDescriptors()
 */

makeHr('1.属性的简介表示法');

// ES6允许直接写入变量和函数，作为对象的属性和方法。这样的书写更加简洁。
(() => {
    var foo = 'bar';
    var baz = {foo};
    baz.log();

    function f(x, y) {
      return {x, y};
    }
    // 等同于
    // function f(x, y) {
    //   return {x: x, y: y};
    // }

    f(1, 2).log(); // Object {x: 1, y: 2}

    // 除了属性简写，方法也可以简写。

    var o = {
        method() {
            return "Hello!";
        }
    };
    // 等同于
    // var o = {
    //   method: function() {
    //     return "Hello!";
    //   }
    // };
    var birth = '2000/01/01';

    var Person = {
      name: '张三',
      //等同于birth: birth
      birth,
      // 等同于hello: function ()...
      hello() { console.log('我的名字是', this.name); }

    };

    // 注意，简洁写法的属性名总是字符串，这会导致一些看上去比较奇怪的结果。
    var obj = {
      class () {}
    };
    // 等同于
    // var obj = {
    //   'class': function() {}
    // };
    
    // 如果某个方法的值是一个Generator函数，前面需要加上星号。
    var obj = {
      * m(){
        yield 'hello world';
      }
    }
})();

makeHr('2.属性名表达式');

(() => {
    // ES6允许字面量定义对象时，用方法二（表达式）作为对象的属性名，即把表达式放在方括号内。

    let propKey = 'foo';
    let obj = {
      [propKey]: true,
      ['a' + 'bc']: 123
    };

    // 下面是另一个例子。
    var lastWord = 'last word';
    var a = {
      'first word': 'hello',
      [lastWord]: 'world'
    };

    a['first word'].log(); // "hello"
    a[lastWord].log(); // "world"
    a['last word'].log(); // "world"
    // 表达式还可以用于定义方法名。

    let obj2 = {
      ['h'+'ello']() {
        return 'hi';
      }
    }.log();

    obj2.hello(); // hi
    // 注意，属性名表达式与简洁表示法，不能同时使用，会报错。

    // 报错
    // var foo = 'bar';
    // var bar = 'abc';
    // var baz = { [foo] };

    // 正确
    var foo = 'bar';
    var baz = { [foo]: 'abc'};
})();

makeHr('3.方法的name属性');

(() => {
    // 函数的name属性，返回函数名。对象方法也是函数，因此也有name属性。

    var person = {
      sayName() {
        console.log(this.name);
      },
      get firstName() {
        return "Nicholas"
      }
    }

    person.sayName.name.log();   // "sayName"
    person.firstName.name; // "get firstName" 注:引擎不支持...
})();

