import React from 'react';
import './RippleLoader.css';
import styled from 'styled-components';
import testPro from '../../Assets/testprofile.jpg';
import { connect } from 'react-redux';

const RippleLoader = ({ profilePicURL }) => {
          
         const RippleLoaderContainer = styled.div`
                position: relative;
                height : calc(100vh - 60px - 50px);
         `
          return(
                <RippleLoaderContainer>
                    <div className="pulse-button">
                        <img src={ profilePicURL || testPro } alt=''/>
                    </div>
                </RippleLoaderContainer>   
                )     
}

const mapStateToProps = state => {
    return {
        profilePicURL : state.userReducer.profilePicURL
    }
}

export default connect(mapStateToProps)(RippleLoader);