import React from 'react';
import PropTypes from 'prop-types';

import { FaClose } from 'react-icons/fa';

const TOAST_TIMEOUT = 3000;

let globalToast = null;

export default class Toast extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      message: '',
      open: false,
      toastType: 'message'
    };
    this.timer = null;
  }

  static open(message, toastType = 'message') {
    if (!globalToast) {
      throw new Error('Toast isn\'t mounted');
    }

    globalToast.setState({ message, toastType, open: true });

    if (globalToast.timer) {
      globalToast.timer = null;
    }

    globalToast.timer = setTimeout(() => {
      globalToast.setState({ open: false });
      globalToast.timer = null;
    }, TOAST_TIMEOUT);
  }

  static close() {
    if (globalToast.timer) {
      clearTimeout(globalToast.timer);
      globalToast.timer = null;
    }

    globalToast.setState({ open: false });
  }

  static error(message) {
    Toast.open(message, 'error');
  }

  static warn(message) {
    Toast.open(message, 'warning');
  }

  componentDidMount() {
    if (globalToast !== null) {
      throw new Error('Toast must be a single object.');
    }

    globalToast = this;
  }

  componentWillUnmount() {
    globalToast = null;
  }

  onCloseButtonClick = e => {
    Toast.close();
  }

  render() {
    return <div className='toast'>
      <div className={'toast-box ' + (this.state.toastType) + (this.state.open ? ' open' : '')}>
        <div className='toast-message'>{this.state.message}</div>
        <button className='toast-close-button' onClick={this.onCloseButtonClick}>
          <FaClose />
        </button>
      </div>
    </div>;
  }
}
