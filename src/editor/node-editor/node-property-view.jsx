import React from 'react';
import PropTypes from 'prop-types';

import PropertyView from '../components/property-view';
import Text from '../components/property-controls/text';
import Select from '../components/property-controls/select';

import PackageNode from '../../parser/package-node';
import ResourceGroupNode from '../../parser/resource-group-node';
import ModelGroupNode from '../../parser/model-group-node';
import ResourceNode from '../../parser/resource-node';
import ActionNode from '../../parser/action-node';
import ModelNode from '../../parser/model-node';

function getNodeTypeName(node) {
  if (node instanceof PackageNode) {
    return 'Package';
  } else if (node instanceof ResourceGroupNode) {
    return 'Resource Group';
  } else if (node instanceof ModelGroupNode) {
    return 'Model Group';
  } else if (node instanceof ResourceNode) {
    return 'Resource';
  } else if (node instanceof ActionNode) {
    return 'Action';
  } else if (node instanceof ModelNode) {
    return 'Model';
  }
}

export default class NodePropertyView extends React.Component {
  static propTypes = {
    rootNode: PropTypes.any.isRequired,
    activeNode: PropTypes.any.isRequired,
    onPropertyChange: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  onPropertyChange(key, value) {
    if (this.props.onPropertyChange) {
      this.props.onPropertyChange(key, value);
    }
  }

  renderNameInput(node) {
    let autoFocus = node.name ? false : true;
    return <Text
      label='Name'
      value={node.name}
      onChange={value => this.onPropertyChange('name', value)}
      autoFocus={autoFocus}
    />;
  }

  renderUrlInput(node) {
    let urlElement = null;

    if (node instanceof ActionNode) {
      if (node.url) {
        urlElement = <Text label='URL' value={node.url} onChange={value => this.onPropertyChange('url', value)} />;
      } else {
        try {
          let url = node.urlInherited;
          urlElement = <Text label='URL' placeholder={url} onChange={value => this.onPropertyChange('url', value)} />;
        } catch (e) {
          urlElement = <Text label='URL' placeholder={'type URL'} onChange={value => this.onPropertyChange('url', value)} />;
        }
      }
    } else if (node.hasOwnProperty('url')) {
      urlElement = <Text label='URL' value={node.url} onChange={value => this.onPropertyChange('url', value)} />;
    }

    return urlElement;
  }

  renderActionInput(node) {
    return <Select
      label='Action'
      value={node.action}
      options={['GET', 'PUT', 'POST', 'DELETE', 'UPDATE']}
      onChange={value => this.onPropertyChange('action', value)}
    />;
  }

  renderModelTypeInput(node) {
    let modelTypes = this.props.rootNode.flatten().filter(p => p instanceof ModelNode).map(p => p.name);

    return <Select
      label='Model Type'
      value={node.modelType}
      options={['object', 'enum', ...modelTypes]}
      onChange={value => this.onPropertyChange('modelType', value)}
    />;
  }

  render() {
    let node = this.props.activeNode;
    let nodeTypeName = getNodeTypeName(node);

    return <PropertyView header={nodeTypeName}>
      {this.renderNameInput(node)}

      {this.renderUrlInput(node)}

      {node instanceof ActionNode &&
        this.renderActionInput(node)
      }

      {node instanceof ModelNode &&
        this.renderModelTypeInput(node)
      }
    </PropertyView>;
  }
}
