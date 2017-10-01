'use strict';

const { createEachLimitWithKey } = require('./internal/collection');

Promise.mapValuesLimit = createEachLimitWithKey(() => ({}), createCallbackHandler);

function createCallbackHandler(rest, resolve, iterate, result, collection, keys) {
  return keys === undefined ?
    function createCallback(index) {
      return res => {
        result[index] = res;
        return --rest === 0 ? resolve(result) : iterate();
      };
    } :
    function createCallback(index) {
      return res => {
        result[keys[index]] = res;
        return --rest === 0 ? resolve(result) : iterate();
      };
    };
}