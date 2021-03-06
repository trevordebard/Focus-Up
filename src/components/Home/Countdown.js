import React, { Component } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import colors from '../../constants/colors';
import EndFocusButton from './EndFocusButton';

const Minutes = styled.p`
  color: ${colors.primary};
  font-size: 1.6em;
  font-weight: 530;
`;
const Countdown = styled.p`
  font-size: 5em;
  font-weight: 500;
  color: ${colors.primary};
  border-style: none;
  text-align: center;
  margin: 0;
`;
const TimerContainer = styled.div`
  width: 100%;
  margin: auto;
`;

export default class Timer extends Component {
  interval = 0;

  constructor(props) {
    super(props);
    const { started, minutes } = this.props;
    this.state = {
      min: minutes - 1,
      sec: 59,
      timerActive: started,
    };
  }

  componentDidMount() {
    this.interval = setInterval(this.begin, 1000);
  }

  begin = () => {
    const { timerActive, sec, min } = this.state;
    const { stopCountdown } = this.props;
    if (timerActive) {
      if (sec > 0) {
        this.setState({ sec: sec - 1 });
      } else if (min > 0) {
        this.setState({ sec: 59, min: min - 1 });
      } else {
        clearInterval(this.interval);
        this.setState({ timerActive: false });
        stopCountdown();
      }
    }
  };

  render() {
    const { min, sec } = this.state;
    const { triggerUnblock, toggleTimerStarted } = this.props;
    const time = `${min}:${`0${sec}`.slice(-2)}`;
    return (
      <TimerContainer>
        <Countdown>{time}</Countdown>
        <Minutes>Minutes</Minutes>
        <EndFocusButton
          triggerUnblock={triggerUnblock}
          toggleTimerStarted={toggleTimerStarted}
        />
      </TimerContainer>
    );
  }
}

Timer.propTypes = {
  started: PropTypes.bool.isRequired,
  minutes: PropTypes.number,
  stopCountdown: PropTypes.func.isRequired,
  toggleTimerStarted: PropTypes.func.isRequired,
  triggerUnblock: PropTypes.func.isRequired,
};
Timer.defaultProps = {
  minutes: 25,
};
