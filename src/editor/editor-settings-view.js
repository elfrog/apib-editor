import React from 'react';
import PropTypes from 'prop-types';

import Modal from './components/modal';

export default class EditorSettingsView extends React.Component {
  static propTypes = {
    action: PropTypes.any.isRequired
  };

  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  componentDidMount() {
    this.props.action.on('editor.showSettingsView', this.openModal);
  }

  componentWillUnmount() {
    this.props.action.off('editor.showSettingsView', this.openModal);
  }

  openModal = () => {
    this.setState({ open: true });
  }

  closeModal = () => {
    this.setState({ open: false });
  }

  render() {
    return <Modal open={true}>
    </Modal>;
  }
}
