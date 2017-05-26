import React from 'react';
import PropTypes from 'prop-types';

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
    node: PropTypes.any.isRequired,
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

  render() {
    let node = this.props.node;
    let urlElement = null;
    let nodeTypeName = getNodeTypeName(node);

    if (node instanceof ActionNode) {
      if (node.url) {
        urlElement = <Text label='URL' value={node.url} onChange={value => this.onPropertyChange('url', value)} />;
      } else {
        urlElement = <Text label='URL' placeholder={node.urlInherited} onChange={value => this.onPropertyChange('url', value)} />;
      }
    } else if (node.hasOwnProperty('url')) {
      urlElement = <Text label='URL' value={node.url} onChange={value => this.onPropertyChange('url', value)} />;
    }

    return <div className='apib-node-property-view property-view'>
      <h2 className='property-view-title'>{nodeTypeName}</h2>

      <Text label='Name' value={node.name} onChange={value => this.onPropertyChange('name', value)} />

      {urlElement}

      {node instanceof ActionNode &&
        <Select
          label='Action'
          value={node.action}
          options={['GET', 'PUT', 'POST', 'DELETE', 'UPDATE']}
          onChange={value => this.onPropertyChange('action', value)}
        />
      }

      {node instanceof ModelNode &&
        <Select label='Model Type' value={node.modelType} options={['object', 'enum']} />
      }
    </div>;
  }
}
