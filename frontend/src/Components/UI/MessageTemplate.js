import React from 'react';
import styled from 'styled-components';
import testPro from '../../Assets/testprofile.jpg';

function MessageTemplate({ my, other }) {
    return (
        <TemplateContainer>
              <div className='joinedImg'>
                    <img src={ my || testPro} alt=''/>
                    <img src={ other || testPro} alt=''/>
               </div>
               <div className='template'>
                    Say "Hi"
                </div>      
        </TemplateContainer>
    )
}

export default MessageTemplate;

const TemplateContainer = styled.div`
    height : 100px;
    width : 100%;
    display : flex;
    flex-direction : column;
    align-items : center;
      .joinedImg {
           height: 70px;
           width : 110px;
           position :relative;
           img {
                -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
                -moz-box-sizing: border-box;    /* Firefox, other Gecko */
                box-sizing: border-box;         /* Opera/IE 8+ */
               height : 70px;
               width : 70px;
               border-radius: 70px;
               object-fit : cover;
               position :absolute;
               border : 2px solid #fff;
               &:nth-child(1) {
                    left : 0px;
               }
               &:nth-child(2) {
                    right : 0px;
               }
           }
      }
      .template {
         font-size : 13px;
         color : #b0bec5;
         margin-top : 7px;
         font-weight : 500;
      }
`
