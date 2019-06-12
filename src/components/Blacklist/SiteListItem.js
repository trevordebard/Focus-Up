import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import StyledFontAwesomeIcon from '../global-styles/StyledFontAwesomeIcon';
import colors from '../../constants/colors';

library.add(faTrashAlt);
const BlockedSite = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;

  border-bottom: 1px solid ${colors.grey};
  color: ${colors.secondary};
  line-height: 1.7em;
  :last-child {
    border: none;
  }
  :hover {
    background-color: ${colors.light_grey};
  }
`;

function SiteListItem(props) {
  const { site, handleDelete } = props;

  return (
    <BlockedSite key={`${site}_${new Date().getTime()}`}>
      <p>{site}</p>
      <StyledFontAwesomeIcon
        icon="trash-alt"
        id={site}
        value="test"
        colors={{ primary: colors.primary, secondary: colors.grey }}
        onClick={e => handleDelete(e)}
      />
    </BlockedSite>
  );
}

SiteListItem.propTypes = {
  site: PropTypes.string.isRequired,
  handleDelete: PropTypes.func.isRequired,
};

export default SiteListItem;
