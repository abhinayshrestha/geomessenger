import React from "react";
import styled from "styled-components";
import testPro from "../../Assets/testprofile.jpg";
import { connect } from "react-redux";

function TopBar(props) {
  const TopBarContainer = styled.div`
    background: #0099ff;
    height: 60px;
    display: flex;
    padding: 0px 20px;
    align-items: center;
  `;
  const ProfilePicContainer = styled.div`
    height: 50px;
    width: 50px;
    border-radius: 50px;
    background: #fff;
    overflow: hidden;
  `;
  const StyledTitle = styled.div`
    flex: 1;
    padding-left: 10px;
    color: #fff;
    font-weight: 400;
  `;
  const RoundedProfilePic = styled.img`
    height: 50px;
    width: 50px;
    object-fit: cover;
  `;
  console.log(props.profilePicURL);

  return (
    <TopBarContainer>
      <ProfilePicContainer>
        <RoundedProfilePic src={props.profilePicURL || testPro} />
      </ProfilePicContainer>
      <StyledTitle>GeoMessenger</StyledTitle>
    </TopBarContainer>
  );
}

const mapStateToProps = (state) => {
  return {
    profilePicURL: state.userReducer.profilePicURL,
  };
};

export default connect(mapStateToProps)(TopBar);
