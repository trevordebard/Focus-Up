import styled from 'styled-components';
import colors from '../../constants/colors';

export default styled.button`
  color: ${props => props.color};
  box-shadow: 0 1px 3px hsla(0, 0%, 0%, 0.1);
  font-size: 1em;
  padding: 0.6em 1em;
  border-radius: 3px;
  border: 2px solid ${props => props.color};
  background: linear-gradient(
    to right,
    ${props => props.color} 0%,
    ${props => props.color} 50%,
    #ffffff 50%,
    #ffffff 100%
  );
  background-position: 100% 0;
  background-size: 200% 100%;
  transition: background-position 0.1s;
  :hover {
    box-shadow: inset 0 0 0 2em adjust-hue(blue, 45deg);
    color: #ffffff;
    background-position: 0 0;
    cursor: pointer;
    .bp3-spinner-head {
      stroke: white;
    }
  }
  .bp3-spinner-head {
    stroke: ${colors.primary};
  }
  :focus {
    outline: none;
  }
  min-width: 86px;
  margin: 1em 0;
`;
