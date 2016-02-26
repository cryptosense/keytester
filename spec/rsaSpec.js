var rsa = require('../rsa.js');
var bigInt = require('big-integer');

function replaceAt(s, index, character) {
    return s.substr(0, index) + character + s.substr(index+character.length);
}

describe('A RSA key', function() {
    var encodedKey;
    var key;

    beforeEach(function () {
        encodedKey = 'ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCiS1fpP2K9zRlKFN1YqWhUl1UIK7CDz2ytjrUa22HfPq5rR4KcVnGf5p2B4Xh0jGRplBstM4QlO6I4hOkmHy9T4CUIYNUOrnkNXhO0YmHD3+JU24yMjTKf5lCV1FQZlUptCAXVSkrOfrB3DpARlV1+O24vZ677lmoEVkiFb5r0k+RfvyLYt9Q5/rZ4/Qsy5q8zI/rcfjE1krC7PJrQx8WGTWMMcu5/LgLHR4uCjbysVXhVrakOLr4y9Awt4ckghH4G/O9kkhyNF8/lRbGs2lTdZWLsVCx3KvAGs70K1cDZfmYCEMxqA4mggMizRX9Es/tIJF5IiHMEpAQCmo5phXv7';
        key = rsa.parse(encodedKey);
    });

    it('can be parsed', function() {
        expect(key).not.toBeNull();
    });

    it('has a type', function() {
        expect(key.type).toEqual('ssh-rsa');
    });

    it('has a public exponent', function() {
        expect(key.e).toEqual(bigInt(65537));
    });

    it('has a modulus', function() {
        expect(key.n).toEqual(bigInt('20487758621154312767501012410039127048934369923061612489859946000774269065244624176248157064636062043041258757300154104495538199903759919947710351397244578277600255645465320960687104798810813368950551984470553999987207852677460716250270067487878939301038408349010291347643960248880834279230818112844772637519407759531165865155052805630071076937227473384396904239873631603914241623093858768723313386402816699425403765957816527339769321655849295918322070168985719515881615393147733409717060051213209994839882625318409677557008786214623851982398196266522211845690949365739286882287997118071376091252794651899625327655931'));
    });

    it('has no small factors', function() {
        expect(rsa.isDivisibleByASmallPrime(key.n, 10000)).toBe(false);
    });

    describe('when the middle is altered', function() {
        beforeEach(function () {
            encodedKey = replaceAt(encodedKey, 100, '1');
            key = rsa.parse(encodedKey);
        });

        it('is is divisible', function () {
            expect(rsa.isDivisibleByASmallPrime(key.n, 10000)).toBe(1091);
        });
    });
});

describe('An invalid key', function() {
    it('is not a valid key', function () {
        var key = rsa.parse('Something something');
        expect(key.error).toBe('This is not a RSA key');
    });
});