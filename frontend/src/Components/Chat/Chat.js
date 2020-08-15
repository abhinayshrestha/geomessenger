import React,{ useRef, useEffect, useState } from 'react'
import styled from 'styled-components'
import testPro from '../../Assets/testprofile.jpg';
import ErrorIcon from '@material-ui/icons/Error';
import SendIcon from '@material-ui/icons/Send';
import { connect } from 'react-redux';
import { sendMessage, loadMessage, receiveMessage, setReadStatus } from '../../Store/Actions/ChatAction';
import { withRouter, Link } from 'react-router-dom';
import CircularLoader from '../UI/CircularLoader';
import Button from '@material-ui/core/Button';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import axios from 'axios';
import MessageTemplate from '../UI/MessageTemplate';


function Chat({ chats, send, loadMessages, location, userId, socket, receiveMessage, _id, messageLoader,myPic,
                match, token, setReadStatus, isDesktop }) {

    const [distanceBtw, setDistanceBtw] = useState('');
    const messageInput = useRef(null);   
    const chatView = useRef(null);
    const [showInfo, setShowInfo] = useState(isDesktop); 

    const inputChangeHandler = e => {
        if(e.keyCode  === 13) {
            sendMessage();
        }
    }
    const sendMessage = () => {
        const msgInfo = {
            from  : userId,
            to : location.state.userId,
            message : messageInput.current.value,
            s_id : _id,
            r_id : location.state._id,
            right : true
        }
        if(msgInfo.message.trim().length > 0) {
            send(msgInfo);
            messageInput.current.value='';
        }
        else{
            return;
        }
    }


    const scrollHandler = e => {
        // const element = e.target;
        // if(element.scrollTop < 100) {
        //     const newChats = [...chats]
        //     newChats.unshift({sender : '12312323', receiver : '13123123213', message : 'heey'});
        //     console.log(newChats);
        //     setChatHistory(newChats)
        // }
    }

    useEffect(() => {
        messageInput.current.focus();
        loadMessages(location.state.userId, 0);
    }, [loadMessages, location.state.userId])

    useEffect(() => {
        messageInput.current.focus();
    }, [chats])

    useEffect(() => {
       const socketListenerCallback = data => {
            if(location.state.userId === data.sender){
                receiveMessage(data);
       }
       } 
       if(socket){
           socket.on('private_msg',socketListenerCallback);
       }
       return () => {
            if(socket){
                socket.removeListener('private_msg',socketListenerCallback);
            }
       }
    }, [socket, receiveMessage, location.state.userId])

    useEffect(() => {
        setReadStatus(match.params.userId, token);
    }, [match.params.userId, token, setReadStatus])

    useEffect(() => {
        if(token){
            axios.post('/app/compare-location', { friendId : match.params.userId },
            {
                headers : {
                    'Authorization' : `Bearer ${token}`
                }
            })
            .then(location => {
                const { loc } = location.data;
                const d = calculateDistance(loc[0].location.coordinates[1], loc[0].location.coordinates[0], loc[1].location.coordinates[1],loc[1].location.coordinates[0],'K');
                setDistanceBtw(d);
            })
            .catch(err => {
                console.log(err);
            })
        }
        
    }, [token, match.params.userId])

    return (
        <ChatContainer>
             <ChatTopBar>
                    <div className='topContainer'>
                          <Link to='/inbox'> <BackIcon /> </Link>
                           <img src={ location.state.profilePicURL || testPro } alt='loading...'/> 
                           <label>
                                { location.state.name }
                            </label> 
                         <StyledReportIcon onClick={() => setShowInfo( prev => !prev )}/>
                     </div>
                           
              </ChatTopBar> 
               <ChatCenterBar onScroll = { scrollHandler }>
                       { showInfo && !isDesktop ? null : <div style={{width : '100%', padding : '2px'}}> <div className='messageList' ref={chatView}>
                                {
                                  !messageLoader ?  chats.map((chat, index) => {
                                        return <ChatBox right={chat.sender === userId} key={index}>
                                                        <img src={ location.state.profilePicURL } alt='loading...' className='chatImg'/>
                                                        <div className='chat'>
                                                                {chat.message}         
                                                        </div>   
                                                </ChatBox> 
                                    }) : <CircularLoader />
                                }  
                                <MessageTemplate my={ myPic } other = {location.state.profilePicURL} />
                            </div>
                             <ChatBottomBar>
                             <div className='inputContainer'>
                                 <input onKeyDown={inputChangeHandler} type='text' placeholder='Type Message...' className='messageInput' ref={messageInput}/>
                             </div>  
                             <SendIcon style={{ color : '#0099ff', cursor : 'pointer' }} onClick={sendMessage}/>  
                            </ChatBottomBar> </div>
                             }
                       { showInfo ?  <div className='userProfile'>
                               <UserProfileContainer>
                                        <div className='userImgContainer'>
                                                <img src={location.state.profilePicURL} alt=''/>
                                         </div>
                                         <div className='chatName'>
                                                {location.state.name}
                                         </div>      
                                         <div className='userDistance'>
                                            {distanceBtw} away
                                         </div> 
                                         <div className='clearBtn'>
                                                <ClearChatBtn>
                                                   <DeleteIcon /> Clear
                                                </ClearChatBtn>    
                                          </div>    
                                </UserProfileContainer>    
                         </div>  : null     }
                         
                </ChatCenterBar>    
               
        </ChatContainer>
    )
}

