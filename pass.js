const bcryptjs = require('bcryptjs');
const saltRounds = 10;
const salt = bcryptjs.genSaltSync(saltRounds);
 
console.log(`Salt => ${salt}`);
 
const hash1 = bcryptjs.hashSync("Hello", salt);
const hash2 = bcryptjs.hashSync("onomatopoeia", salt);

console.log(hash1);
console.log(hash2);