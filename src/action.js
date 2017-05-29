import signals from 'signals';

export default class Action {
  constructor(initialState = {}) {
    this.state = Object.assign({}, initialState);
    this.history = [{
      name: 'initialState',
      index: 0,
      time: Date.now(),
      state: this.state
    }];
    this.historyIndex = 1;
    this.do = {};
    this.on = {
      stateChange: new signals.Signal(),
      error: new signals.Signal()
    };
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

  canRedo() {
    return this.historyIndex < this.history.length;
  }

  canUndo() {
    return this.historyIndex > 0;
  }

  getRedos() {
    return this.history.slice(this.historyIndex, this.history.length);
  }

  getUndos() {
    return this.history.slice(0, this.historyIndex - 1);
  }

  redo() {
    this.restore(this.historyIndex + 1);
  }

  undo() {
    this.restore(this.historyIndex - 1);
  }

  restore(index) {
    if (index <= 0 || index > this.history.length || index === this.historyIndex) {
      return;
    }

    this.state = this.history[index - 1].state;
    this.historyIndex = index;
    this.on.stateChange.dispatch(this.state);
  }

  pushState(handlerName, state) {
    this.history = this.history.slice(0, this.historyIndex);
    this.history.push({
      name: handlerName,
      index: this.historyIndex,
      time: Date.now(),
      state
    });
    this.historyIndex = this.history.length;
    this.state = Object.assign({}, this.state, state);
    this.on[handlerName].dispatch(this.state);
    this.on.stateChange.dispatch(this.state);
  }
}
