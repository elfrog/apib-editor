import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

const DRAG_START_THRESHOLD = 1;
const INSPECT_DELAY = 1000;

let globalDragAndDrop = null;

export default class DragAndDrop extends React.Component {
  static propTypes = {
  };

  constructor(props) {
    super(props);

    this.state = {
      label: null,
      onDrop: null,
      onInspect: null,
      dragging: false,
      position: { x: 0, y: 0 }
    };

    this.startPosition = null;
    this.dragStarted = false;
    this.inspectTimer = null;
  }

  static start(option) {
    if (globalDragAndDrop === null) {
      throw new Error('DragAndDrop isn\'t mounted');
    }

    globalDragAndDrop.setState({ ...option });

    document.addEventListener('mousemove', globalDragAndDrop.onMouseMove);
    document.addEventListener('mouseup', globalDragAndDrop.onMouseUp);
  }

  componentDidMount() {
    if (globalDragAndDrop !== null) {
      throw new Error('DragAndDrop must be a single object');
    }

    globalDragAndDrop = this;
  }

  componentWillUnmount() {
    globalContextMenu = null;
  }

  clearInspect() {
    if (this.inspectTimer) {
      clearTimeout(this.inspectTimer);
      this.inspectTimer = null;
    }
  }

  onMouseMove = e => {
    if (this.dragStarted) {
      if (this.state.onInspect) {
        this.clearInspect();
        this.inspectTimer = setTimeout(() => {
          this.state.onInspect(e);
          this.inspectTimer = null;
        }, INSPECT_DELAY);
      }

      this.setState({ dragging: true, position: { x: e.pageX, y: e.pageY }});
    } else {
      if (this.startPosition) {
        if (Math.abs(this.startPosition.x - e.pageX) > DRAG_START_THRESHOLD ||
          Math.abs(this.startPosition.y - e.pageY) > DRAG_START_THRESHOLD)
        {
            this.dragStarted = true;
        }
      } else {
        this.startPosition = { x: e.pageX, y: e.pageY };
      }
    }
  }

  onMouseUp = e => {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);

    if (typeof this.state.onDrop === 'function' && this.dragStarted) {
      this.state.onDrop(e);
    }

    this.clearInspect();

    this.dragStarted = false;
    this.startPosition = null;
    this.setState({ onDrop: null, dragging: false });
  }

  render() {
    return <div
      className='drag-and-drop'
      style={{
        left: (this.state.position.x + 3),
        top: (this.state.position.y + 3),
        pointerEvents: 'none'
      }}
    >
      {this.state.dragging &&
        <div className='drag-and-drop-dummy'>{this.state.label}</div>
      }
    </div>;
  }
}
