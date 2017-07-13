var User = require('../models/User');

module.exports = {

//parser is the parse that is helper function : update function

/*
  test case 1: (passed)
var update1 = [{schema : "name", value : "sen zheng"}, {schema : "age", value : 20}];
var model1 = {name: "wei wu", age : 18

test case 2:(passed)  the desired value should be { name: 'sen zheng', age: 20 }
var model2 = {name: "wei wu", age : null}
*/
parser: function (update,model){
   //update structure is [{schema: value1 , value : value2}]
   
   for(var i = 0; i < update.length; i++){
    var item = update[i].schema;
    model[item] = update[i].value;
 }

   return model;

},





}