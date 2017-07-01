import React from 'react';
import PropTypes from 'prop-types';

export default class Select extends React.Component {
  static propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    options: PropTypes.array,
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
    let optionElements = this.props.options ? this.props.options.map((option, idx) => 
      typeof option === 'string' ?
        <option key={'option-' + idx} value={option}>{option}</option> :
        <option key={'option-' + idx} value={option.value}>{option.name}</option> 
    ) : [];

    return <div className='property-control select'>
      <label>
        <div className='label'>
          {this.props.label || ''}
        </div>
        <div className='control'>
          <select value={this.state.value || ''} onChange={this.onValueChange}>
            {optionElements}
          </select>
        </div>
      </label>
    </div>;
  }
}
