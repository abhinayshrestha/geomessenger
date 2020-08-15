import React, { useEffect, useRef } from 'react'
import styled from 'styled-components';
import testPro from '../../Assets/testprofile.jpg';
import { withRouter, NavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import { loadInbox, updateInbox } from '../../Store/Actions/ChatAction';
import { setMessageStatus } from '../../Store/Actions/UserAction';
import msgTone2 from '../../Assets/msgtone2.mp3';
import { USER_ONLINE, USER_OFFLINE } from '../../Store/Actions/ActionTypes';
import InboxTemplate from '../UI/InboxTemplate';

function Inbox({ loadInbox, inbox, socket, updateInbox, location, setMessageStatus, userOnline, userOffline }) {
  
   const audioElem = useRef();

    useEffect(() => {
         loadInbox();
    }, [loadInbox]);

    useEffect(() => {
        const socketListenerCallback = data => {
            if(audioElem.current){
                audioElem.current.play();
            }
            updateInbox(data.sender, data.message, data.updated_at,false);
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
   }, [socket, updateInbox, userOffline, userOnline])
  
   useEffect(() => {
       setMessageStatus(false);
   }, [setMessageStatus])

    return (<InboxContainer>
              <audio className="audio-element" ref={audioElem}>
                     <source src={msgTone2}></source>
              </audio>
        { inbox.length > 0 ?
            inbox.sort((a, b) => -a.updated_at.localeCompare(b.updated_at) ).map(list => {
                return <InboxList
                             seen = {list.read  || (location.state && location.state.userId === list.userId)  ? 1 : 0} 
                                  key={list._id} 
                                  to={{pathname : `/inbox/${list._id}`, state : {...list}}}
                                  isonline = {list.isOnline ? 1 : 0}>
                            <div className='imgCover'>
                                    <img src={ list.profilePicURL || testPro} alt=''/>
                                    <div className='onlineStatus'></div>    
                            </div>   
                            <div className='messageInfo'>
                                    <span style={{fontSize : '15px', color : '#000'}}>{list.name}</span>
                                    <div>{list.lastMsg}</div>
                            </div>   
                            <div className='blueDot'>

                             </div>    
                        </InboxList>
            })
            :
            <InboxTemplate />
        }
       
       </InboxContainer>
    )
}

const mapStateToProps = state => {
    return {
        inbox : state.chatReducer.inboxList,
        socket : state.socketReducer.socket
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadInbox : () => dispatch(loadInbox()),
        updateInbox : (userId, msg, updated_at, read) => dispatch(updateInbox(userId, msg, updated_at, read)),
        setMessageStatus : status => dispatch(setMessageStatus(status)),
        userOnline : userId => dispatch({ type : USER_ONLINE, userId }),
        userOffline : userId => dispatch({ type : USER_OFFLINE, userId }),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Inbox))

const InboxContainer = styled.div`
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box;         /* Opera/IE 8+ */
    height : calc(100% - 55px);
`

const InboxList = styled(NavLink)`
text-decoration : none;
height : 60px;
display : flex;
flex-direction : row;
-webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
-moz-box-sizing: border-box;    /* Firefox, other Gecko */
box-sizing: border-box;         /* Opera/IE 8+ */
align-items : center;
cursor: pointer;
margin : 5px 10px 0px;
padding-left : 10px;
border-radius : 5px;
position : relative;
.imgCover {
     height : 50px;
     position: relative;
     img {
         height : 50px;
         width : 50px;
         border-radius : 50px;
         object-fit : cover;
     }   
     .onlineStatus {
           height : 10px;
           width : 10px;
           border-radius:10px;
           background :  ${props => props.isonline === 1 ? '#00FF00' : '#ccc'};
           position: absolute;
           right: 0px;
           bottom : 0px;
           border : 2px solid #fff;
     }
}
.messageInfo {
    margin-left : 7px;
    font-size : 13px;
    color : #aaa;
    flex : 1;
    font-weight : ${props => props.seen === 1 ? 'normal' : 'bolder'};
    div {
        width: 150px;
        white-space: nowrap;
        text-overflow : ellipsis;
        overflow: hidden;
        font-weight : ${props => props.seen === 1 ? 'normal' : 'bolder'}
    }
}
.blueDot {
    display : ${props => props.seen === 1 ? 'none' : 'block'};
    position : absolute;
    height : 10px;
    width : 10px;
    border-radius : 10px;
    background : #0099ff;
    top : 50%;
    transform : translateY(-50%);
    right : 10px;
}
&.active {
    background : #eee;
}
`