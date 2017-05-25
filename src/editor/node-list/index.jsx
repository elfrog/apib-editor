import React from 'react';
import PropTypes from 'prop-types';

import NodeItem from './node-item';

export default class NodeList extends React.Component {
  static propTypes = {
    nodeList: PropTypes.array.isRequired,
    activeNode: PropTypes.any,
    onFilter: PropTypes.func,
    onSelect: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      filterText: ''
    };
  }

  onFilterTextChanged = e => {
    let value = e.target.value;
    this.setState({ filterText: value });
    this.props.onFilter(value);
  }

  onItemSelect = (node) => {
    if (this.props.onSelect) {
      this.props.onSelect(node);
    }
  }

  render() {
    let nodeItems = this.props.nodeList.map(node => 
      <NodeItem key={node.id} node={node} active={node === this.props.activeNode} onClick={e => this.onItemSelect(node)} />
    );

    return <div className='apib-node-list'>
      <input className='apib-node-list-filter' type='text' placeholder='search...' onChange={this.onFilterTextChanged} />
      <div className='apib-node-list-items'>
        {nodeItems}
      </div>
    </div>;
  }
}
