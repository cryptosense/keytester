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

function isValidBase64(blob) {
  var regexp = new RegExp("^[A-Za-z0-9/+]+={0,2}$");
  return regexp.test(blob);
}

function validateBlob(blob) {
  if (! isValidBase64(blob)) {
    parseError('Invalid Base64 key blob.');
  }
}

function validateValue(val, len) {
  if (val.length != len) {
    parseError(
        'The key doesn\'t parse properly. ' +
        'The key blob might have been truncated, try to copy/paste it again.'
        );
  }
}

function parseWithErrors(input) {
    var key = sanitize(input);
    var parts = key.split(' ');
    var keyType = parts[0];
    if (! key.startsWith('ssh-') || parts.length < 2) {
        parseError('This does not look like a public SSH key.');
    }
    if (keyType !== 'ssh-rsa') {
        parseError('This test is only meaningful for RSA keys.');
    }
    var blob = parts[1];
    validateBlob(blob);
    var buf = new Buffer(blob, 'base64');
    var len1 = buf.readInt32BE(0);
    var off1 = 4 + len1;
    var v1 = buf.slice(4, off1);
    validateValue(v1, len1);
    var len2 = buf.readInt32BE(off1);
    var off2 = off1 + 4 + len2;
    var v2 = buf.slice(off1 + 4, off2);
    validateValue(v2, len2);
    var len3 = buf.readInt32BE(off2);
    var v3 = buf.slice(off2 + 4, off2 + 4 + len3);
    validateValue(v3, len3);
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
    isValidBase64: isValidBase64,
    parse: parse,
    isDivisibleByASmallPrime: isDivisibleByASmallPrime
};