const mapStateToProps = state => {
    return {
        token : state.authReducer.token,
        userId : state.authReducer.userId,
        chats : state.chatReducer.chats,
        socket : state.socketReducer.socket,
        _id : state.authReducer._id,
        messageLoader : state.chatReducer.messageLoader,
        myPic : state.userReducer.profilePicURL
    }
}

const mapDispatchToProps = dispatch => {
    return {
        send : message => dispatch(sendMessage(message)),
        loadMessages : (receiver, pageNo) => dispatch(loadMessage(receiver, pageNo)),
        receiveMessage : msg => dispatch(receiveMessage(msg)),
        setReadStatus : (r_id, token) => dispatch(setReadStatus(r_id, token)),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Chat));

const ChatContainer = styled.div`
        height : 100vh;
        width : 100%;
        position : relative;
        @media (max-width : 960px) {
            height : 100%;
        }
`
const ChatTopBar = styled.div`
        height : 60px;
        -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
        -moz-box-sizing: border-box;    /* Firefox, other Gecko */
        box-sizing: border-box;         /* Opera/IE 8+ */
        border-bottom : 1px solid #ccc;
        width : 100%;
        box-shadow : 0 1px 2px 0 rgba(0, 0, 0, .10);
        position : absolute;
        top: 0;
        left : 0;
        .topContainer {
            display : flex;
            height : 60px;
            justify-content : flex-start;
            align-items : center;
            position : relative;
            img {
                height : 40px;
                width : 40px;
                border-radius : 40px;
                object-fit : cover;
            }
            @media (min-width : 960px) {
                img {
                    margin-left : 15px;
                }
            }
            label {
                margin-left : 10px;
                font-weight : 500;
                color : #424242; 
            }
        }
        `
        const StyledReportIcon = styled(ErrorIcon)`
        &&& { 
            color : #0099ff;
            position : absolute;
            top: 50%;
            right : 20px;
            transform : translateY(-50%);
            height : 30px;
            width : 30px;
            cursor : pointer;
        }
`
const ChatBottomBar = styled.div`
     height : 60px;
     -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
     -moz-box-sizing: border-box;    /* Firefox, other Gecko */
     box-sizing: border-box;         /* Opera/IE 8+ */
     border-top : 1px solid #ccc;
     width : 100%;
     display : flex;
     flex-direction : row;
     padding : 0px 20px;
     align-items : center;
     .inputContainer {
         flex : 1;
         height : 100%;
         -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
         -moz-box-sizing: border-box;    /* Firefox, other Gecko */
         box-sizing: border-box;         /* Opera/IE 8+ */
         padding : 0px 20px;
         display : flex;
         align-items : center;
         .messageInput {
             width : 100%;
             border: 0;
             -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
             -moz-box-sizing: border-box;    /* Firefox, other Gecko */
             box-sizing: border-box;         /* Opera/IE 8+ */
             outline : none;
             font-size : 15px;
             color : #424242;
             resize : none;
             overscroll-behavior : none;
             font-family : 'Roboto';
         }
     }

 `
