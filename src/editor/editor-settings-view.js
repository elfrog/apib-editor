import React from 'react';
import PropTypes from 'prop-types';

import Modal from './components/modal';
import PropertyView from './components/property-view';
import Text from './components/property-controls/text';
import Number from './components/property-controls/number';
import Select from './components/property-controls/select';
import CheckBox from './components/property-controls/check-box';

export default class EditorSettingsView extends React.Component {
  static propTypes = {
    action: PropTypes.any.isRequired,
    settings: PropTypes.object.isRequired,
    onChange: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.state = { open: false };
  }

  componentDidMount() {
    this.props.action.on('editor:showSettingsView', this.openModal);
  }

  componentWillUnmount() {
    this.props.action.off('editor:showSettingsView', this.openModal);
  }

  openModal = () => {
    this.setState({ open: true });
  }

  closeModal = () => {
    this.setState({ open: false });
  }

  onSettingChange(key, value) {
    let newSettings = Object.assign({}, this.props.settings, { [key]: value });

    if (this.props.onChange) {
      this.props.onChange(newSettings);
    }
  }

  render() {
    let settings = this.props.settings;

    return <Modal open={this.state.open} header='Settings' onClose={this.closeModal}>
      <PropertyView>
        <Text label='Font' value={settings.font} onChange={value => this.onSettingChange('font', value)} />
        <Number label='Font Size' value={settings.fontSize} onChange={value => this.onSettingChange('fontSize', value)} />
        <Select
          label='Theme'
          options={[
            'Solarized Dark',
            'Solarized Light'
          ]}
          value={settings.theme}
          onChange={value => this.onSettingChange('theme', value)}
        />
        <CheckBox label='Vim Mode' value={settings.vimMode} onChange={value => this.onSettingChange('vimMode', value)} />
      </PropertyView>
    </Modal>;
  }
}
