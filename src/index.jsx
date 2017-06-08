import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';

function setup() {
  let container = document.createElement('div');
  container.id = 'app';
  document.body.appendChild(container);
}

function render() {
  ReactDOM.render(
    <App />,
    document.getElementById('app')
  );
}

setup();
render();
