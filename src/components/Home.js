import React, { Component, useState } from "react";
import styled from "styled-components";
import { Spinner, Alert } from "@blueprintjs/core";
import http from "http";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import CountdownInput from "./CountdownInput";
import Countdown from "./Countdown";
import Notification from "./Notification";
import colors from "../constants/colors";
import db from "../constants/db";

const { ipcRenderer } = window.require("electron");

const HomeContainer = styled.div`
  display: block;
  width: 80%;
  margin: auto;
  padding: 70px;
  text-align: center;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const DefaultButton = styled.button`
  margin: 5px;
  display: inline-block;
  border: 1px solid;
  padding: 0.6em 0.5em;
  position: relative;
  z-index: 1;
  transition: all 0.2s ease 0s;
  background: #fff;
  color: ${colors.secondary};
  outline: medium none;
  box-sizing: border-box;
  font-size: 16px;
  width: 120px;
  border-radius: 3px;

  &:after {
    content: "";
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    transition: all 0.2s ease 0s;
    width: 0%;
    z-index: -1;
    box-sizing: border-box;
  }
  &:hover {
    border-color: ${colors.secondary};
    color: white;
    cursor: pointer;
    &:after {
      width: 100%;
      background-color: ${colors.secondary};
    }
  }
`;
const Tagline = styled.p`
  font-size: 1.6rem;
  color: ${colors.secondary};
  margin-bottom: 10px;
  @media (max-width: 480px) {
    margin: 50px 20px;
  }
`;

export default class Home extends Component {
  interval = 0;

  constructor() {
    super();
    this.state = {
      displayProgress: false,
      time: 25,
      timerStarted: false,
      notificationText: "Hello there",
      notificationVisible: false
    };
  }

  componentDidMount() {
    ipcRenderer.on("load", () => {
      this.setState({ displayProgress: true });
    });
    ipcRenderer.on("blockComplete", (event, wwwList) => {
      console.log("list created");
      this.waitForBlock(wwwList);
    });
    ipcRenderer.on("permissionDenied", (event, data) => {
      this.setState({
        displayProgress: false,
        notificationText:
          "You must grant permission from administrator account in order to start blocking.",
        notificationVisible: true
      });
      clearInterval(this.interval);
    });
    ipcRenderer.on("sitesEmpty", () => {
      this.startCountdown();
      this.setState({
        notificationText:
          "You've started a focus session  with an empty blacklist. If you would like to block websites, you must edit your blacklist.",
        notificationVisible: true,
        displayProgress: false
      });
    });
  }

  triggerBlock = () => {
    const sites = db.get("blockedSites").value();
    ipcRenderer.send("block", sites);
  };

  waitForBlock = () => {
    let blockedCount = 0;

    this.interval = setInterval(() => {
      if (navigator.onLine) {
        db.get("blockedSites")
          .value()
          .forEach(website => {
            http
              .get(`http://${website}`, () => {
                console.log(`${website} is not blocked`);
              })
              .on("error", () => {
                blockedCount += 1;
              });
          });
      }
      if (blockedCount === db.get("blockedSites").value().length) {
        this.setState({
          displayProgress: false,
          timerStarted: true
        });
        clearInterval(this.interval);
      }
    }, 3000);
  };

  triggerUnblock = () => {
    ipcRenderer.send("unblock");
  };

  startCountdown = () => {
    this.setState({
      timerStarted: true
    });
  };

  stopCountdown = () => {
    this.triggerUnblock();
    this.setState({
      timerStarted: false
    });
  };

  setTime = value => {
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(value)) {
      this.setState({
        notificationText: "You may only enter numbers",
        notificationVisible: true
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
      notificationVisible
    } = this.state;
    return (
      <HomeContainer>
        {timerStarted ? (
          <div>
            <Countdown
              started={timerStarted}
              minutes={time}
              stopCountdown={this.stopCountdown}
            />
            <EndFocus
              triggerUnblock={this.triggerUnblock}
              toggleTimerStarted={this.toggleTimerStarted}
            />
          </div>
        ) : (
          <div>
            <CountdownInput time={time} setTime={this.setTime} />
            <BeginFocus
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
              notificationVisible: false
            })
          }
          duration={8000}
        />
      </HomeContainer>
    );
  }
}

const BeginFocus = props => {
  let { displayProgress } = props;
  const { triggerBlock } = props;
  return (
    <ButtonContainer>
      <DefaultButton
        onClick={() => {
          displayProgress = !displayProgress;
          triggerBlock();
        }}
        disabled={displayProgress}
      >
        {displayProgress ? <Spinner size={20} /> : "Begin Focus"}
      </DefaultButton>
    </ButtonContainer>
  );
};

const EndFocus = props => {
  const { toggleTimerStarted, triggerUnblock } = props;
  const [alertOpen, setAlertOpen] = useState(false);
  return (
    <div>
      <DefaultButton onClick={() => setAlertOpen(true)} disabled={alertOpen}>
        End Session Early
      </DefaultButton>
      <Alert
        isOpen={alertOpen}
        confirmButtonText="End Early"
        cancelButtonText="Cancel"
        intent="danger"
        onCancel={() => setAlertOpen(false)}
        onConfirm={() => {
          triggerUnblock();
          toggleTimerStarted();
        }}
        canOutsideClickCancel
        transitionDuration={100}
      >
        <p>Are you sure you want to end this session early?</p>
      </Alert>
    </div>
  );
};

BeginFocus.propTypes = {
  displayProgress: PropTypes.bool.isRequired,
  triggerBlock: PropTypes.func.isRequired
};
EndFocus.propTypes = {
  toggleTimerStarted: PropTypes.func.isRequired,
  triggerUnblock: PropTypes.func.isRequired
};
