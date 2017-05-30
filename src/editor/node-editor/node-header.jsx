import React from 'react';
import PropTypes from 'prop-types';

export default class NodeHeader extends React.Component {
  static propTypes = {
    activeNode: PropTypes.any.isRequired,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);

    let node = this.props.activeNode;
    
    this.state = {
      header: node.header,
      error: false
    };
  }

  componentWillReceiveProps(nextProps) {
    let node = nextProps.activeNode;

    this.setState({ header: node.header, error: false });
  }

  onHeaderChange = e => {
    let value = e.target.value;

    try {
      if (!this.props.activeNode.constructor.canAcceptHeader(value)) {
        this.setState({ header: value, error: true });
        return;
      }
    } catch (e) {
      this.setState({ header: value, error: true });
      return;
    }

    if (this.props.onChange) {
      this.props.onChange(value);
    }

    this.setState({ header: value, error: false });
  }

  render() {
    let node = this.props.activeNode;

    return <div className={'apib-node-editor-header' + (this.state.error ? ' error' : '')}>
      <input type='text' value={this.state.header} onChange={this.onHeaderChange} />
    </div>;
  }
}
