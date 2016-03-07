rsa = require('./rsa.js');
var encoded = process.argv[2];
var k = rsa.parse(encoded);
console.log(rsa.isDivisibleByASmallPrime(k.n, 1000000));
