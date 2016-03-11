'use strict';
var {
  matches: match,
  last,
  head,
} = require('lodash');
var moment = require('moment');
var {
  map, makeHr, log, concatLeft, _, add, compose, id, curry, concat, split, filter, eq
} = require('./dependency.js');
// var test = require('lodash');
/*==================== 以上为所需要不相关方法 ====================*/


/*========== ==========*/
var Container = function(x) {
  this.__value = x;
}

Container.of = function(x) {
  return new Container(x)
};



// 第一个functor

Container.prototype.map = function(f) {
  return Container.of(f(this.__value));
}

Container.prototype.ifShowLog = false;
Container.prototype.log = log;
Container.prototype.makeHr = makeHr;

makeHr(Container.prototype.ifShowLog, 'Container');

Container.of(2).map(function(two) {
  return two + 2;
}).log();

Container.of('falmethrowers').map(function(s) {
  return s.toUpperCase();
}).log();


Container.of('bombs').map(concatLeft(' away')).map(_.prop('length')).log();



/*========== 薛定谔的 Maybe ==========*/

var Maybe = function(x) {
  this.__value = x;
}

Maybe.of = function(x) {
  return new Maybe(x);
}

Maybe.prototype.isNothing = function() {
  return (this.__value === null || this.__value === undefined);
}

Maybe.prototype.map = function(f) {
  var res = this.isNothing() ? Maybe.of(null) : Maybe.of(f(this.__value));
  return res;
}

Maybe.prototype.ifShowLog = false;
Maybe.prototype.log = log;

makeHr(Maybe.prototype.ifShowLog, '薛定谔的 Maybe');

Maybe.of('Malkovich Malkovich').map(match(/a/ig)).log('Malkovich Malkovich');

Maybe.of(null).map(match(/a/ig)).log('null');

Maybe.of({
  name: 'Boris'
}).map(_.prop('age')).map(add(10)).log('Boris');

Maybe.of({
  name: 'Boris',
  age: 14
}).map(_.prop('age')).map(add(10)).log('age is 14');

makeHr(Maybe.prototype.ifShowLog);



var safeHead = function(xs) {
  return Maybe.of(xs[0]);
}

var streetName = compose(map(_.prop('street')), safeHead, _.prop('addresses'));
console.log(map(_.prop('street')));
streetName({
  addresses: []
}).log();
streetName({
  addresses: [{
    street: 'Shady Ln.',
    number: 4201
  }]
}).log(105);


makeHr(Maybe.prototype.ifShowLog);

var withdraw = curry(function(amout, account) {
  return account.balance >= amout ? Maybe.of({
    balance: account.balance - amout
  }) : Maybe.of(null);
});

var updateLedger = function(x) {
  return x.balance;
}

var remainingBalance = function(money) {
  return 'Your balance is $' + money;
}

var finishTransaction = compose(remainingBalance, updateLedger);
var getTwenty = compose(map(finishTransaction), withdraw(20));
getTwenty({
  balance: 200.00
}).log();

getTwenty({
  balance: 10.00
}).log();

getTwenty({
  balance: 20.00
}).log();

makeHr(Maybe.prototype.ifShowLog);

var maybe = curry(function(x, f, m) {
  return m.isNothing() ? x : f(m.__value);
});

var getTwenty = compose(maybe('You\'re broke!', finishTransaction), withdraw(20));
Maybe.of(getTwenty({
  balance: 200.00
})).log();

Maybe.of(getTwenty({
  balance: 10.00
})).log();

/*========== "纯"错误处理 ==========*/

var Left = function(x) {
  this.__value = x
};

Left.of = function(x) {
  return new Left(x);
};

Left.prototype.map = function(f) {
  // return Left.of(f(this.__value));
  return this;
}
Left.prototype.ifShowLog = false;
Left.prototype.log = log;

var Right = function(x) {
  this.__value = x;
}

Right.of = function(x) {
  return new Right(x);
}

