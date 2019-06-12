import React, { useState } from 'react';
import { Alert } from '@blueprintjs/core';
import PropTypes from 'prop-types';
import StyledButton from './global-styles/StyledButton';
import colors from '../constants/colors';

const EndFocus = props => {
  const { toggleTimerStarted, triggerUnblock } = props;
  const [alertOpen, setAlertOpen] = useState(false);
  return (
    <div>
      <StyledButton
        color={colors.secondary}
        onClick={() => setAlertOpen(true)}
        disabled={alertOpen}
      >
        End Session Early
      </StyledButton>
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

EndFocus.propTypes = {
  toggleTimerStarted: PropTypes.func.isRequired,
  triggerUnblock: PropTypes.func.isRequired,
};
export default EndFocus;
