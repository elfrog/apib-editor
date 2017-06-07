import React from 'react';
import ReactDOM from 'react-dom';

import Action from './action';
import Editor from './editor';
import Toast from './editor/components/toast';

import { actions, initialState } from './editor/actions';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, initialState);
    this.action = new Action(initialState);

    this.setup();
  }

  setup() {
    for (let action of actions) {
      this.action.register(action.name, action);
    }

    this.action.on('statechange', (state) => {
      this.setState(state);
    });

    this.action.on('error', e => {
      Toast.error(e.message);
    });
  }

  render() {
    return <Editor action={this.action} {...this.state} />;
  }
}
