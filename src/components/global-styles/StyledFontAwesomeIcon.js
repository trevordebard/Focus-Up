import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styled from 'styled-components';

export default styled(FontAwesomeIcon)`
  color: ${props => props.colors.secondary};
  &:hover {
    color: ${props => props.colors.primary};
    cursor: pointer;
  }
`;
