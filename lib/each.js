'use strict';

const { errorObj, call3 } = require('./internal/util');

Promise.prototype.each = protoEach;
Promise.prototype.forEach = protoEach;

Promise.each = each;
Promise.forEach = each;

function protoEach(iterator) {
  return this.then(collection => each(collection, iterator));
}

function each(collection, iterator) {
  if (Array.isArray(collection)) {
    return arrayEach(collection, iterator);
  }
  if (collection && typeof collection === 'object') {
    return objectEach(collection, iterator);
  }
  return Promise.resolve();
}

function arrayEach(array, iterator) {
  const l = array.length;
  if (l === 0) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    let i = -1;
    let rest = l;
    while (++i < l) {
      const promise = call3(iterator, array[i], i, array);
      if (promise === errorObj) {
        return reject(errorObj.e);
      }
      promise && promise.then ? promise.then(done, reject) : done();
    }
    function done() {
      --rest === 0 && resolve();
    }
  });
}

function objectEach(object, iterator) {
  const keys = Object.keys(object);
  const l = keys.length;
  if (l === 0) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    let i = -1;
    let rest = l;
    while (++i < l) {
      const key = keys[i];
      const promise = call3(iterator, object[key], key, object);
      if (promise === errorObj) {
        return reject(errorObj.e);
      }
      promise && promise.then ? promise.then(done, reject) : done();
    }
    function done() {
      --rest === 0 && resolve();
    }
  });
}