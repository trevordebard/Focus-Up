import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import db from '../../constants/db';
import colors from '../../constants/colors';
import InputSite from './InputSite';
import SiteList from './SiteList';

const BlacklistContainer = styled.div`
  padding: 10px;
  margin: 40px 10px;
  height: 100;
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Header = styled.h1`
  color: ${colors.header};
  font-weight: 10;
  margin-bottom: 10px;
`;

class Blacklist extends Component {
  constructor() {
    super();
    this.state = {
      sites: db.get('blockedSites').value(),
      inputSiteValue: '',
    };
  }

  handleChange = event => {
    this.setState({
      inputSiteValue: event.target.value,
    });
  };

  addSiteToList = () => {
    const { inputSiteValue } = this.state;
    if (validURL(inputSiteValue)) {
      db.get('blockedSites')
        .push(inputSiteValue)
        .write();
      this.setState({ inputSiteValue: '' });
    }
  };

  render() {
    const { inputSiteValue, sites } = this.state;
    return (
      <div>
        <BlacklistContainer>
          <Header>Blocked Sites</Header>
          <SiteList sites={sites} />
          <br />
          <InputSite
            handleChange={this.handleChange}
            addSiteToList={this.addSiteToList}
            inputSiteValue={inputSiteValue}
          />
          <Link to="/">Go back</Link>
        </BlacklistContainer>
      </div>
    );
  }
}
function validURL(str) {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return !!pattern.test(str);
}

export default Blacklist;
