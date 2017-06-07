import EventEmitter from 'eventemitter3';

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

export default class Action extends EventEmitter {
  constructor(initialState = {}) {
    super();

    this.state = Object.assign({}, initialState);
    this.do = {};
    // Store runing actions in a stack so that only first async action can push its returned state. 
    this.runningActions = [];
    this.history = new ActionHistory(state => {
      this.state = state;
      this.emit('statechange', this.state);
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

    this.do[name] = async (...args) => {
      this.runningActions.push(name);

      return new Promise((resolve, reject) => {
        try {
          let result = thunk.apply(this, args);

          if (result instanceof Promise) {
            result.then(actionState => {
              this.runningActions.pop();
              this.pushState(name, actionState);
              resolve(actionState);
            }).catch(e => {
              this.runningActions.pop();
              this.emit('error', e);
              reject(e);
            });
          } else {
            this.runningActions.pop();
            this.pushState(name, result);
            resolve(result);
          }
        } catch (e) {
          this.runningActions.pop();
          this.emit('error', e);
          reject(e);
        }
      });
    };
  }

  pushState(handlerName, state) {
    if (this.runningActions.length > 0) {
      return;
    }

    if (!state || Object.keys(state).length === 0) {
      return;
    }

    this.state = Object.assign({}, this.state, state);
    this.history.push(handlerName, this.state);
    this.emit('statechange', this.state);
  }
}
