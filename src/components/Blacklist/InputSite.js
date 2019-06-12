import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import colors from '../../constants/colors';
import StyledButton from '../global-styles/StyledButton';

const InputContainer = styled.div`
  display: relative;
  input {
    box-shadow: 0 1px 3px hsla(0, 0%, 0%, 0.1);
    font-size: 1em;
    padding: 0.6em 1em;
    color: ${colors.secondary};
    ::placeholder {
      color: ${colors.light_font};
    }
    :focus {
      outline: none;
    }
    :hover {
      box-shadow: 0 2px 5px hsla(0, 0%, 0%, 0.3);
    }
    border: 2px solid ${colors.secondary};
    border-radius: 3px;
    margin-right: 5px;
  }
`;
const InputSite = props => {
  const { inputSiteValue, handleChange, addSiteToList } = props;
  return (
    <InputContainer>
      <input
        placeholder="example.com"
        value={inputSiteValue}
        onChange={handleChange}
      />
      <StyledButton color={colors.primary} onClick={addSiteToList}>
        ADD
      </StyledButton>
    </InputContainer>
  );
};
InputSite.propTypes = {
  inputSiteValue: PropTypes.string.isRequired,
  handleChange: PropTypes.func.isRequired,
  addSiteToList: PropTypes.func.isRequired,
};

export default InputSite;