Right.prototype.map = function(f) {
  return Right.of(f(this.__value));
}
Right.prototype.ifShowLog = false;
Right.prototype.log = log;

makeHr(Right.prototype.ifShowLog, '"纯"错误处理');

Right.of("rain").map(function(str) {
  return "b" + str;
}).log();

Left.of('rain').map(function(str) {
  return 'b' + str;
}).log();


var getAge = curry(function(now, user) {
  var birthdate = moment(user.birthdate, 'YYYY-MM-DD');
  if (!birthdate.isValid())
    return Left.of('Birth date could not be parsed').log();
  return Right.of(now.diff(birthdate, 'years')).log();
})
getAge(moment(), {
  birthdate: '2005-12-12'
});
getAge(moment(), {
  birthdate: 'xxxx'
});


var fortune = compose(concat('If you survive, you will be '), add(1));
var zoltar = compose(map(fortune), getAge(moment()));

zoltar({
  birthdate: '2000-12-12'
}).log();


var either = curry(function(f, g, e) {
  switch (e.constructor) {
    case Left:
      return f(e.__value);
    case Right:
      return g(e.__value);
  }
});

var zoltar = compose(either(id, fortune), getAge(moment()));

zoltar({
  birthdate: '2001-12-01'
});

zoltar({
  birthdate: 'ballons'
});


/*========== Old McDonald had Effects... ==========*/

var IO = function(f) {
  this._unsafePerformIO = f;
}

IO.of = function(x) {
  return new IO(function() {
    return x;
  })
}

IO.prototype.map = function(f) {
  return new IO(_.compose(f, this._unsafePerformIO));
}
IO.prototype.ifShowLog = true;
IO.prototype.log = function() {
  console.log(this._unsafePerformIO());
  return this;
};

makeHr(IO.prototype.ifShowLog, 'Old McDonald had Effects...');

var simWindow = {
  innerWidth: 1430,
  location: {
    href: 'http://localhost:8800/blog/posts?a=b&searchTerm=wafflehouse&c=d'
  }
};
var io_window = new IO(function() {
  return simWindow
});

io_window.map(function(win) {
  return win.innerWidth
});

io_window.map(_.prop('location')).map(_.prop('href')).map(split('/')).log();

// var $ = function(selector){
//   return new IO(function(){
//     return document.querySelectorAll(selector);
//   })
// }

// $('#myDiv').map(safeHead).map(function(div){
//   return div.innerHTML;
// });
/* 示例 */
////// 纯代码库: lib/params.js //////
// url :: IO String
var url = new IO(function() {
  return simWindow.location.href;
});

// toPairs = String -> [[String]]
var toPairs = compose(map(split('=')), split('&'));

// params :: String -> [[String]]
var params = compose(toPairs, last, split('?'));

// findParams :: String -> IO Maybe [String]
var findParams = function(key) {
  return map(compose(Maybe.of, filter(compose(eq(key), head)), params), url);
};

////// 非纯调用代码: main.js //////

// 调用 __value()  来运行它
// console.log(findParams('searchTerm'));
findParams('searchTerm')._unsafePerformIO().log();
// Mabye(['searchTerm','wafflehouse']);


/*========== Asynchronous Tasks ==========*/
var fs = require('fs');
/* 这个库看不懂，好像很难用，下面相关代码可能不能直接得到注释中的结果 */
var folktale = require('folktale');
var Task = folktale.data.Task;
console.log(folktale);
console.log(Task);
// readFile :: String -> Task(Error, JSON)
var readFile = function(filename) {
  return new Task(function(reject, result) {
    fs.readFile(filename, 'utf-8', function(err, data) {
      err ? reject(err) : result(data);
    })
  })
}

readFile('metamorphosis').map(split('\n')).map(head);
// Task("One morning, as Gregor Samsa was waking up from anxious dreams, he discovered that
// in bed he had been changed into a monstrous verminous bug.")
Task.of(3).map(function(three) {
  return three + 1;
});
// Task(4)
