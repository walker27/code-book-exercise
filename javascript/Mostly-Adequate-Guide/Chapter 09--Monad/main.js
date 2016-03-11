require('../support');
var _ = require('ramda');
var {concat} = _;
var {data:{Task}}=require('folktale');
function log(ifLog) {
    switch(this.constructor){
        case IO:
            console.log(this.unsafePerformIO());
            break;
        case Maybe:
        case Right:
            console.log(this.__value);
            break;
        case Task:
        default:
            break;
            // console.log(this.fork());
    }
}

function makeHr(ifShow, content) {
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
IO.prototype.log = log;
Maybe.prototype.log = log;
Task.prototype.log = log;
Right.prototype.log = log;
/*========== Pointy Functor Factory ==========*/

var logPFF = false;
makeHr(logPFF, 'Pointy Functor Factory');
IO.of("tetris").map(concat(" master")).log(logPFF);

Maybe.of(1336).map(add(1)).log(logPFF);

Task.of([{id: 2}, {id: 3}]).map(_.prop('id'));
// Task([2,3]);
Either.of("The past, present and future walk into a bar...").map(
  concat("it was tense.")
).log(logPFF);


/*========== Mixing Metaphors ==========*/

var logMM = false;
makeHr(logMM, 'Mixing Metaphors');

/*========== My chain hits my chest ==========*/
var logMCHMC = true;
makeHr(logMCHMC, 'My chain hits my chest');
