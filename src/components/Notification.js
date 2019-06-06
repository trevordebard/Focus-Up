import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import colors from '../constants/colors';

library.add(faTimes);

const Toast = styled(animated.div)`
  position: fixed;
  bottom: 10px;
  right: 10px;
  margin-left: 10px;
  width: auto;
  min-height: fit-content;
  max-height: 200px;
  height: 40px;
  border: 1px solid ${colors.primary};
  padding: 5px;
  background-color: ${colors.light_grey};
  border-radius: 3px;
  align-items: center;
  display: flex;
  font-size: 1.2em;
`;
const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: ${colors.secondary};
  &:hover {
    color: ${colors.primary};
    cursor: pointer;
  }
`;

export default function Notification({
  message,
  visible,
  handleHide,
  duration = 8000
}) {
  const props = useSpring({
    transform: visible ? 'translateX(0px)' : 'translateX(100px)',
    opacity: visible ? 1 : 0
  });
  useEffect(() => {
    let timeout;
    if (visible === true) {
      timeout = setTimeout(handleHide, duration);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [duration, handleHide, visible]);
  return (
    <Toast style={props}>
      <p style={{ marginRight: '10px' }}>{message}</p>
      <StyledFontAwesomeIcon onClick={() => handleHide()} icon="times" />
    </Toast>
  );
}
