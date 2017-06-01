import React from 'react';
import PropTypes from 'prop-types';

export default class PropertyView extends React.Component {
  static propTypes = {
    header: PropTypes.any
  };

  render() {
    return <div className='property-view'>
      {this.props.header &&
        <div className='property-view-header'>
          {this.props.header}
        </div>
      }
      <div className='property-view-body'>
        {this.props.children}
      </div>
    </div>;
  }
}
