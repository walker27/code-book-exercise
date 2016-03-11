'use strict';
/********************** LET **********************/

/**
 * let命令
 * 1.块级作用域
 * 2.现在babel只能简单地将let转为var 不能变相实现块级作用域，所以暂不适合使用let
 * 3.不存在变量提升
 * 4.在同一个块级作用域中不允许重复声明变量
 * 5.在代码块内，使用let命令声明变量之前，该变量都是不可用的,
 *   这在语法上，称为“暂时性死区”(temporal dead zone，简称TDZ).
 * 6.let声明的变量不属于全局对象的属性
 */
(function() {
  // console.log(foo); // ReferenceError
  let foo = 5;

  /* 使用let后不再需要使用闭包来锁住变量 */
  let arr = [];
  let arr2 = [];
  var j = 0;
  for (let i = 0; i < 5; i++, j++) {
    arr[i] = function() {
      console.log('i:', i)
    };
    arr2[j] = function() {
      console.log('j:', j)
    };
  }

  arr.forEach(function(ele, index) {
    ele();
  })
  arr2.forEach(function(ele, index) {
      ele();
    })
    //console.log(i);// ReferenceError
})();

// 在同一个块级作用域中不允许重复声明变量
{
  let a = 1;
  // let a=2; // SyntaxError
  {
    /* TDZ */
    //console.log('a:',a); // ReferenceError: a is not defined
    let a = 3;
    console.log('a:', a); //3
  }
  console.log('a:', a); //1
}

/*********** 块级作用域 ***********/
//可以代替立即执行匿名函数(IIFE)
//现在babel不能将这种写法转化为IIFE，所以暂时不能在生产环境使用
{
  let a = 3;
  console.log(a);
}

/********************** CONST **********************/
//ES6中 作用域为块级作用域
{
  //类似于C语言中的const，此处的const只是保证了foo"指针"的值无法被改变
  //若要实现冻结对象 使用Object.freeze方法
  //const foo = Object.freeze({});
  const foo = {};
  foo.prop = 123;

  console.log(foo.prop); //123
}
/* 跨模块常量 */
// export const A = 1;
// test1.js 模块"--harmony",
// import * as constants from './constants';
// console.log(constants.A); // 1
// console.log(constants.B); // 3

// test2.js 模块
// import {A, B} from './constants';
// console.log(A); // 1
// console.log(B); // 3
// 