let _ = require('lodash/fp');

var users = [
  { 'user': 'barney',  'age': 36 },
  { 'user': 'fred',    'age': 40 },
  { 'user': 'pebbles', 'age': 1 }
];

//let youngest = _.pipe([_.head,_.map(o=>o.user+'is'+o.age),_.sortBy('age')]);
let youngest = _.pipe([_.sortBy('age'),_.map(o=>o.user+' is '+o.age),_.head]);

console.log(youngest(users));