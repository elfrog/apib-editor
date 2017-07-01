import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';

import { FaCaretRight } from 'react-icons/fa';

class MenuItemSeparator extends React.Component {
  render() {
    return <div
      className='menu-item-separator'
      onContextMenu={e => { e.stopPropagation(); e.preventDefault(); }}
    >
    </div>;
  }
}

class MenuItem extends React.Component {
  static propTypes = {
    label: PropTypes.any.isRequired,
    shortcut: PropTypes.string,
    icon: PropTypes.element,
    disabled: PropTypes.bool,
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

    if (this.props.disabled) {
      return;
    }

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
      className={'menu-item' + (this.props.disabled ? ' disabled' : '')}
      onClick={this.onItemClick}
      onContextMenu={this.onItemClick}
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
    onItemClick: PropTypes.func,
    onSize: PropTypes.func
  };

  componentDidMount() {
    if (this.props.onSize) {
      let menuDom = ReactDOM.findDOMNode(this);
      let rect = menuDom.getBoundingClientRect();

      this.props.onSize(rect);
    }
  }

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

let globalContextMenu = null;

export default class ContextMenu extends React.Component {
  static propTypes = {
    onClose: PropTypes.func
  };
  // position calculators
  static positioners = {
    BOTTOM_LEFT: function (targetRect, menuRect) {
      return {
        top: targetRect.bottom,
        left: targetRect.left
      };
    },
    RIGHT_BOTTOM: function (targetRect, menuRect) {
      return {
        top: targetRect.bottom - menuRect.height,
        left: targetRect.right
      };
    },
    TOP_RIGHT: function (targetRect, menuRect) {
      return {
        top: targetRect.top - menuRect.height,
        left: targetRect.right - menuRect.width
      };
    },
    LEFT_TOP: function (targetRect, menuRect) {
      return {
        top: targetRect.top,
        left: targetRect.left - menuRect.width
      };
    },
    BOTTOM_RIGHT: function (targetRect, menuRect) {
      return {
        top: targetRect.bottom,
        left: targetRect.right - menuRect.width
      };
    },
    RIGHT_TOP: function (targetRect, menuRect) {
      return {
        top: targetRect.top,
        left: targetRect.right
      };
    },
    TOP_LEFT: function (targetRect, menuRect) {
      return {
        top: targetRect.top - menuRect.height,
        left: targetRect.left
      };
    },
    LEFT_BOTTOM: function (targetRect, menuRect) {
      return {
        top: targetRect.bottom - menuRect.height,
        left: targetRect.left - menuRect.width
      };
    }
  };

  constructor(props) {
    super(props);

    this.state = {
      items: null,
      position: null,
      target: null
    };
  }

  static open(option) {
    if (globalContextMenu === null) {
      throw new Error('ContextMenu isn\'t mounted.');
    }

    globalContextMenu.setState(option);
  }

  componentDidMount() {
    if (globalContextMenu !== null) {
      throw new Error('ContextMenu must be a single object.');
    }

    globalContextMenu = this;

    document.addEventListener('mousedown', this.onMouseDown);
  }

  componentWillUnmount() {
    globalContextMenu = null;

    document.removeEventListener('mousedown', this.onMouseDown);
  }

  getDocumentSize() {
    let body = document.body;
    let html = document.documentElement;
    return {
      width: Math.max(body.scrollWidth, body.offsetWidth, html.clientWidth, html.scrollWidth, html.offsetWidth),
      height: Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)
    };
  }

  onMenuSize = size => {
    let position = this.state.position || (this.state.target ? ContextMenu.positioners.BOTTOM_LEFT : { top: 0, left: 0 });
    let documentSize = this.getDocumentSize();

    if (typeof position === 'function') {
      if (!this.state.target) {
        throw new Error('A target must be specified to determine ContextMenu position.');
      }

      let targetDom = this.state.target instanceof React.Component ? ReactDOM.findDOMNode(this.state.target) : this.state.target;
      let targetRect = targetDom.getBoundingClientRect();

      position = position(targetRect, size);
    }

    position.top = Math.min(documentSize.height - size.height, Math.max(0, position.top));
    position.left = Math.min(documentSize.width - size.width, Math.max(0, position.left));

    this.setState({ position });
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

    this.setState({
      items: null,
      position: null,
      target: null
    });
  }

  render() {
    let style = {};

    if (this.state.position && !(typeof this.state.position === 'function')) {
      style.top = this.state.position.top + 'px';
      style.left = this.state.position.left + 'px';
    }

    return <div className='context-menu' style={style}>
      {this.state.items &&
        <Menu
          items={this.state.items}
          onItemClick={this.closeContextMenu}
          onSize={this.onMenuSize}
        />
      }
    </div>;
  }
}
