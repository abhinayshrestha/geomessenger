import React,{ useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux';
import { logout } from '../../Store/Actions/AuthActions';
import { updateSetting, hideToast, changeProfilePic } from '../../Store/Actions/UserAction';
import { withRouter } from 'react-router-dom';
import styled from 'styled-components';
import Edit from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import settingStyle from './setting.module.css';
import Slider from '@material-ui/core/Slider';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CircularLoader from '../UI/CircularLoader';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import CircularProgress from '@material-ui/core/CircularProgress';
import { setMessageStatus } from '../../Store/Actions/UserAction';
import msgTone1 from '../../Assets/msgtone1.mp3';
import { USER_ONLINE, USER_OFFLINE } from '../../Store/Actions/ActionTypes';

const theme = createMuiTheme({
    palette : {
        primary: {
            main : '#0099ff'
        }
    }
})

function Setting({ logout, history, name, distance, profilePicURL, updateSetting, showToast, hideToast, changeProfilePic, picLoader,socket,
                 setMessageStatus, userOnline, userOffline }) {

    const [labelDistance, setLabelDistance] = useState();
    const [profilePic, setProfilePic] = useState();
    const [username,setUserName] = useState();
    const [nameError, setNameError] = useState(false);
    const uploadBtn =  useRef(null);
    const audioElem = useRef();
    const nameRef = useRef(null);

    const uploadPic = e => {
        if(e.target.files[0]){
            const tmppath = URL.createObjectURL(e.target.files[0]);
            setProfilePic(tmppath);
            changeProfilePic(e.target.files[0]);
        }
    }

    const usernameHandler = e => {
        setUserName(e.target.value)
    }

    const editNameHandler = () => {
        nameRef.current.focus();
    }

    const logoutHandler = () => {
        history.push('/');
        logout();
      }

    const saveHandler = () => {
        if(username.length > 5){
            updateSetting(labelDistance, username);
            setNameError(false);
        }
        else {
            setNameError(true);
        }
    }  
    const handleClose = () => {
          hideToast();
    }
    useEffect(() => {
         setLabelDistance(distance)
         setProfilePic(profilePicURL);
         setUserName(name);
    }, [distance, profilePicURL, name])

    useEffect(() => {
        const socketListenerCallback = data => {
                if(audioElem.current){
                    audioElem.current.play();
                }
                setMessageStatus(true);
         }
         const socketOnlineUserListener = userId => {
            userOnline(userId);
        }
        const socketOfflineUserListener = userId => {
             userOffline(userId);
         }
         if(socket){
             socket.on('private_msg', socketListenerCallback);
             socket.on('online-status',socketOnlineUserListener);
             socket.on('offline-status',socketOfflineUserListener);
         }
        return () => {
            if(socket){
                socket.removeListener('private_msg',socketListenerCallback);
                socket.removeListener('online-status',socketOnlineUserListener);
                socket.removeListener('offline-status',socketOfflineUserListener);
            }
           }
    }, [socket, setMessageStatus, userOnline, userOffline])

    return (
             (username || username === '') && (labelDistance || labelDistance ==='') ?   
                     <div>
                           <audio className="audio-element" ref={audioElem}>
                                    <source src={msgTone1}></source>
                            </audio>
                        <SettingTopContainer>
                            <NameContainer>
                                <input type='text' ref = {nameRef} value={username} onChange={usernameHandler}/>
                                <StyledEditIcon onClick = {editNameHandler}/>
                            </NameContainer> 
                            {nameError ? <div className='error'>Name must be atleast 6 character</div> : null}                     
                       </SettingTopContainer>    
                        <div className = {settingStyle.distanceContainer}>
                            <label className = {settingStyle.distanceLabel}>
                                    Distance
                            </label>    
                                <div className={settingStyle.distanceFlex}>
                                    <div style={{flex : '1'}}>
                                    <ThemeProvider theme = {theme}>
                                            <Slider 
                                                min = {2}
                                                value={labelDistance} 
                                                onChange={(e, val) => setLabelDistance(val)} aria-labelledby="continuous-slider" 
                                            />
                                        </ThemeProvider>
                                        </div>
                                        <span className={settingStyle.distanceVal}>
                                            {labelDistance} km
                                        </span>    
                                </div>
                        </div>     
                        <AvatarContainer>
                                <div className={'changeImgBtn'}>
                                        <button onClick={() => uploadBtn.current.click()}>
                                                Change Avatar
                                        </button>
                                </div>   
                                <div className='img'>
                                    <img src={profilePic} alt=''/>  
                                    { picLoader ?
                                        <div className='imgLoader'>
                                                <CircularProgress color='secondary' style={{height : '25px', width : '25px'}}/>                 
                                        </div>  : null  
                                     }
                                </div>    
                        </AvatarContainer> 
                        <input type='file' onChange={uploadPic} ref={uploadBtn} style={{display : 'none'}} />    
                        <BtnContainer>
                                <Save onClick={saveHandler}>
                                    Save                          
                                </Save>   
                                <LogoutBtn onClick={logoutHandler} variant="contained" color="secondary">
                                    Log out
                                </LogoutBtn>
                        </BtnContainer> 
                        <StyledSnackbar
                            anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                            }}
                            open={showToast}
                            autoHideDuration={3000}
                            onClose={handleClose}
                            message="Saved Successfully"
                            severity="success"
                            action={
                            <React.Fragment>
                                <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                                <CloseIcon fontSize="small" />
                                </IconButton>
                            </React.Fragment>
                            }
                        />   
                   
                </div> :
                <div style={{marginTop : '30px'}}><CircularLoader /></div>
    )
}

