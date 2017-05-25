import signals from 'signals';

export default class Action {
  constructor(initialState = {}) {
    this.stateHistory = [];
    this.state = Object.assign({}, initialState);
    this.do = {};
    this.on = {
      stateChange: new signals.Signal()
    };
  }

  register(name, thunk, initialState = {}) {
    if (name in this.do) {
      throw new Error('Duplicated action name: ' + name);
    }

    this.state = Object.assign({}, this.state, initialState);
    this.on[name] = new signals.Signal();
    this.do[name] = (...args) => {
      let result = thunk.apply(this.state, args);

      if (result instanceof Promise) {
        result.then(actionState => {
          this.pushState(name, actionState);
        });
      } else {
        this.pushState(name, result);
      }
    };
  }

  pushState(handlerName, state) {
    this.stateHistory.push(this.state);
    this.state = Object.assign({}, this.state, state);
    this.on[handlerName].dispatch(this.state);
    this.on.stateChange.dispatch(this.state);
  }
}
