import React from 'react';
import ReactDOM from 'react-dom';

import AppService from 'platform/app-service';

import App from './app';

function render() {
  ReactDOM.render(
    <App />,
    document.getElementById('app')
  );
}

AppService.setup();

render();
