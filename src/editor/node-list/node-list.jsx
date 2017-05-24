import React from 'react';
import NodeItem from './node-item';

import Action, { actionable } from '../action';

@actionable
function test(haha) {
  ;
}

export default class NodeList extends React.Component {
  render() {
    let rootNode = this.props.rootNode;

    return <div className='apib-node-list'>
      <NodeItem node={rootNode} />
    </div>;
  }
}
