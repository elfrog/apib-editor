import React from 'react';
import ReactDOM from 'react-dom';

import './styles/main.less';

import Action from './action';
import Editor from './editor';
import Toast from './editor/components/toast';

import { actions, initialState } from './editor/actions';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = Object.assign({}, initialState);
    this.action = new Action(initialState);

    for (let action of actions) {
      this.action.register(action.name, action);
    }
  }

  componentDidMount() {
    this.action.do.loadNodeList();
    this.action.on.stateChange.add((state) => {
      this.setState(state);
    });
    this.action.on.error.add(e => {
      Toast.error(e.message);
    });
  }

  render() {
    return <Editor action={this.action} {...this.state} />;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
