import React from 'react';

export default class NodeItem extends React.Component {
  render() {
    let node = this.props.node;
    let elem = <div className='apib-node-item'>
      <div className='apib-node-header'>{node.name}</div>
      {node.children.length > 0 &&
        <ul className='apib-node-children'>
          {node.children.map(child => {
            return <li key={child.id} className='apib-node-child'>
              <NodeItem node={child} />
            </li>;
          })}
        </ul>
      }
    </div>;

    return elem;
  }
}
