import React from 'react';
import ReactDOM from 'react-dom';
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
    onSelect: PropTypes.func,
    onAddNode: PropTypes.func,
    onRemoveNode: PropTypes.func,
    onChangeNodeIndex: PropTypes.func,
    onCopyNode: PropTypes.func,
    onPasteNode: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.filterTimer = null;
    this.state = { filterText: '' };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.filter !== nextProps.filter) {
      this.setState({ filterText: nextProps.filter });
    }
  }

  componentDidUpdate(prevProps) {
    this.focusOnActiveItem();
  }

  focusOnActiveItem() {
    let item = this.refs.activeItem;

    if (item) {
      let domNode = ReactDOM.findDOMNode(item);

      // scrollIntoViewIfNeeded is supported by Chrome, Opera and Safari.
      if (domNode.scrollIntoViewIfNeeded) {
        domNode.scrollIntoViewIfNeeded();
      } else {
        // TODO the polyfill of scrollIntoViewIfNeeded is needed for Firefox, IE and Edge.
        // domNode.scrollIntoView();
      }
    }
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

    this.setState({ filterText: value });
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
      <NodeItem
        key={node.id}
        ref={node === this.props.activeNode ? 'activeItem' : undefined}
        node={node}
        active={node === this.props.activeNode}
        onClick={e => this.onItemSelect(node)}
        onAddNode={this.props.onAddNode}
        onRemoveNode={this.props.onRemoveNode}
        onChangeNodeIndex={this.props.onChangeNodeIndex}
        onCopyNode={this.props.onCopyNode}
        onPasteNode={this.props.onPasteNode}
      />
    );

    return <div className='apib-node-list'>
      <input
        className='apib-node-list-filter'
        type='text'
        placeholder='search...'
        value={this.state.filterText}
        onChange={this.onFilterTextChanged}
      />
      <div className='apib-node-list-items'>
        {nodeItems}
      </div>
    </div>;
  }
}
