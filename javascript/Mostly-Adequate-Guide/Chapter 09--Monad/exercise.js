require('../support');
var _ = require('ramda');
var {
    data: {
        Task
    }
} = require('folktale');
var path = require('path');
// 练习 1
// ==========
// 给定一个 user，使用 safeProp 和 map/join 或 chain 安全地获取 sreet 的 name

var safeProp = _.curry(function(x, o) {
    return Maybe.of(o[x]);
});
var user = {
    id: 2,
    name: "albert",
    address: {
        street: {
            number: 22,
            name: 'Walnut St'
        }
    }
};

var ex1 = _.compose(chain(safeProp('name')), chain(safeProp('street')), safeProp('address'));
// console.log(ex1(user));


// 练习 2
// ==========
// 使用 getFile 获取文件名并删除目录，所以返回值仅仅是文件，然后以纯的方式打印文件

var getFile = function() {
    return new IO(function() {
        return __filename;
    });
}

var pureLog = function(x) {
    return new IO(function() {
        console.log(x);
        return 'logged ' + x;
    });
}

var ex2 = _.compose(chain(_.compose(pureLog, _.last, split(path.sep))), getFile);

ex2().unsafePerformIO();

// 练习 3
// ==========
// 使用 getPost() 然后以 post 的 id 调用 getComments()
var getPost = function(i) {
    return new Task(function(rej, res) {
        setTimeout(function() {
            res({
                id: i,
                title: 'Love them tasks'
            });
        }, 300);
    });
}

var getComments = function(i) {
    return new Task(function(rej, res) {
        setTimeout(function() {
            res([{
                post_id: i,
                body: "This book should be illegal"
            }, {
                post_id: i,
                body: "Monads are like smelly shallots"
            }]);
        }, 300);
    });
}


var ex3 = _.compose(chain(_.compose(getComments, _.prop('id'))), getPost);
// ex3(1).fork(function(obj) {
//     console.log('rej:', obj)
// }, function(obj) {
//     console.log('res:', obj)
// });


// 练习 4
// ==========
// 用 validateEmail、addToMailingList 和 emailBlast 实现 ex4 的类型签名

//  addToMailingList :: Email -> IO([Email])
var addToMailingList = (function(list){
  return function(email) {
    return new IO(function(){
      list.push(email);
      return list;
    });
  }
})([]);

function emailBlast(list) {
  return new IO(function(){
    return 'emailed: ' + list.join(',');
  });
}

var validateEmail = function(x){
  return x.match(/\S+@\S+\.\S+/) ? (new Right(x)) : (new Left('invalid email'));
}

//  ex4 :: Email -> Either String (IO String)
// var ex4 = _.compose(chain(_.compose(chain(emailBlast),addToMailingList)),validateEmail);
var ex4 = _.compose(_.map(_.compose(chain(emailBlast), addToMailingList)), validateEmail);
// console.log(ex4('www.baidu.com'));
// console.log(ex4('haha@hotmail.com'));