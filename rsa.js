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

function parse(key) {
    if (! key.startsWith('ssh-')) {
        return {'error': 'This does not look like a public SSH key.'};
    }
    var parts = key.split(' ');
    var keyType = parts[0];
    if (keyType !== 'ssh-rsa') {
        return {'error': 'This test is only meaningful for RSA keys.'};
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
    parse: parse,
    isDivisibleByASmallPrime: isDivisibleByASmallPrime
};
