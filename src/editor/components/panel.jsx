import React from 'react';
import PropTypes from 'prop-types';

export default class Panel extends React.Component {
  static propTypes = {
    left: PropTypes.number,
    width: PropTypes.number,
    height: PropTypes.number
  };
  
  constructor(props) {
    super(props);
  }

  render() {
    let style = {};

    if (this.props.left) {
      style.left = this.props.left + 'px';
    }

    if (this.props.width) {
      style.width = this.props.width + 'px';
    }

    if (this.props.height) {
      style.height = this.props.height + 'px';
    }

    return <div className='panel' style={style}>
      {this.props.children}
    </div>;
  }
}
