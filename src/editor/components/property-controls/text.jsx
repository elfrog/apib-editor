import React from 'react';
import PropTypes from 'prop-types';

export default class Text extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = { value: props.value };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps) {
      this.setState({ value: nextProps.value });
    }
  }

  onValueChange = e => {
    let value = e.target.value;

    if (this.props.onChange) {
      this.props.onChange(value);
    }

    this.setState({ value });
  }

  render() {
    return <div className='property-control'>
      <label>
        <div className='label'>
          {this.props.label || ''}
        </div>
        <div className='control'>
          <input
            type='text'
            value={this.state.value || ''}
            placeholder={this.props.placeholder || ''}
            onChange={this.onValueChange}
          />
        </div>
      </label>
    </div>;
  }
}