const mapStateToProps = state => {
    return {
        name : state.userReducer.name,
        distance : state.userReducer.distance,
        profilePicURL : state.userReducer.profilePicURL,
        showToast : state.userReducer.success,
        picLoader : state.userReducer.picLoader,
        socket : state.socketReducer.socket
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout : () => dispatch(logout()),
        updateSetting : (distance, name) => dispatch(updateSetting(distance, name)),
        hideToast : () => dispatch(hideToast()),
        changeProfilePic : file => dispatch(changeProfilePic(file)),
        setMessageStatus : status => dispatch(setMessageStatus(status)),
        userOnline : userId => dispatch({ type : USER_ONLINE, userId }),
        userOffline : userId => dispatch({ type : USER_OFFLINE, userId }),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Setting))

const NameContainer = styled.div`
        height : 30px;
        display : flex;
        align-items : center;
        padding : 10px 15px 5px;
        input {
            flex : 1;
            border : 0;
            outline : none;
            font-size : 15px;
            :disabled {
                background : transparent;
            }
        }
`
const StyledEditIcon = styled(Edit)`
&&& {
  margin-left : 10px;  
  color : #0099ff;
  cursor: pointer;
  &:hover {
      opacity : .8;
  }
}
`
const LogoutBtn = styled(Button)`
&&& {
  border : 0;
  width : 200px;
  border-radius : 50px;
  background : #ff3333;
  .MuiButton-label {
      text-transform : capitalize;
        font-size : 14px;
      font-weight : 300;
  }
}
`
const Save = styled(Button)`
  &&& {
      background : #0099ff;
      border : 0;
      width : 200px;
      border-radius : 50px;
      margin : 0px 0px 20px;
      .MuiButton-label {
          text-transform : capitalize;
          font-weight : 300;
          color : #fff;
          font-size : 14px;
      }
  }
`
const SettingTopContainer = styled.div`
        width : 100%;
        .error {
            padding : 0px 15px;
            font-size : 12px;
            color : #ff3333;
            font-weight : 500;
        }
`
const BtnContainer = styled.div`
display : flex;
flex-direction : column;
align-items : center;
margin-top : 20px;
`
const AvatarContainer = styled.div`
        padding : 5px 15px;
        height : 50px;
        display : flex;
        align-items : center;
        .changeImgBtn{
        flex : 1;
            button {
                background : #0099ff;
                border: 0;
                outline : 0;
                color : #fff;
                padding : 5px 10px;
                font-weight : 300;
                border-radius : 3px;
                font-size : 13px;
                cursor : pointer;
                &:hover {
                    opacity : .8;
                }
            }
            }

        .img {
            height : 50px;
            width : 50px;
            position : relative;
            img {
                height : 50px;
                width : 50px;
                object-fit : cover;
            }
            .imgLoader{
                position : absolute;
                top : 0px;
                left : 0px;  
                height : 50px;
                width : 50px;
                background : rgba(255, 255 ,255, 0.5);
                display : flex;
                justify-content : center;
                align-items : center;
            }
        }
`
const StyledSnackbar = styled(Snackbar)`
    &&& {
        left : 5px;
        .MuiSnackbarContent-message {
            font-weight : 300;
        }
    }
      @media (min-width: 600px) {
          &&& {
              left : 5px;
          }
      }
`