import React from 'react';
import PropTypes from 'prop-types';

export default class Number extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    placeholder: PropTypes.string,
    value: PropTypes.any,
    min: PropTypes.number,
    max: PropTypes.number,
    step: PropTypes.number,
    autoFocus: PropTypes.bool,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = { value: props.value };
  }

  componentDidUpdate() {
    if (this.props.autoFocus) {
      this.input.focus();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps) {
      this.setState({ value: nextProps.value });
    }
  }

  onValueChange = e => {
    let value = e.target.value;

    if (this.props.onChange) {
      this.props.onChange(parseInt(value));
    }

    this.setState({ value });
  }

  render() {
    return <div className='property-control number'>
      <label>
        <div className='label'>
          {this.props.label || ''}
        </div>
        <div className='control'>
          <input
            type='number'
            value={this.state.value || ''}
            min={this.props.min}
            max={this.props.max}
            step={this.props.step}
            ref={input => this.input = input}
            placeholder={this.props.placeholder || ''}
            onChange={this.onValueChange}
          />
        </div>
      </label>
    </div>;
  }
}
