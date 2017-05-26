import React from 'react';
import PropTypes from 'prop-types';

import NodeItem from './node-item';

const FILTER_DELAY = 300;

// parents are also included if at least one of their children included.
function filterAndFlattenNode(node, filterValue) {
  let test = node.name.toLowerCase().indexOf(filterValue.toLowerCase()) >= 0;
  let list = test ? [node] : [];

  for (let child of node.children) {
    list = list.concat(filterAndFlattenNode(child, filterValue));
  }

  if (!test && list.length > 0) {
    list.unshift(node);
  }

  return list;
}

export default class NodeList extends React.Component {
  static propTypes = {
    rootNode: PropTypes.any,
    activeNode: PropTypes.any,
    filter: PropTypes.string,
    onFilter: PropTypes.func,
    onSelect: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.filterTimer = null;
  }

  onFilterTextChanged = e => {
    if (!this.props.onFilter) {
      return;
    }

    if (this.filterTimer) {
      clearTimeout(this.filterTimer);
    }

    let value = e.target.value;

    this.filterTimer = setTimeout(() => {
      this.props.onFilter(value);
      this.filterTimer = null;
    }, FILTER_DELAY);
  }

  onItemSelect = (node) => {
    if (this.props.onSelect) {
      this.props.onSelect(node);
    }
  }

  render() {
    let nodeList = this.props.rootNode ?
      (this.props.filter ? filterAndFlattenNode(this.props.rootNode, this.props.filter) : this.props.rootNode.flatten()) : [];
    let nodeItems = nodeList.map(node => 
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
