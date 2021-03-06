import React, { Component } from 'react';
import styled from 'styled-components';
import http from 'http';
import { Link } from 'react-router-dom';
import CountdownInput from './CountdownInput';
import Countdown from './Countdown';
import Notification from './Notification';
import db from '../../constants/db';
import BeginFocusButton from './BeginFocusButton';
import defaults from '../../constants/defaults';

const { ipcRenderer } = window.require('electron');

const HomeContainer = styled.div`
  display: block;
  width: 80%;
  margin: auto;
  padding: 70px;
  text-align: center;
`;

export default class Home extends Component {
  interval = 0;

  constructor() {
    super();
    this.state = {
      displayProgress: false,
      time: defaults.COUNTDOWN,
      timerStarted: false,
      notificationText: defaults.NOTIF_TEXT,
      notificationVisible: false,
    };
  }

  componentDidMount() {
    ipcRenderer.on('load', () => {
      this.setState({ displayProgress: true });
    });
    ipcRenderer.on('blockComplete', (event, wwwList) => {
      console.log('list created');
      this.waitForBlock(wwwList);
    });
    ipcRenderer.on('permissionDenied', () => {
      this.setState({
        displayProgress: false,
        notificationText:
          'You must grant permission from administrator account in order to start blocking.',
        notificationVisible: true,
      });
      clearInterval(this.interval);
    });
    ipcRenderer.on('sitesEmpty', () => {
      this.startCountdown();
      this.setState({
        notificationText:
          "You've started a focus session  with an empty blacklist. If you would like to block websites, you must edit your blacklist.",
        notificationVisible: true,
        displayProgress: false,
      });
    });
  }

  triggerBlock = () => {
    const sites = db.get('blockedSites').value();
    ipcRenderer.send('block', sites);
  };

  waitForBlock = () => {
    let blockedCount = 0;

    this.interval = setInterval(() => {
      if (navigator.onLine) {
        db.get('blockedSites')
          .value()
          .forEach(website => {
            http
              .get(`http://${website}`, () => {
                console.log(`${website} is not blocked`);
              })
              .on('error', () => {
                blockedCount += 1;
              });
          });
      }
      if (blockedCount === db.get('blockedSites').value().length) {
        this.setState({
          displayProgress: false,
          timerStarted: true,
        });
        clearInterval(this.interval);
      }
    }, 3000);
  };

  triggerUnblock = () => {
    ipcRenderer.send('unblock');
  };

  startCountdown = () => {
    this.setState({
      timerStarted: true,
    });
  };

  stopCountdown = () => {
    this.triggerUnblock();
    this.setState({
      timerStarted: false,
    });
  };

  setTime = value => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(value)) {
      this.setState({
        notificationText: 'You may only enter numbers',
        notificationVisible: true,
      });
    } else {
      this.setState({ time: value, notificationVisible: false });
    }
  };

  toggleTimerStarted = () => {
    const { timerStarted } = this.state;
    this.setState({ timerStarted: !timerStarted });
  };

  render() {
    const {
      displayProgress,
      time,
      timerStarted,
      notificationText,
      notificationVisible,
    } = this.state;
    return (
      <HomeContainer>
        {timerStarted ? (
          <Countdown
            started={timerStarted}
            minutes={time}
            stopCountdown={this.stopCountdown}
            triggerUnblock={this.triggerUnblock}
            toggleTimerStarted={this.toggleTimerStarted}
          />
        ) : (
          <div>
            <CountdownInput time={time} setTime={this.setTime} />
            <BeginFocusButton
              displayProgress={displayProgress}
              triggerBlock={this.triggerBlock}
            />
            <Link to="/blacklist">edit blacklist</Link>
          </div>
        )}
        <Notification
          message={notificationText}
          visible={notificationVisible}
          handleHide={() =>
            this.setState({
              notificationVisible: false,
            })
          }
          duration={defaults.NOTIF_DURATION}
        />
      </HomeContainer>
    );
  }
}
