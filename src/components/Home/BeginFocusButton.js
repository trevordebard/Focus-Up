import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Spinner } from '@blueprintjs/core';
import StyledButton from '../global-styles/StyledButton';
import colors from '../../constants/colors';

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const BeginFocusButton = props => {
  let { displayProgress } = props;
  const { triggerBlock } = props;
  return (
    <ButtonContainer>
      <StyledButton
        color={colors.secondary}
        onClick={() => {
          displayProgress = !displayProgress;
          triggerBlock();
        }}
        disabled={displayProgress}
      >
        {displayProgress ? <Spinner size={20} /> : 'Begin Focus'}
      </StyledButton>
    </ButtonContainer>
  );
};

BeginFocusButton.propTypes = {
  displayProgress: PropTypes.bool.isRequired,
  triggerBlock: PropTypes.func.isRequired,
};

export default BeginFocusButton;
