import React from 'react';
import PropTypes from 'prop-types';

import { FaCheck } from 'react-icons/fa';

export default class CheckBox extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.bool,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = { value: props.value || false };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps) {
      this.setState({ value: nextProps.value });
    }
  }

  onClick = e => {
    let value = !this.state.value;

    if (this.props.onChange) {
      this.props.onChange(value);
    }

    this.setState({ value });
  }

  render() {
    return <div className='property-control checkbox' onClick={this.onClick}>
      <label>
        <div className='label'>
          {this.props.label || ''}
        </div>
        <div className='control'>
          {this.state.value === true &&
            <input
              type='checkbox'
              value={true}
              checked={true}
              onChange={() => {}}
            />
          }
          {this.state.value === false &&
            <input
              type='checkbox'
              value={false}
            />
          }
          <div className='checker'><FaCheck /></div>
        </div>
      </label>
    </div>;
  }
}
