import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

export default class VSplitBar extends React.Component {
  static PropTypes = {
    left: PropTypes.number.isRequired,
    size: PropTypes.number,
    draggable: PropTypes.bool,
    onPositionChange: PropTypes.func,
    onDragEnd: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = {
      dragging: false
    };

    this.dragStartPos = 0;
    this.domPos = 0;
  }

  onMouseMove = e => {
    if (this.state.dragging) {
      // beware that leftPos is not relative position to its parent but its page.
      let leftPos = e.pageX - this.dragStartPos + this.domPos;

      if (this.props.onPositionChange)  {
        this.props.onPositionChange(leftPos);
      }
    }
  }

  onMouseUp = e => {
    this.setState({ dragging: false });

    if (this.props.onDragEnd) {
      this.props.onDragEnd(e);
    }

    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseDown = e => {
    e.stopPropagation();
    e.preventDefault();

    if (this.props.draggable === false) {
      return;
    }

    let domNode = ReactDOM.findDOMNode(this);

    if (domNode) {
      let rect = domNode.getBoundingClientRect();

      this.dragStartPos = e.pageX;
      this.domPos = rect.left;

      this.setState({ dragging: true });

      document.addEventListener('mousemove', this.onMouseMove);
      document.addEventListener('mouseup', this.onMouseUp);
    }
  }

  render() {
    let classNames = ['v-split-bar'];

    if (this.state.dragging) {
      classNames.push('dragging');
    }

    if (this.props.draggable === false) {
      classNames.push('disabled');
    }

    return <div
      className={classNames.join(' ')}
      style={{
        left: this.props.left + 'px',
        width: (this.props.size || 5) + 'px'
      }}
      onMouseDown={this.onMouseDown}
    > </div>;
  }
}
