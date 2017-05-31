import React from 'react';
import PropTypes from 'prop-types';

import { FaClose } from 'react-icons/fa';

export default class Modal extends React.Component {
  static propTypes = {
    header: PropTypes.any,
    footer: PropTypes.any,
    open: PropTypes.bool,
    closable: PropTypes.bool,
    onClose: PropTypes.func
  };

  constructor(props) {
    super(props);
  }

  onBackdropClick = e => {
    if (this.props.closable === false) {
      return;
    }

    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  onContainerClick = e => {
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    return <div className={'modal' + (this.props.open ? ' open' : ' close')}>
      <div className='modal-backdrop' onClick={this.onBackdropClick}>
        <div className='modal-container' onClick={this.onContainerClick}>
          {this.props.closable !== false &&
            <button className='modal-close' onClick={this.onBackdropClick}><FaClose /></button>
          }

          {this.props.header &&
            <div className='modal-header'>
              {this.props.header}
            </div>
          }

          <div className='modal-body'>
            {this.props.children}
          </div>

          {this.props.footer &&
            <div className='modal-footer'>
              {this.props.footer}
            </div>
          }
        </div>
      </div>
    </div>;
  }
}
