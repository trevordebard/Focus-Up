import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SiteListItem from './SiteListItem';
import db from '../../constants/db';

const StyledList = styled.ul`
  width: 50%;
  font-size: 1.1em;
`;
function useForceUpdate() {
  const [value, set] = useState(true);
  // toggle the state to force render
  return () => set(!value);
}

function SiteList(props) {
  const { sites } = props;
  const forceUpdate = useForceUpdate();
  const handleDelete = e => {
    let item;
    if (e.target.parentNode.tagName.toLowerCase() === 'svg') {
      item = e.target.parentNode.id;
    } else if (e.target.parentNode.tagName.toLowerCase() === 'li') {
      item = e.target.id;
    }
    if (item !== null) {
      db.get('blockedSites')
        .pull(item)
        .write();
      forceUpdate();
    }
  };
  return (
    <StyledList>
      {sites.map(site => (
        <SiteListItem
          key={`${site}_${Date.now()}`}
          handleDelete={handleDelete}
          site={site}
        />
      ))}
    </StyledList>
  );
}

SiteList.propTypes = {
  sites: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SiteList;
