import React, { Component } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import db from "../constants/db";
import colors from "../constants/colors";

library.add(faTrashAlt);

const StyledList = styled.ul`
  width: 50%;
  font-size: 1.1em;
`;
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

const StyledFontAwesomeIcon = styled(FontAwesomeIcon)`
  color: ${colors.grey};
  &:hover {
    color: ${colors.primary};
    cursor: pointer;
  }
`;

const BlacklistContainer = styled.div`
  padding: 10px;
  margin: 40px 10px;
  height: 100;
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const InputContainer = styled.div`
  display: relative;
`;

const SiteInput = styled.input`
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
`;
const DefaultButton = styled.button`
  margin: 5px;
  display: inline-block;
  border: 1px solid;
  padding: 0.6em 0.5em;
  position: relative;
  z-index: 1;
  transition: all 0.2s ease 0s;
  background: #fff;
  color: ${colors.primary};
  box-sizing: border-box;
  font-size: 16px;
  width: 80px;
  border-radius: 3px;

  &:after {
    content: "";
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    transition: all 0.2s ease 0s;
    width: 0%;
    z-index: -1;
    box-sizing: border-box;
  }
  &:hover {
    border-color: ${colors.primary};
    color: white;
    cursor: pointer;
    &:after {
      width: 100%;
      background-color: ${colors.primary};
    }
  }
  &:focus {
    outline: none;
  }
`;
const DefaultHeader = styled.h1`
  color: ${colors.header};
  font-weight: 10;
  margin-bottom: 10px;
`;

class Blacklist extends Component {
  constructor() {
    super();
    this.state = {
      sites: db.get("blockedSites").value(),
      inputSiteValue: ""
    };
  }

  handleChange = event => {
    this.setState({
      inputSiteValue: event.target.value
    });
  };

  addSiteToList = () => {
    const { inputSiteValue } = this.state;
    if (validURL(inputSiteValue)) {
      db.get("blockedSites")
        .push(inputSiteValue)
        .write();
      this.setState({ inputSiteValue: "" });
    }
  };

  render() {
    const { inputSiteValue, sites } = this.state;
    const renderSites = sites.map(site => (
      <BlockedSite key={`${site}_${new Date().getTime()}`}>
        <p>{site}</p>
        <StyledFontAwesomeIcon
          icon="trash-alt"
          id={site}
          value="test"
          onClick={e => {
            let item;
            if (e.target.parentNode.tagName.toLowerCase() === "svg") {
              item = e.target.parentNode.id;
            } else if (e.target.parentNode.tagName.toLowerCase() === "li") {
              item = e.target.id;
            }
            if (item !== null) {
              db.get("blockedSites")
                .pull(item)
                .write();
              this.forceUpdate();
            }
          }}
        />
      </BlockedSite>
    ));
    return (
      <div>
        <BlacklistContainer>
          <DefaultHeader>Blocked Sites</DefaultHeader>
          <StyledList>{renderSites}</StyledList>
          <br />
          <InputContainer>
            <SiteInput
              placeholder="example.com"
              value={inputSiteValue}
              onChange={this.handleChange}
            />
            <DefaultButton onClick={this.addSiteToList}>ADD</DefaultButton>
          </InputContainer>
          <br />
          <button
            style={{ display: "none" }}
            type="button"
            onClick={() => {
              db.set("blockedSites", []).write();
              this.forceUpdate();
            }}
          >
            Clear Store
          </button>
          <Link to="/">Go back</Link>
          <br />
        </BlacklistContainer>
      </div>
    );
  }
}
function validURL(str) {
  var pattern = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
    "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
    "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
    "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
    "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
      "(\\#[-a-z\\d_]*)?$",
    "i"
  ); // fragment locator
  return !!pattern.test(str);
}

export default Blacklist;
