import React from 'react';
import ReactDOM from 'react-dom';

import App from './app';

function render() {
  ReactDOM.render(
    <App />,
    document.getElementById('app')
  );
}

render();
