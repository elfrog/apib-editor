import signals from 'signals';

class ActionHistory {
  constructor(restoreHandler) {
    this.list = [];
    // index means next position, so the current state is in this.list[this.index - 1].
    this.index = 0;
    this.restoreHandler = restoreHandler;
  }

  get length() {
    return this.list.length;
  }

  push(name, state) {
    this.list = this.list.slice(0, this.index);
    this.list.push({
      name,
      state,
      index: this.index,
      time: Date.now()
    });
    this.index = this.list.length;
  }

  restore(index) {
    if (index <= 0 || index > this.list.length || index === this.index) {
      return;
    }

    this.restoreHandler(this.list[index - 1].state);
    this.index = index;
  }

  undo() {
    this.restore(this.index - 1);
  }

  redo() {
    this.restore(this.index + 1);
  }

  canRedo() {
    return this.index < this.list.length;
  }

  canUndo() {
    return this.index > 1;
  }
}

export default class Action {
  constructor(initialState = {}) {
    this.state = Object.assign({}, initialState);
    this.do = {};
    this.on = {
      stateChange: new signals.Signal(),
      error: new signals.Signal()
    };
    this.history = new ActionHistory(state => {
      this.state = state;
      this.on.stateChange.dispatch(this.state);
    });

    this.history.push('initialState', this.state);
  }

  register(name, thunk, initialState = null) {
    if (name in this.do) {
      throw new Error('Duplicated action name: ' + name);
    }

    if (this.initialState) {
      this.state = Object.assign({}, this.state, initialState);
    }

    this.on[name] = new signals.Signal();
    this.do[name] = (...args) => {
      try {
        let result = thunk.apply(this.state, args);

        if (result instanceof Promise) {
          result.then(actionState => {
            this.pushState(name, actionState);
          }).catch(e => {
            this.on.error.dispatch(e);
          });
        } else {
          this.pushState(name, result);
        }
      } catch (e) {
        this.on.error.dispatch(e);
      }
    };
  }

  pushState(handlerName, state) {
    if (Object.keys(state).length === 0) {
      return;
    }

    this.state = Object.assign({}, this.state, state);
    this.history.push(handlerName, this.state);
    this.on[handlerName].dispatch(this.state);
    this.on.stateChange.dispatch(this.state);
  }
}
