function decodeBase64(s) {
    var e={},i,b=0,c,x,l=0,a,r='',w=String.fromCharCode,L=s.length;
    var A="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for(i=0;i<64;i++){e[A.charAt(i)]=i;}
    for(x=0;x<L;x++){
        c=e[s.charAt(x)];b=(b<<6)+c;l+=6;
        while(l>=8){((a=(b>>>(l-=8))&0xff)||(x<(L-2)))&&(r+=w(a));}
    }
    return r;
};

function readLen(buf) {
    var i = 0;
    var b0 = buf.charCodeAt(0)
    var b1 = buf.charCodeAt(1)
    var b2 = buf.charCodeAt(2)
    var b3 = buf.charCodeAt(3)
    var len = (b0 << 24) | (b1 << 16) | (b2 << 8) | b3;
    return len;
}

function parseBigInt(str) {
    var n = bigInt();
    var i;
    for(i = 0; i < str.length ; i++) {
        n = n.times(256).plus(str.charCodeAt(i));
    }
    return n;
}

function parse(key) {
    var parts = key.split(' ');
    var keyType = parts[0];
    if (keyType !== 'ssh-rsa') {
        return {'error': 'This is not a RSA key'}
    }
    var blob = parts[1];
    var buf = decodeBase64(blob);
    var len1 = readLen(buf);
    var v1 = buf.substr(4, len1);
    buf = buf.substr(4 + len1);
    var len2 = readLen(buf);
    var v2 = buf.substr(4, len2);
    buf = buf.substr(4 + len2);
    var len3 = readLen(buf); var v3 = buf.substr(4, len3);
    buf = buf.substr(4 + len3);
    return { 'type': v1, 'e': parseBigInt(v2), 'n': parseBigInt(v3) }
}

var eratosthenes = function(n) {
    var array = [], upperLimit = Math.sqrt(n), output = [];

    for (var i = 0; i < n; i++) {
        array.push(true);
    }

    for (var i = 2; i <= upperLimit; i++) {
        if (array[i]) {
            for (var j = i * i; j < n; j += i) {
                array[j] = false;
            }
        }
    }
    
    for (var i = 2; i < n; i++) {
        if(array[i]) {
            output.push(i);
        }
    }

    return output;
}

function isDivisibleByASmallPrime(n, maxPrime) {
    var primes = eratosthenes(maxPrime);
    for (var i = 0; i < primes.length; i ++) {
        var prime = primes[i];
        if (n.isDivisibleBy(prime)) {
            return prime;
        }
    }
    return false;
}
