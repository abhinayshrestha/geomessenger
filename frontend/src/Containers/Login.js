import React from 'react'
import styled from 'styled-components';
import LocationOn from '@material-ui/icons/LocationOn';
import QuestionAnswerRoundedIcon from '@material-ui/icons/QuestionAnswerRounded';
import FacebookLogin from 'react-facebook-login';
import { authenticate } from '../Store/Actions/AuthActions';
import MainLoader from '../Components/UI/MainLoader';
import { connect } from 'react-redux';
import { ReactComponent  as CurveBg } from '../Assets/curve-bg.svg';

function Login(props) {

    const LoginContainer = styled.div`
         height : 100%;
         width : 100%;
    `
  
    const TopContainer = styled.div`
        height : 30vh;
        background : #0099ff;
        width : 100%;
        position : relative;
        @media (max-width : 768px) {
            height : 40vh;
        }
        .leftHeading {
                    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
                    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
                    box-sizing: border-box;         /* Opera/IE 8+ */
                    color : #fff;
                    display : flex;
                    flex-direction : row;
                    align-items : center; 
                    padding-right : 20px;    
                    position: absolute;
                    top : 90%;
                    left : 50%;
                    transform : translate(-50%,-50%);
                    -webkit-transform : translate(-50%, -50%);
                    @media (max-width : 768px) {
                        top : 50%;
                        width : 100%;
                        padding : 0px 20px;
                    }
                }
            
                .leftHeading div:nth-child(2){
                    line-height: 30px;  
                    @media (max-width : 768px) {
                        line-height: 20px;  
                    } 
                }   
                .head1{
                    font-size : 25px;
                    font-weight : 300;
                    @media (max-width : 768px) {
                        font-size : 17px;
                    }
                } 
                .head2{
                font-size : 14px;
                font-weight : 300;
                @media (max-width : 768px) {
                        font-size : 13px;
                    }
            }
            .facebook-btn{
                    display : block;
                    border : 0;
                    outline : 0;
                    position : absolute;
                    top : 110%;
                    color: #0099ff;
                    background: #fff;
                    height : 30px;
                    padding : 0px 20px;
                    cursor: pointer;
                    border-radius : 3px;
                    box-shadow : 0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12);
                }
    `
      const StyledCurve = styled(CurveBg)`
           position : absolute;
           top: 99%;
           left : 0%;
      `
    const Location = styled(LocationOn)`
           &&& {
             height : 70px;
             width : 70px;
             margin : auto 10px;
             @media (max-width : 768px) {
                height : 50px;
                width : 50px;
             }
           } 
    `
    const MessageIcon = styled(QuestionAnswerRoundedIcon)`
         &&& {
            height : 70px;
             width : 70px;
             margin : auto 10px;      
             @media (max-width : 768px) {
                height : 50px;
                width : 50px;
             }
         }
    `
    const BottomContainer = styled.div`
        color : #0099ff;
         height: 40%;
         width : 100%;
         position : absolute;
         overflow : hidden;
         bottom : 0px;
         .rightHeading {
            -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
            -moz-box-sizing: border-box;    /* Firefox, other Gecko */
            box-sizing: border-box;         /* Opera/IE 8+ */
            display : flex;
            height : 100px;
            align-items : center;
            position : absolute;
            padding-right : 20px;   
            left : 50%;
            top : 50%;
            transform : translate(-50%,-50%);
            @media (max-width : 768px) {
                    top : 20%;
                    width : 100%;
                    padding : 0px 20px;
           }
         }
         .rightHeading:nth-child(1){
             line-height : 30px;
             @media (max-width : 768px) {
                        line-height: 25px;  
             } 
         }
         .righthead1 {
            font-size : 25px;
            font-weight : 300;
            @media (max-width : 768px) {
                        font-size : 17px;
           }
         }
         .righthead2{
            font-size : 14px;
            font-weight : 300;
            @media (max-width : 768px) {
                font-size : 14px;
            }
        }
   
    `


    const responseFacebook = response => {
        const userInfo = {
            name : response.name,
            accessToken : response.accessToken,
            userId : response.id,
            profilePicURL : response.picture && response.picture.data.url
        }
        props.auth(userInfo);
    }
    const loginUI = <LoginContainer>     
                            <TopContainer>
                                    <StyledCurve />
                                    <div className='leftHeading'>
                                        <div><Location/></div>
                                        <div>
                                                <div className='head1'>Get Started</div>
                                                <div className='head2'>Continue by signing in using your facebook account</div>
                                                <FacebookLogin
                                                            appId="YOUR_APP_ID"
                                                            fields="name,email,picture.type(large)"
                                                            cssClass = 'facebook-btn' 
                                                            autoLoad = {false}
                                                            callback={responseFacebook} /> 
                                        </div> 
                                   
                                    </div> 
                                    
                            </TopContainer>
                            <BottomContainer>
                                    <div className='rightHeading'>
                                        <div><MessageIcon/></div>
                                            <div>
                                                    <div className='righthead1'>Connect with the people around you</div>
                                                    <div className='righthead2'>With our geolocation feature you can find the people around you</div>
                                                    <div>
                                                  
                                                    </div>    
                                            </div>    
                                    </div>             
                            </BottomContainer>      
                    </LoginContainer>        
    return props.loading ? <MainLoader /> : loginUI
}

const mapDispatchToProps = dispatch => {
    return {
        auth : userInfo => dispatch(authenticate(userInfo))
    }
}

const mapStateToProps = state => {
    return {
        loading : state.authReducer.loading
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)
