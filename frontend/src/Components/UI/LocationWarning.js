import React from 'react'
import styled from 'styled-components';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';


function LocationWarning(props) {
    const WarningContainer = styled.div`
        position: fixed;
        top : 0px;
        left : 0px;
        background : rgba(0, 0, 0, .8);
        height : 100vh;
        width : 100vw;
        z-index : 9999;
    `
    const WarningModal = styled.div`
       position: absolute;
       background : #fff;
       border-radius : 7px;
       padding : 20px;
       width : 300px;
       top : 20px;
       left : 20px;
       display : ${props => {
           if(props.showModal){
               return 'block';
           }
           return 'none'
       }};
       @media (max-width : 601px) {
           width : 70%;
           top: 50%;
           left : 50%;
           transform : translate(-50%,-50%);
       }
    `
    const IconContainer = styled.div`
        width :100%;
        display : flex;
        flex-direction : column;
        align-items : center;
        justify-content : center;
    `
    const WarningMessage = styled.div`
       margin-top : 20px;
       font-size : 16px;
       color : #757575;
       line-height : 20px;
    `
    const MButton = styled.div`
       color : #0099ff;
       margin-top : 10px;
       font-size : 18px;
    `

    return (
        <WarningContainer>
            <WarningModal showModal={!props.showModal}>
                <IconContainer>
                        <QuestionAnswerIcon style={{color : '#0099ff', height : '40px', width : '40px'}}/>
                        <WarningMessage>
                            <span style={{color : '#0099ff', fontSize : '18px'}}>GeoMessenger</span> wants to access your location in order to show people near you. Please 
                            allow the location service of your browser to use GeoMessenger. 
                         </WarningMessage>
                         <MButton>
                                Thankyou
                         </MButton>       
                </IconContainer>    
            </WarningModal>      
        </WarningContainer>    
    )
}

export default LocationWarning
