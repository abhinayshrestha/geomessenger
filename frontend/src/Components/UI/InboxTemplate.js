import React from 'react'
import styled from 'styled-components';
import templateImg from '../../Assets/message-template-img.png'

function InboxTemplate() {
    return (
        <TemplateContainer>
                <img src={templateImg} alt=''/>
                <div className='placeHolder'>
                      You don't have any conversation yet. Start now by searching people near you.
                 </div>   
        </TemplateContainer>
    )
}

export default InboxTemplate;

const TemplateContainer = styled.div`
     position :absolute;
     left : 50%;
     top : 45%;
     transform : translate(-50%, -50%);
     -webkit-transform : translate(-50%, -50%);
     text-align : center;
     img {
         width : 200px;
         object-fit : contain;
     }
     .placeHolder {
         color : #b0bec5;   
         font-size : 15px;
         
         @media (max-width : 601px) {
            font-size : 13px;
         }
     }
`
