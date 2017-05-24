import React from 'react';
import ReactDOM from 'react-dom';

import '../styles/main.less';

import apiData from 'raw-loader!../../../test.apib';
import ApibParser from '../parser/apib-parser';

import NodeList from './node-list/node-list';

let parser = new ApibParser();

parser.parse(apiData).then(root => {
  ReactDOM.render(
    <div className='apib-main-container'>
      <NodeList rootNode={root} />
    </div>,
    document.getElementById('app')
  );
});
