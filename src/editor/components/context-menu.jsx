import React from 'react';
import PropTypes from 'prop-types';

import { FaCaretRight } from 'react-icons/fa';

class MenuItemSeparator extends React.Component {
  render() {
    return <div className='menu-item-separator'></div>;
  }
}

class MenuItem extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    shortcut: PropTypes.string,
    icon: PropTypes.element,
    items: PropTypes.array,
    onClick: PropTypes.func,
    onItemClick: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = { open: false };
    this.timer = null;
  }

  onItemClick = e => {
    e.stopPropagation();
    e.preventDefault();

    if (this.props.onClick) {
      this.props.onClick(e);
    }

    if (!this.props.items && this.props.onItemClick) {
      this.props.onItemClick(this.props);
    }

    this.toggleSubMenu(!this.state.open, 0);
  }

  toggleSubMenu(open, delay = 300) {
    if (!this.props.items) {
      return;
    }

    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }

    if (delay > 0) {
      this.timer = setTimeout(() => {
        this.setState({ open });
        this.timer = null;
      }, delay);
    } else {
      this.setState({ open });
    }
  }

  render() {
    return <div
      className='menu-item'
      onClick={this.onItemClick}
      onMouseLeave={() => this.toggleSubMenu(false)}
      onMouseEnter={() => this.toggleSubMenu(true)}
    >
      <div className='menu-item-icon'>{this.props.icon}</div>
      <div className='menu-item-content'>
        <div className='menu-item-label'>
          {this.props.label}
        </div>

        {this.props.shortcut &&
          <div className='menu-item-shortcut'>
            {this.props.shortcut}
          </div>
        }
      </div>
      
      {this.props.items &&
        <div className='menu-item-sub-menu-arrow'>
          <FaCaretRight />
        </div>
      }

      {this.props.items && this.state.open &&
        <div className='menu-item-sub-menu'>
            <Menu
              items={this.props.items}
              onItemClick={item => {
                if (this.props.onItemClick) {
                  this.props.onItemClick(item);
                }
              }}
            />
        </div>
      }
    </div>;
  }
}

class Menu extends React.Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    onItemClick: PropTypes.func
  };

  // onItemClick is propagated for making root of Menu
  // (especially ContextMenu) noticed certain MenuItem clicked.
  onItemClick = item => {
    if (this.props.onItemClick) {
      this.props.onItemClick(item);
    }
  }

  renderItems(items) {
    items.map()
  }

  render() {
    return <div className='menu'>
      {this.props.items.map((item, idx) => {
        if (item.separator) {
          return <MenuItemSeparator key={idx} />;
        } else {
          return <MenuItem key={idx} {...item} onItemClick={this.onItemClick} />;
        }
      })}
    </div>;
  }
}

export default class ContextMenu extends React.Component {
  static propTypes = {
    items: PropTypes.any,
    position: PropTypes.any,
    onClose: PropTypes.func
  };

  componentDidMount() {
    document.addEventListener('mousedown', this.onMouseDown);
  }

  componentWillUnmount() {
    document.removeEventListener('mousedown', this.onMouseDown);
  }

  onMouseDown = e => {
    if (!this.isInMenu(e.target)) {
      this.closeContextMenu();
    }
  }

  isInMenu(target) {
    let p = target;

    while (p) {
      if (p.classList && p.classList.contains('context-menu')) {
        return true;
      }

      p = p.parentNode;
    }

    return false;
  }

  closeContextMenu = () => {
    if (this.props.onClose) {
      this.props.onClose();
    }
  }

  render() {
    let style = {};

    if (this.props.position) {
      style.top = this.props.position.top;
      style.left = this.props.position.left;
    }

    return <div className='context-menu' style={style}>
      {this.props.items &&
        <Menu items={this.props.items} onItemClick={this.closeContextMenu} />
      }
    </div>;
  }
}
