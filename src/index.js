import React from 'react';
import ReactDOM from 'react-dom';

import './styles/main.less';
import apiData from 'raw-loader!./api-data.apib';

import ApibParser from './parser/apib-parser';

let parser = new ApibParser();

function renderNode(node) {
  let elem = <div className='apib-node'>
    <div className='apib-node-header'>{node.header}</div>
    {node.children.length > 0 &&
      <ul className='apib-node-children'>
        {node.children.map(child => {
          return <li key={child.id} className='apib-node-child'>{renderNode(child)}</li>;
        })}
      </ul>
    }
  </div>;

  return elem;
}

parser.parse(apiData).then(root => {
  ReactDOM.render(
    <div className='apib-node-panel'>{renderNode(root)}</div>,
    document.getElementById('app')
  );
});
