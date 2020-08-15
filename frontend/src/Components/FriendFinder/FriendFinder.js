import React, { useEffect, useRef } from 'react'
import RippleLoader from '../UI/RippleLoader';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import testPro from '../../Assets/testprofile.jpg';
import { Typography } from '@material-ui/core';
import { connect } from 'react-redux';
import { loadFriends } from '../../Store/Actions/FriendFinderActions';
import RefreshIcon from '@material-ui/icons/Refresh';
import { Link } from 'react-router-dom';
import { setMessageStatus } from '../../Store/Actions/UserAction';
import msgTone1 from '../../Assets/msgtone1.mp3';
import { USER_ONLINE, USER_OFFLINE } from '../../Store/Actions/ActionTypes';

function FriendFinder({ findFriends, token, lng, lat, loading, friends, socket, setMessageStatus, userOnline, userOffline  }) {

   const audioElem = useRef();

    const reloadFriends = () => {
        findFriends(lng, lat, token);
    }
    useEffect(() => {
        findFriends(lng, lat, token);
    }, [lng,lat,token,findFriends])

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
        <React.Fragment>
             <audio className="audio-element" ref={audioElem}>
                     <source src={msgTone1}></source>
              </audio>
            {
             loading ?  <RippleLoader /> 
                            :  
                        <UserIconContainer>
                            {friends.length > 0 ?
                                     <div>
                                         <div style={{fontSize : '13px', color:'#b0bec5', textAlign : 'center',  paddingTop:'5px'}}>
                                             People Near You
                                         </div>    
                                     <Grid container>
                                    { 
                                        friends.map(friend => {
                                        return <StyledGrid item xs={3} sm={2} lg={3} md={3} key={friend._id} isonline={friend.isOnline ? 1 : 0}>
                                                   <StyledLink to={{pathname : `/inbox/${friend._id}`, state : {...friend}}}> 
                                                        <div className={'userImg'}>
                                                            <img src={friend.profilePicURL || testPro}  alt=''/>
                                                            <div className='onlineStatus'>
                                                            </div> 
                                                         </div>   
                                                        <StyledUserName component='div'>
                                                            {friend.name.split(" ")[0]} <br/>
                                                            {friend.distance}
                                                        </StyledUserName>   
                                                     
                                                   </StyledLink> 
                                                </StyledGrid>
                                        })
                                    }
                                    </Grid>
                                    </div>   
                                    :
                                   <RetryContainer>
                                        <div>
                                            Not Found<br/>
                                            <span style={{color : '#757575', fontSize : '13px'}}>Change the distance setting and retry.</span>
                                         </div>   
                                         <StyledRefreshIcon onClick={reloadFriends}/>
                                   </RetryContainer>     
                            }
                        </UserIconContainer>  
               }
                 
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    return {
        token : state.authReducer.token,
        friends : state.friendsReducer.friends,
        loading : state.friendsReducer.loading,
        socket : state.socketReducer.socket
    }
}

const mapDispatchToProps = dispatch => {
    return {
        findFriends : (lng,lat,token) => dispatch(loadFriends(lng,lat,token)),
        setMessageStatus : status => dispatch(setMessageStatus(status)),
        userOnline : userId => dispatch({ type : USER_ONLINE, userId }),
        userOffline : userId => dispatch({ type : USER_OFFLINE, userId }),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendFinder)

const UserIconContainer = styled.div`
width : 100%;
`
const StyledGrid = styled(Grid)`
display : flex;
cursor: pointer;
flex-direction : column;
padding : 10px;
position: relative;
.userImg {
     width : 100%;
     border-radius : 60px;
     position : relative;
     img{
        width : 60px;
        height : 60px;
        border-radius : 60px;
        object-fit : cover;
     }
     .onlineStatus {
            position: absolute;
            z-index : 1;
            height : 13px;
            width : 13px;
            border-radius : 13px;
            border : 2px solid #fff;
            background : ${ props =>{ console.log(props); return props.isonline === 1 ? '#00FF00' : '#ccc'} } ;
            right: 7px;
            bottom : 0px;
        }
}
`
const StyledUserName = styled(Typography)`
&&& {
    font-size : 13px;
    text-align : center;
    color : #757575;
    height : 20px;
    width : 100%;
    line-height : 15px;
    margin-top : 5px;
}
`
const StyledLink = styled(Link)`
     text-decoration : none;
     position:relative;
`
const RetryContainer = styled.div`
position: relative;
left : 50%;
width : 100%;
transform : translateX(-50%);
-webkit-transform : translateX(-50%);
display : flex;
margin-top : 50px;
flex-direction : column;
color : #000;
text-align : center;
align-items : center;
`

const StyledRefreshIcon = styled(RefreshIcon)`
 &&& {
     color : #0099ff;
     margin-top : 5px;
     height : 40px;
     width : 40px;
     cursor: pointer;
 }
`
