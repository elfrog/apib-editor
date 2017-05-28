import React from 'react';
import PropTypes from 'prop-types';

import ContextMenu from '../components/context-menu';

import {
  FaBook, FaCube, FaFolderOpen, FaDatabase, FaCaretDown, FaMinus,
  FaArrowCircleDown, FaPlusCircle, FaTimesCircle, FaArrowCircleUp,
  FaEllipsisH
} from 'react-icons/fa';

import PackageNode from '../../parser/package-node';
import ResourceGroupNode from '../../parser/resource-group-node';
import ModelGroupNode from '../../parser/model-group-node';
import ResourceNode from '../../parser/resource-node';
import ActionNode from '../../parser/action-node';
import ModelNode from '../../parser/model-node';

export default class NodeItem extends React.Component {
  static propTypes = {
    node: PropTypes.any.isRequired,
    active: PropTypes.bool,
    onClick: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      menuOpen: false
    };
  }

  onItemClick = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (this.props.onClick) {
      this.props.onClick(e);
    }
  }

  onMenuButtonClick = e => {
    e.stopPropagation();
    e.preventDefault();

    this.setState({ menuOpen: true });
  }

  onContextMenu = e => {
    e.stopPropagation();
    e.preventDefault();

    this.setState({ menuOpen: true });
  }

  closeMenu = () => {
    this.setState({ menuOpen: false });
  }

  getIconByNodeType(node) {
    if (node.parent === null) {
      return <FaBook />;
    } else if (node instanceof PackageNode) {
      return <FaCube />
    } else if (node instanceof ResourceGroupNode) {
      return <FaFolderOpen />
    } else if (node instanceof ResourceNode) {
      return <FaCaretDown />
    } else if (node instanceof ModelGroupNode) {
      return <FaDatabase />
    } else if (node instanceof ActionNode) {
      switch (node.action) {
      case 'GET': return <FaArrowCircleDown />;
      case 'POST': return <FaPlusCircle />;
      case 'PUT': return <FaArrowCircleUp />;
      case 'DELETE': return <FaTimesCircle />;
      }
    }

    return <FaMinus />;
  }

  render() {
    let node = this.props.node;
    let depthSpaces = [];
    let iconElement = this.getIconByNodeType(node);

    for (let i = 0; i < node.depth; i++) {
      depthSpaces.push(
        <div key={i} className='apib-node-depth-space'>
          <div className='apib-node-depth-space-bar' />
        </div>
      );
    }

    let elem = <div
        className={'apib-node-item' + (this.props.active ? ' active' : '')}
        onClick={this.onItemClick}
        onContextMenu={this.onContextMenu}
      >
      {this.state.menuOpen &&
        <ContextMenu items={[
            { label: 'test1' },
            { label: 'test2' },
            { label: 'test3' }
          ]}
          onClose={this.closeMenu}
        />
      }

      <div className='apib-node-depth-spaces'>
        {depthSpaces}
      </div>

      {node instanceof ActionNode ? 
        <div className={'apib-node-header-icon action-' + node.action.toLowerCase()}>{iconElement}</div> :
        <div className='apib-node-header-icon'>{iconElement}</div>
      }

      <div className='apib-node-header' title={node.name}>
        {node.name}
      </div>

      <button className='apib-node-menu-button' onClick={this.onMenuButtonClick}>
        <FaEllipsisH />
      </button>
    </div>;

    return elem;
  }
}
