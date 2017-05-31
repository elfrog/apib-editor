import assert from 'assert';
import Action from '../src/action';

function testAction(value) {
  return { squared: value * value };
}

function testAsyncAction(value) {
  return new Promise(resolve => {
    resolve({ squared: value * value });
  });
}

describe('Action', () => {
  it('should register an action', () => {
    let action = new Action({ squared: 0 });

    action.register('testAction', testAction);

    assert.equal(typeof action.do['testAction'], 'function');

    action.on('statechange', function (state) {
      assert.equal(state.squared, 9);
    });

    action.do.testAction(3);
  });

  it('should process an async action', () => {
    let action = new Action({ squared: 0 });

    action.register('testAsyncAction', testAsyncAction);

    return new Promise(resolve => {
      action.on('statechange', function (state) {
        assert.equal(state.squared, 9);
        resolve();
      });

      action.do.testAsyncAction(3);
    });
  });

  it('should undo correctly', () => {
    let action = new Action({ squared: 0 });

    action.register('testAction', testAction);

    action.do.testAction(3);
    action.do.testAction(2);

    assert.equal(action.history.length, 3);
    assert.equal(action.history.index, 3);
    assert.equal(action.state.squared, 4);

    action.history.undo();

    assert.equal(action.history.index, 2);
    assert.equal(action.state.squared, 9);

    action.do.testAction(5);

    assert.equal(action.history.index, 3);
    assert.equal(action.state.squared, 25);
  });

  it('should redo correctly', () => {
    let action = new Action({ squared: 0 });

    action.register('testAction', testAction);

    action.do.testAction(3);
    action.do.testAction(2);

    action.history.undo();

    assert.equal(action.history.canRedo(), true);

    action.history.redo();

    assert.equal(action.history.index, 3);
    assert.equal(action.state.squared, 4);
  });
});
