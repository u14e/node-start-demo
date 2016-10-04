var discription = require('../../lib/discription.js');
var expect = require('chai').expect;

suite('Discription cookie tests', function() {
    test('getDisc() should return a discription', function() {
        expect(typeof discription.getDisc() === 'string');
    });
});