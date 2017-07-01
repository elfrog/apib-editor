import React from 'react';
import PropTypes from 'prop-types';

import ContextMenu from '../components/context-menu';
import DragAndDrop from '../components/drag-and-drop';

import {
  FaBook, FaCube, FaFolderOpen, FaDatabase, FaCaretDown, FaMinus,
  FaArrowCircleDown, FaPlusCircle, FaTimesCircle, FaArrowCircleUp,
  FaEllipsisH, FaTrash, FaPlus
} from 'react-icons/fa';

import StorageService from 'platform/storage-service';

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
    onClick: PropTypes.func,
    onAddNode: PropTypes.func,
    onRemoveNode: PropTypes.func,
    onChangeNodeIndex: PropTypes.func,
    onCopyNode: PropTypes.func,
    onPasteNode: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  addNode(childNode) {
    if (this.props.onAddNode) {
      this.props.onAddNode(this.props.node, childNode);
    }
  }

  getNodeMenuItems() {
    let node = this.props.node;
    let items = [];

    if (node instanceof PackageNode) {
      items.push({
        label: 'Add Package',
        icon: <FaPlus />,
        onClick: () => this.addNode(new PackageNode())
      });
      items.push({
        label: 'Add Resource Group',
        icon: <FaPlus />,
        onClick: () => this.addNode(new ResourceGroupNode())
      });
      items.push({
        label: 'Add Model Group',
        icon: <FaPlus />,
        onClick: () => this.addNode(new ModelGroupNode())
      });
    } else if (node instanceof ResourceGroupNode) {
      items.push({
        label: 'Add Resource',
        icon: <FaPlus />,
        onClick: () => this.addNode(new ResourceNode())
      });
      items.push({
        label: 'Add Action',
        icon: <FaPlus />,
        onClick: () => this.addNode(new ActionNode())
      });
      items.push({
        label: 'Add Model Group',
        icon: <FaPlus />,
        onClick: () => this.addNode(new ModelGroupNode())
      });
    } else if (node instanceof ModelGroupNode) {
      items.push({
        label: 'Add Model',
        icon: <FaPlus />,
        onClick: () => this.addNode(new ModelNode())
      });
    } else if (node instanceof ResourceNode) {
      items.push({
        label: 'Add Action',
        icon: <FaPlus />,
        onClick: () => this.addNode(new ActionNode())
      });
    }

    if (node.parent) {
      if (items.length > 0) {
        items.push({ separator: true });
      }

      items.push({
        label: 'Copy Node',
        onClick: () => {
          if (this.props.onCopyNode) {
            this.props.onCopyNode(node);
          }
        }
      });

      if (!(node instanceof ActionNode) && !(node instanceof ModelNode)) {
        let copyData = StorageService.get('editor.copy.data');

        if (copyData) {
          let copyName = StorageService.get('editor.copy.name');

          items.push({
            label: <span>Paste <small>&lt;{copyName}&gt;</small></span>,
            onClick: () => {
              if (this.props.onPasteNode) {
                this.props.onPasteNode(node);
              }
            }
          });
        }
      }

      items.push({ separator: true });

      items.push({
        label: 'Remove',
        icon: <FaTrash />,
        onClick: () => {
          if (this.props.onRemoveNode) {
            this.props.onRemoveNode(node.parent, node);
          }
        }
      });
    }

    return items;
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

    ContextMenu.open({
      items: this.getNodeMenuItems(),
      target: this,
      position: ContextMenu.positioners.BOTTOM_RIGHT
    });
  }

  onContextMenu = e => {
    e.stopPropagation();
    e.preventDefault();

    ContextMenu.open({
      items: this.getNodeMenuItems(),
      position: { top: e.pageY, left: e.pageX }
    });
  }

  onMouseDown = e => {
    e.stopPropagation();
    e.preventDefault();

    if (!this.props.onChangeNodeIndex) {
      return;
    }

    DragAndDrop.start({
      label: this.props.node.name,
      onDrop: e => {
        let nodeId = this.getNodeIdFromDom(e.target);

        if (nodeId) {
          this.props.onChangeNodeIndex(this.props.node, nodeId);
        }
      }
    });
  }

  getNodeIdFromDom(target) {
    let p = target;

    while (p && p.getAttribute) {
      let nodeId = p.getAttribute('data-node-id');

      if (nodeId) {
        return Number(nodeId);
      }

      p = p.parentNode;
    }

    return null;
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

    return <div
        className={'apib-node-item' + (this.props.active ? ' active' : '')}
        data-node-id={node.id}
        onClick={this.onItemClick}
        onContextMenu={this.onContextMenu}
        onMouseDown={this.onMouseDown}
      >

      <div className='apib-node-depth-spaces'>
        {depthSpaces}
      </div>

      {node instanceof ActionNode ? 
        <div className={'apib-node-header-icon action-' + node.action.toLowerCase()}>{iconElement}</div> :
        <div className='apib-node-header-icon'>{iconElement}</div>
      }

      <div className='apib-node-header'> 
        {node.name}
      </div>

      <button className='apib-node-menu-button' onClick={this.onMenuButtonClick}>
        <FaEllipsisH />
      </button>
    </div>;
  }
}
