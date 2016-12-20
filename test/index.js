'use strict';

let assert = require('assert');
// var diabot = require('../lib');
let functions = require("../lib/functions.js");



describe('fixture', () => {
  it('can convert mmol/L to mg/dL', () => {
    let input = 5.5;
    let expected = 99.1;
    let actual = functions.convertToMgdl(input);
    assert.equal(actual, expected);
  });
});
