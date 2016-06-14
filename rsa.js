var bigInt = require('big-integer');
var sieveOfErathosthenes = require('sieve-of-eratosthenes');

function parseBigInt(buf) {
    var n = bigInt();
    var i;
    for(i = 0; i < buf.length ; i++) {
        n = n.times(256).plus(buf[i]);
    }
    return n;
}

function parseError(message) {
  var err = new Error(message);
  err.name = 'ParseError';
  throw err;
}

function sanitize(key) {
  return key.replace(new RegExp('\n|\r', 'g'), '');
}

function parseWithErrors(input) {
    var key = sanitize(input);
    if (! key.startsWith('ssh-')) {
        parseError('This does not look like a public SSH key.');
    }
    var parts = key.split(' ');
    var keyType = parts[0];
    if (keyType !== 'ssh-rsa') {
        parseError('This test is only meaningful for RSA keys.');
    }
    var blob = parts[1];
    var buf = new Buffer(blob, 'base64');
    var len1 = buf.readInt32BE(0);
    var off1 = 4 + len1;
    var v1 = buf.slice(4, off1);
    var len2 = buf.readInt32BE(off1);
    var off2 = off1 + 4 + len2;
    var v2 = buf.slice(off1 + 4, off2);
    var len3 = buf.readInt32BE(off2);
    var v3 = buf.slice(off2 + 4, off2 + 4 + len3);
    return { 'type': v1.toString(), 'e': parseBigInt(v2), 'n': parseBigInt(v3), 'error': null };
}

function parse(key) {
  try {
    return parseWithErrors(key);
  } catch (err) {
    var message;
    if (err.name == 'ParseError') {
      message = err.message;
    } else {
      message = 'Invalid SSH RSA public key.';
    }
    return { 'error': message };
  }
}

function isDivisibleByASmallPrime(n, maxPrime) {
    var primes = sieveOfErathosthenes(maxPrime);
    for (var i = 0; i < primes.length; i ++) {
        var prime = primes[i];
        if (n.isDivisibleBy(prime)) {
            return prime;
        }
    }
    return false;
}

module.exports = {
    sanitize: sanitize,
    parse: parse,
    isDivisibleByASmallPrime: isDivisibleByASmallPrime
};
