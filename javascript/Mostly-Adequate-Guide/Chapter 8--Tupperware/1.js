function makeHr(content) {
  console.log('==========' + (content || '') + '==========');
}
var _ = {
  prop: function(x) {
    return function(obj) {
      return obj[x];
    }
  }
}

function match(reg) {
  return function(x) {
    return x.match(reg);
  }
}

function concat(y) {
  return function(x) {
    return x + y;
  }
}

function add(num) {
  return function(x) {
    return x + num;
  }
}


function curry(f) {
  var temp = null;
  var args = [];
  var len = f.length;
  temp = function() {
    // args.push(arguments[0]);
    // console.log('array:',Array.prototype.slice.call(arguments));
    var args = Array.prototype.slice.call(arguments)
    if (args.length >= len) {
      // console.log('going to execute', args);
      return f.apply(null, args);
    } else {
      return function() {

        return temp.apply(null, args.concat(Array.prototype.slice.call(arguments)));
      };
    }
  }
  return temp;
}

function compose() {
  // 第一次见slice还能用于"拟数组"对象
  var arg = Array.prototype.slice.call(arguments);
  // console.log('arg:',arg);
  // console.log('slice:',Array.prototype.slice);
  return function(x) {
    // console.log('temp',temp);
    return arg.reduceRight(function(result, ele) {
      return ele(result)
    }, x);
  }
}

/*========== 以上为所需要不相关方法 ==========*/



var Container = function(x) {
  this.__value = x;
}

Container.of = function(x) {
  return new Container(x)
};


// console.log(Container.of(3));
// console.log(Container.of(Container.of({
//   name: "yoda"
// })));

// 第一个functor

Container.prototype.map = function(f) {
  return Container.of(f(this.__value));
}
Container.prototype.log = function(title) {
  console.log((title ? title + ':' : ''), this);
}

Container.of(2).map(function(two) {
  return two + 2;
}).log();

Container.of('falmethrowers').map(function(s) {
  return s.toUpperCase();
}).log();


Container.of('bombs').map(concat(' away')).map(_.prop('length')).log();



makeHr();

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
Maybe.prototype.log = function(title) {
  console.log((title ? title + ':' : ''), this);
}

Maybe.of('Malkovich Malkovich').map(match(/a/ig)).log('Malkovich Malkovich');

Maybe.of(null).map(match(/a/ig)).log('null');

Maybe.of({
  name: 'Boris'
}).map(_.prop('age')).map(add(10)).log('Boris');

Maybe.of({
  name: 'Boris',
  age: 14
}).map(_.prop('age')).map(add(10)).log('age is 14');

makeHr();



function map(f) {
  return function(x) {
    return x.map(f);
  }
}

var safeHead = function(xs) {
  return Maybe.of(xs[0]);
}

var streetName = compose(map(_.prop('street')), safeHead, _.prop('addresses'));

streetName({
  addresses: []
}).log();
streetName({
  addresses: [{
    street: 'Shady Ln.',
    number: 4201
  }]
}).log();


makeHr();

var withdraw = curry(function(amout, account) {
  // console.log('withdraw:', arguments);
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

makeHr();

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

makeHr('"纯"错误处理');

var Left = funciton(x) {
  this.__value = x
};

Left.of = function(x) {
  return new Left(x);
};

Left.prototype.map = function(f){
  // return Left.of(f(this.__value));
  return this;
}

var Right = function(x){
  this.__value = x;
}

Right.of = function(x){
  return new Right(x);
}

Right.prototype.map = function(f){
  return Right.of(f(this.__value));
}