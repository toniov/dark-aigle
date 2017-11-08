'use strict';

require('..');

const assert = require('assert');

const parallel = require('mocha.parallel');

const { DELAY } = require('../config');

parallel('mapValues', () => {

  it('should execute in parallel', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value * 2);
      }, DELAY * value));
    };
    const res = await Promise.mapValues(collection, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepEqual(res, {
      '0': 2,
      '1': 8,
      '2': 4
    });
    assert.deepEqual(order, [
      [0, 1],
      [2, 2],
      [1, 4]
    ]);
  });

  it('should execute with object collection in parallel', async () => {

    const order = [];
    const collection = {
      task1: 1,
      task2: 4,
      task3: 2
    };
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value * 2);
      }, DELAY * value));
    };
    const res = await Promise.mapValues(collection, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepEqual(res, {
      task1: 2,
      task2: 8,
      task3: 4
    });
    assert.deepEqual(order, [
      ['task1', 1],
      ['task3', 2],
      ['task2', 4]
    ]);
  });

  it('should return an empty object if collection is an empty array', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.mapValues([], iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepEqual(res, {});
  });

  it('should return an empty ojbect if collection is an empty object', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.mapValues({}, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepEqual(res, {});
  });

  it('should return an empty object if collection is string', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.mapValues('test', iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Object]');
    assert.deepEqual(res, {});
  });

  it('should throw TypeError', async () => {

    const collection = [1, 4, 2];
    const iterator = value => {
      value.test();
    };
    try {
      await Promise.mapValues(collection, iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});

parallel('#mapValues', () => {

  it('should execute in parallel', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value * 2);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).mapValues(iterator);
    assert.deepEqual(res, {
      '0': 2,
      '1': 8,
      '2': 4
    });
    assert.deepEqual(order, [
      [0, 1],
      [2, 2],
      [1, 4]
    ]);
  });

  it('should execute with object collection in parallel', async () => {
    const order = [];
    const collection = {
      task1: 1,
      task2: 4,
      task3: 2
    };
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value * 2);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).mapValues(iterator);
    assert.deepEqual(res, {
      task1: 2,
      task2: 8,
      task3: 4
    });
    assert.deepEqual(order, [
      ['task1', 1],
      ['task3', 2],
      ['task2', 4]
    ]);
  });

  it('should execute with delay', async () => {

    const order = [];
    const collection = [1, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value * 2);
      }, DELAY * value));
    };
    const res = await Promise.delay(DELAY, collection).mapValues(iterator);
    assert.deepEqual(res, {
      '0': 2,
      '1': 8,
      '2': 4
    });
    assert.deepEqual(order, [
      [0, 1],
      [2, 2],
      [1, 4]
    ]);
  });

  it('should throw TypeError', async () => {

    const collection = [1, 4, 2];
    const iterator = value => {
      value.test();
    };
    try {
      await Promise.resolve(collection).mapValues(iterator);
      assert.fail();
    } catch (e) {
      assert.ok(e instanceof TypeError);
    }
  });
});

