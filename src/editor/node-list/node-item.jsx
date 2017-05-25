import React from 'react';
import PropTypes from 'prop-types';

export default class NodeItem extends React.Component {
  static propTypes = {
    node: PropTypes.any.isRequired,
    active: PropTypes.bool,
    onClick: PropTypes.func
  };

  onItemClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }

  render() {
    let node = this.props.node;
    let depthSpaces = [];

    for (let i = 0; i < node.depth; i++) {
      depthSpaces.push(<div key={i} className='apib-node-depth-space' />);
    }

    let elem = <div
        className={'apib-node-item' + (this.props.active ? ' active' : '')}
        onClick={this.onItemClick}
        title={node.name}
      >
      <div className='apib-node-depth-spaces'>
        {depthSpaces}
      </div>
      <div className='apib-node-header'>
        {node.name}
      </div>
    </div>;

    return elem;
  }
}
