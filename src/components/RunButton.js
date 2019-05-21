/* eslint react/destructuring-assignment: 0 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { store } from './Blacklist';

const { ipcRenderer } = window.require('electron');

class RunButton extends Component {
  componentDidMount() {
    console.log('mounted');
    ipcRenderer.on('load', () => {
      console.log('loaddd');
      this.props.toggleLoad();
    });
  }

  triggerBlock = () => {
    const sites = store.get('blockedList');
    ipcRenderer.send('block', sites);
    this.props.toggleLoad();
    setTimeout(() => {
      this.props.toggleLoad();
    }, 10000);
  };

  triggerUnblock = () => {
    ipcRenderer.send('unblock');
    this.props.toggleLoad();
    setTimeout(() => {
      this.props.toggleLoad();
    }, 10000);
  };

  render() {
    const { title, block } = this.props;
    return (
      <div>
        <input
          type="button"
          onClick={block ? this.triggerBlock : this.triggerUnblock}
          value={title}
        />
      </div>
    );
  }
}

RunButton.propTypes = {
  title: PropTypes.string.isRequired,
  block: PropTypes.bool.isRequired,
  toggleLoad: PropTypes.func.isRequired,
};

export default RunButton;
