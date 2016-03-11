var makeHr = function(title){
  console.log('********** '+(title || "")+' **********');
}
var log = console.log;
Object.prototype.log = function(){
    console.log(this);
    return this;
}
module.exports={
    makeHr,log
}