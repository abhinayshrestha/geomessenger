import React, { useState, useEffect } from 'react'
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import styled from "styled-components";
import { withRouter, NavLink } from 'react-router-dom';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import FavoriteIcon from '@material-ui/icons/Favorite';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import SettingsIcon from '@material-ui/icons/Settings';
import { connect } from 'react-redux';



const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#0099ff',
    },
  },
});

function Navigation({ location, readStatus }) {

    const [index, setIndex] = useState(0);

   
  
    const handleChange = (event, value) => {
          setIndex(value)
      };
      useEffect(() => {
          if(location.pathname.indexOf('/inbox') === 0 ) {
              setIndex(1);
          }
      }, [location]) 

    return (
            <div> 
                <ThemeProvider theme={theme}>
                      <Tabs value={index} indicatorColor="primary" variant="fullWidth" onChange={handleChange} style={{borderBottom : '1px solid #ddd'}}>
                          <StyledTab icon={<FavoriteIcon/>} to='/' component={NavLink} exact/>
                          <MessageTab showreddot = {readStatus ? 1 : 0 } icon={<StyledMessageIcon />} to='/inbox' component={NavLink} />
                          <StyledTab icon={<SettingsIcon/>} to='/setting' component={NavLink} />
                      </Tabs>
                </ThemeProvider>
            </div>
    )
}

const mapStateToProps = state => {
      return {
          readStatus : state.userReducer.readStatus
      }
}

export default  withRouter(connect(mapStateToProps)(Navigation));

const StyledTab = styled(Tab)`
&&&.active {
   color : #0099ff;
}
@media (min-width : 600px) {
      min-width : 0px !important;
  }  
`
const StyledMessageIcon = styled(QuestionAnswerIcon)`
     &&& {
        position : relative;
        &::after {
           content : '';
           position :absolute;
           height : 10px;
           width : 10px;
           background : red;
        }
     }
`

const MessageTab = styled(Tab)`
        &&& {
          position : relative;
          &.active {
              color : #0099ff;
            }
         &::after {
           content : '';
           position : absolute;
           height : 7px;
           width :7px;
           border-radius : 7px;
           border : 2px solid #fff;
           background : #ff3333;
           top : 6px;
           left : 60%;
           transform : translateX(-50%);
           -webkit-transform : translateX(-50%);
           display : ${ props => props.showreddot === 1 ? 'block' : 'none' };
         }   
        }
    @media (min-width : 600px) {
          min-width : 0px !important;
      }  

`

