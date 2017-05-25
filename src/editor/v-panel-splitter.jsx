import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import Panel from './panel';
import VSplitBar from './v-split-bar'

const MIN_PANEL_SIZE = 50;
const SPLIT_BAR_SIZE = 3;

export default class VPanelSplitter extends React.Component {
  static propTypes = {
    resizable: PropTypes.bool,
    defaultLeftPanelSize: PropTypes.number,
    onPanelSizeChange: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      leftPanelSize: this.props.defaultLeftPanelSize || 300
    };
  }

  onSplitterChange = pos => {
    if (this.props.resizable === false) {
      return;
    }

    // limit split-bar position    
    let domNode = ReactDOM.findDOMNode(this);

    if (domNode) {
      let rect = domNode.getBoundingClientRect();
      pos = Math.max(MIN_PANEL_SIZE, pos);
      pos = Math.min(rect.width - MIN_PANEL_SIZE - SPLIT_BAR_SIZE, pos);

      if (this.props.onPanelSizeChange) {
        this.props.onPanelSizeChange({
          left: pos,
          right: rect.width - pos - SPLIT_BAR_SIZE
        });
      }
    }

    this.setState({
      leftPanelSize: pos
    });
  }

  render() {
    let leftPanelSize = this.state.leftPanelSize;

    return <div className='v-panel-splitter'>
      <Panel width={leftPanelSize} >
        {this.props.children[0]}
      </Panel>

      <VSplitBar
        left={leftPanelSize}
        size={SPLIT_BAR_SIZE}
        draggable={this.props.resizable}
        onPositionChange={this.onSplitterChange}
      />

      <Panel left={leftPanelSize + SPLIT_BAR_SIZE}>
        {this.props.children[1]}
      </Panel>
    </div>;
  }
}