const ChatCenterBar = styled.div`
    height :  calc(100% - 60px);
    width : 100%;
    position : relative;  
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box;         /* Opera/IE 8+ */
    top : 60px; 
    display : flex;
    flex-direction : row;
    .messageList {
        flex : 1;
        height : calc(100% - 60px);
        -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
        -moz-box-sizing: border-box;    /* Firefox, other Gecko */
        box-sizing: border-box;         /* Opera/IE 8+ */
        display : flex;
        padding: 8px;
        width : 100%;
        flex-direction : column-reverse;
        overflow : auto;
        &::-webkit-scrollbar-track
        {

            background-color: #fff;
            border-radius : 7px;
            :hover{
                background-color: #eee;
            }
        }
        &::-webkit-scrollbar
                {
                    width: 8px;
                    background-color: #fff;
                }
        &::-webkit-scrollbar-thumb
                {
                    border-radius: 10px;
                    background-color : #ccc;
                }
                
    }
    .userProfile {
            min-width : 250px;
            width : 45%;
            -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
            -moz-box-sizing: border-box;    /* Firefox, other Gecko */
            box-sizing: border-box;         /* Opera/IE 8+ */
            border-left : 1px solid #ccc;
            position : relative;
            @media (max-width : 960px) {
                & {
                    width : 100%;
                    min-width : 100%;
                }
            }
        }
`
const ChatBox = styled.div`
         display : flex;
         flex-direction : row;
         justify-content : ${props => !props.right ? 'flex-start' : 'flex-end'};
         margin-bottom : 5px;
         
         .chatImg {
             height : 35px;
             width : 35px;
             border-radius : 35px;
             object-fit : cover;
             display : ${props => !props.right ? 'block' : 'none'};
         }
         .chat{
             margin-left : 5px;
             align-self : center;
             max-width : 80%;
             background : ${props => !props.right ? '#f3f3f3' : '#0099ff'};
             padding : 10px;
             border-radius : 5px;
             font-size : 13px;
             color : ${props => !props.right ? '#757575' : '#fff'};
         }
`
const UserProfileContainer = styled.div`
    position : absolute;
    top : 40%;
    left : 50%;
    transform : translateY(-50%);
    display : flex;
    flex-direction : column;
    align-items : center;
    -webkit-transform : translate(-50%,-50%);
        .userImgContainer {
                height : 120px;
                width : 120px;
                border-radius : 120px;
                overflow : hidden;
                background : #eee; 
                img{
                    height : 120px;
                    width : 120px;
                    object-fit : cover;
                }  
        }
        .chatName {
            text-align: center;
            font-size : 17px;
            color : #111;
            margin-top : 13px;
        }
        .userDistance {
            text-align: center;
            color : #777;
            margin-top : 3px;
            font-size : 13px;
        }
        .clearBtn {
            margin-top : 20px;
        }
`
const ClearChatBtn = styled(Button)`
&&& {
  border : 0;
  width : 200px;
  border-radius : 50px;
  background : #ff3333;
  
  .MuiButton-label {
      text-transform : capitalize;
       font-size : 14px;
      font-weight : 400;
       color : #fff;
  }
}
`
const DeleteIcon = styled(DeleteOutlineIcon)`
    position : absolute;
    left : 13px;
    top : 50%;
    transform : translateY(-50%);
`
const BackIcon = styled(ArrowBackIosIcon)`
    &&& {
        color : #0099ff;
        margin-left : 15px;
    }
    @media (min-width : 960px) {
        &&& {
            display : none;
        }
    }
`

function calculateDistance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 === lat2) && (lon1 === lon2)) {
		return 0;
	}
	else {
		var radlat1 = Math.PI * lat1/180;
		var radlat2 = Math.PI * lat2/180;
		var theta = lon1-lon2;
		var radtheta = Math.PI * theta/180;
		var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
		if (dist > 1) {
			dist = 1;
		}
		dist = Math.acos(dist);
		dist = dist * 180/Math.PI;
		dist = dist * 60 * 1.1515;
		if (unit==="K") { dist = dist * 1.609344 }
		if (unit==="N") { dist = dist * 0.8684 }
		if(dist < 1){
            return Math.round(dist * 1000) + ' meter'
        }
        else {
            return Math.round(dist) + ' KM'
        }
	}
}