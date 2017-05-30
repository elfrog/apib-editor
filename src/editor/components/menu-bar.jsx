import React from 'react';
import PropTypes from 'prop-types';

class MenuBarSeparator extends React.Component {
  render() {
    return <div className='menu-bar-separator'></div>;
  }
}

class MenuBarButton extends React.Component {
  static propTypes = {
    onClick: PropTypes.func
  };

  render() {
    return <div className='menu-bar-button'>
      <button onClick={this.props.onClick}>{this.props.children}</button>
    </div>;
  }
}

export default class MenuBar extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired
  };

  render() {
    return <div className='menu-bar'>
      {this.props.items.map((item, idx) => {
        if (item.separator) {
          return <MenuBarSeparator key={idx} />
        } else {
          return <MenuBarButton key={idx} onClick={item.onClick}>{item.icon || '' }{item.label}</MenuBarButton>;
        }
      })}
    </div>;
  }
}
