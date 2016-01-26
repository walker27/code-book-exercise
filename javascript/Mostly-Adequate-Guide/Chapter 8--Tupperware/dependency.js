var dependency = {};
(function() {
  var self = this;
  self.test = function() {
    console.log('run success');
  };
  self.makeHr = function(ifShow, content) {
    if (typeof ifShow == 'string') {
      content = ifShow;
      ifShow = true;
    } else if (typeof ifShow == 'undefined') {
      ifShow = true;
    }
    if (ifShow) {
      console.log('==========' + (content || '') + '==========');
    }
  }


  self.match = function(reg) {
    return function(x) {
      return x.match(reg);
    }
  }

  self.concat = function(x) {
    return function(y) {
      return x + y;
    }
  }

  self.concatLeft = function(y) {
    return function(x) {
      return x + y;
    }
  }

  self.map = function(f) {
    return function(x) {
      return x.map(f);
    }
  }



  self.add = function(num) {
    return function(x) {
      return x + num;
    }
  }


  self.curry = function(f) {
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

  self.compose = function() {
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

  self.log = function(line, title) {
    if (typeof line != 'number') {
      title = line;
      line = -1;
    }
    if (this.ifShowLog) {
      console.log((line != -1 ? 'line:' + line : '') + (title ? title + ':' : ''), this);
    }
    return this;
  };

  self.id = function(x) {
    return x;
  };
  self._ = {
    prop: function(x) {
      return function(obj) {
        return obj[x];
      }
    },
    compose:self.compose
  };
  self.split = function(char){
    return function(str){
      return str.split(char);
    }
  }
}.bind(dependency))();

module.exports = dependency;