import signals from 'signals';

class Action {
  constructor() {
    this.stateHistory = [];
    this.state = {};
    this.do = {};
    this.on = {};
  }

  register(name, thunk) {
    if (name in this.do) {
      throw new Error('Duplicated action name: ' + name);
    }

    let eventHandler = new signals.Signal();

    this.on[name] = eventHandler;

    this.do[name] = (...args) => {
      let actionState = thunk(...args);
      this.stateHistory.push(this.state);
      this.state = Object.assign({}, this.state, actionState);
      eventHandler(this.state);
    };
  }
}

let actionInstance = new Action();

export function actionable(target) {
  console.log(target);
}

export default actionInstance as Action;
