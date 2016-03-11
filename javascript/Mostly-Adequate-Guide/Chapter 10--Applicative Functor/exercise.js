require('../support');
var {
    data: {
        Task
    }
} = require('folktale');
var _ = require('ramda');

// 模拟浏览器的 localStorage 对象
var localStorage = {};



// 练习 1
// ==========
// 写一个函数，使用 Maybe 和 ap() 实现让两个可能是 null 的数值相加。

//  ex1 :: Number -> Number -> Maybe Number
var ex1 = function(x, y) {
    return Maybe.of(_.add).ap(Maybe.of(x)).ap(Maybe.of(y));
    // return Maybe.of(_.add(x)).ap(Maybe.of(y));
};
// console.log(ex1(1,2));


// 练习 2
// ==========
// 写一个函数，接收两个 Maybe 为参数，让它们相加。使用 liftA2 代替 ap()。

//  ex2 :: Maybe Number -> Maybe Number -> Maybe Number

var ex2 = liftA2(_.add);
// console.log(ex2(Maybe.of(3),Maybe.of(2)));


// 练习 3
// ==========
// 运行 getPost(n) 和 getComments(n)，两者都运行完毕后执行渲染页面的操作。（参数 n 可以是任意值）。

var makeComments = _.reduce(function(acc, c) {
    return acc + "<li>" + c + "</li>"
}, "");
var render = _.curry(function(p, cs) {
    return "<div>" + p.title + "</div>" + makeComments(cs);
});

//  ex3 :: Task Error HTML

function getPost(i) {
  return new Task(function (rej, res) {
    setTimeout(function () { res({ id: i, title: 'Love them futures' }); }, 300);
  });
}

function getComments(i) {
  return new Task(function (rej, res) {
    setTimeout(function () {
      res(["This book should be illegal", "Monads are like space burritos"]);
    }, 300);
  });
}
var ex3 = Task.of(render).ap(getPost(2)).ap(getComments(2));
ex3.fork(function(obj) {
    console.log('rej:', obj)
}, function(obj) {
    console.log('res:', obj)
});


// 练习 4
// ==========
// 写一个 IO，从缓存中读取 player1 和 player2，然后开始游戏。

localStorage.player1 = "toby";
localStorage.player2 = "sally";

var getCache = function(x) {
  return new IO(function() { return localStorage[x]; });
}
var game = _.curry(function(p1, p2) { return p1 + ' vs ' + p2; });

//  ex4 :: IO String
var ex4 = liftA2(game,getCache('player1'),getCache('player2'));
console.log(ex4.unsafePerformIO());

