'use strict';

require('..');

const assert = require('assert');

const _ = require('lodash');
const parallel = require('mocha.parallel');

const { DELAY } = require('../config');

parallel('mapLimit', () => {

  it('should execute', async () => {

    const order = [];
    const collection = [1, 5, 3, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value * 2);
      }, DELAY * value));
    };
    const res = await Promise.mapLimit(collection, 2, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.deepStrictEqual(res, [2, 10, 6, 8, 4]);
    assert.deepStrictEqual(order, [
      [0, 1],
      [2, 3],
      [1, 5],
      [4, 2],
      [3, 4]
    ]);
  });

  it('should execute with object collection', async () => {
    const order = [];
    const collection = {
      task1: 1,
      task2: 5,
      task3: 3,
      task4: 4,
      task5: 2
    };
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value * 2);
      }, DELAY * value));
    };
    const res = await Promise.mapLimit(collection, 2, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.deepStrictEqual(res, [2, 10, 6, 8, 4]);
    assert.deepStrictEqual(order, [
      ['task1', 1],
      ['task3', 3],
      ['task2', 5],
      ['task5', 2],
      ['task4', 4]
    ]);
  });

  it('should execute with default concurrency which is 8', async () => {

    const collection = _.times(10);
    const order = [];
    const iterator = value => {
      order.push(value);
      return new Promise(_.noop);
    };
    Promise.mapLimit(collection, iterator);
    await Promise.delay(DELAY);
    assert.deepStrictEqual(order, _.times(8));
  });

  it('should return an empty array if collection is an empty array', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.mapLimit([], iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.strictEqual(res.length, 0);
  });

  it('should return an empty array if collection is an empty object', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.mapLimit({}, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.strictEqual(res.length, 0);
  });

  it('should return an empty array if collection is string', async () => {

    const iterator = value => {
      value.test();
    };
    const res = await Promise.mapLimit('test', iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.strictEqual(res.length, 0);
  });

  it('should stop execution if error is caused', async () => {

    const order = [];
    const error = new Error('error');
    const collection = [1, 5, 3, 4, 2];
    const iterator = (value, key) => {
      return new Promise((resolve, reject) => setTimeout(() => {
        order.push([key, value]);
        value === 3 ? reject(error) : resolve(value);
      }, DELAY * value));
    };
    try {
      await Promise.mapLimit(collection, 2, iterator);
      assert.fail();
    } catch (e) {
      assert.strictEqual(e, error);
    }
    await Promise.delay(DELAY * 5);
    assert.deepStrictEqual(order, [
      [0, 1],
      [2, 3],
      [1, 5]
    ]);
  });

  it('should stop execution if error is caused', async () => {

    const order = [];
    const error = new Error('error');
    const collection = {
      task1: 1,
      task2: 5,
      task3: 3,
      task4: 4,
      task5: 2
    };
    const iterator = (value, key) => {
      return new Promise((resolve, reject) => setTimeout(() => {
        order.push([key, value]);
        value === 3 ? reject(error) : resolve(value);
      }, DELAY * value));
    };
    try {
      await Promise.mapLimit(collection, 2, iterator);
      assert.fail();
    } catch (e) {
      assert.strictEqual(e, error);
    }
    await Promise.delay(DELAY * 5);
    assert.deepStrictEqual(order, [
      ['task1', 1],
      ['task3', 3],
      ['task2', 5]
    ]);
  });
});

parallel('#mapLimit', () => {

  it('should execute', async () => {

    const order = [];
    const collection = [1, 5, 3, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value * 2);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).mapLimit(2, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.deepStrictEqual(res, [2, 10, 6, 8, 4]);
    assert.deepStrictEqual(order, [
      [0, 1],
      [2, 3],
      [1, 5],
      [4, 2],
      [3, 4]
    ]);
  });

  it('should execute with object collection', async () => {
    const order = [];
    const collection = {
      task1: 1,
      task2: 5,
      task3: 3,
      task4: 4,
      task5: 2
    };
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value * 2);
      }, DELAY * value));
    };
    const res = await Promise.resolve(collection).mapLimit(2, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.deepStrictEqual(res, [2, 10, 6, 8, 4]);
    assert.deepStrictEqual(order, [
      ['task1', 1],
      ['task3', 3],
      ['task2', 5],
      ['task5', 2],
      ['task4', 4]
    ]);
  });

  it('should execute with delay', async () => {

    const order = [];
    const collection = [1, 5, 3, 4, 2];
    const iterator = (value, key) => {
      return new Promise(resolve => setTimeout(() => {
        order.push([key, value]);
        resolve(value * 2);
      }, DELAY * value));
    };
    const res = await Promise.delay(DELAY, collection).mapLimit(2, iterator);
    assert.strictEqual(Object.prototype.toString.call(res), '[object Array]');
    assert.deepStrictEqual(res, [2, 10, 6, 8, 4]);
    assert.deepStrictEqual(order, [
      [0, 1],
      [2, 3],
      [1, 5],
      [4, 2],
      [3, 4]
    ]);
  });
});
