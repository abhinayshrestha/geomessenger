import { SEND_MESSAGE_SUCCESS, RECEIVE_MESSAGE, LOAD_INBOX_SUCCESS, LOAD_INBOX_FAIL, LOADING_INBOX,
         LOADING_MESSAGE, LOAD_MESSAGE_SUCCESS, UPDATE_INBOX_SUCCESS, UPDATE_INBOX_SUCCESS_NEW, SET_READ_STATUS } from './ActionTypes';
import axios from 'axios';


const sendMessageSuccess = (message) => {
    return {
        type : SEND_MESSAGE_SUCCESS,
        message : message
    }
}

export const sendMessage = (message) => {
    return (dispatch, getState) => {
        const chat = {
            sender : message.from,
            receiver : message.to,
            message : message.message
        }
        dispatch(sendMessageSuccess(chat))
        axios.post(`/chat/${message.to}`,{ message : message.message, s_id : message.s_id, r_id : message.r_id },{
            headers : {
                'Authorization' : `Bearer ${getState().authReducer.token}`
            }
        })
        .then(_ => {
             dispatch(updateInbox(message.to , message.message, new Date().toISOString(), true)); 
        })
        .catch(err => {
            console.log(err);
        })
    }  
} 
export const receiveMessage = message => {
    return {
        type : RECEIVE_MESSAGE,
        message : message
    }
}

const loadingInbox = () => {
    return {
        type : LOADING_INBOX
    }
}

const loadInboxSuccess = inbox => {
    return {
        type : LOAD_INBOX_SUCCESS,
        inbox : inbox
    }
}

const loadInboxFail = () => {
    return {
        type : LOAD_INBOX_FAIL,
    }
}

export const loadInbox = () => {
    return (dispatch, getState) => {
            dispatch(loadingInbox());
            axios.get('/app/inbox', {
                headers : {
                    'Authorization' : `Bearer ${getState().authReducer.token}`
                }
            })
            .then(inbox => {
                const inboxList = [...inbox.data.sortedInbox];
                const updatedInbox = inboxList.map(inbox => {
                    return {
                        _id : inbox.r_id._id,
                        userId : inbox.r_id.userId,
                        profilePicURL : inbox.r_id.profilePicURL,
                        name : inbox.r_id.name,
                        lastMsg : inbox.lastMsg,
                        read : inbox.read,
                        updated_at : inbox.updated_at,
                        isOnline : inbox.r_id.isOnline
                    }
                })
                dispatch(loadInboxSuccess(updatedInbox))
            })
            .catch(err => {
                dispatch(loadInboxFail());
                console.log(err);
            })
    }
}
const loadingMessage = () => {
    return {
        type : LOADING_MESSAGE
    }
}

const loadMessageSuccess = chat => {
    return {
        type : LOAD_MESSAGE_SUCCESS,
        chat : chat
    }
}
export const loadMessage = (receiver, pageNo) => {
    return (dispatch, getState) => {
        dispatch(loadingMessage());
        axios.put(`/chat/${getState().authReducer._id}`,{ receiver : receiver },{
            headers : {
                'Authorization' : `Bearer ${getState().authReducer.token}`
            }
        })
        .then(chat => {
            dispatch(loadMessageSuccess(chat.data))
        })
        .catch(err => {
            console.log(err);
        })
    }
}

const updateInboxSuccess = (inboxIndex, message, updated_at, read) => {
    return {
        type : UPDATE_INBOX_SUCCESS,
        inboxIndex : inboxIndex,
        message : message,
        updated_at : updated_at,
        read : read
    }
}

const updateInboxSuccessNew = inboxInfo => {
    return {
        type : UPDATE_INBOX_SUCCESS_NEW,
        inboxInfo : inboxInfo
    }
} 

export const updateInbox = (sen_id, msg, updated_at, read) => {
    return (dispatch, getState) => {
        const inboxList = [...getState().chatReducer.inboxList];
        const index = inboxList.findIndex(list => list.userId === sen_id)
        if(index >= 0){
            dispatch(updateInboxSuccess(index, msg, updated_at, read))
        }
        else{
            axios.post('/app/get-user-info',
            { userId : sen_id },
            {
                headers : {
                    'Authorization' : `Bearer ${getState().authReducer.token}`
                }
            })
            .then(user => {
                const inboxInfo = {
                    name : user.data.user.name,
                    _id : user.data.user._id,
                    userId : user.data.user.userId,
                    profilePicURL : user.data.user.profilePicURL,
                    lastMsg : msg,
                    read : read,
                    updated_at : updated_at,
                }
                dispatch(updateInboxSuccessNew(inboxInfo))
            })
            .catch(err => {
                console.log(err);
            })
        }
    }
}

export const setReadStatus = (r_id, token) => {
    return dispatch => {
        dispatch({ type : SET_READ_STATUS, r_id : r_id }); 
        axios.post('/app/set-inbox-status',
            { r_id : r_id },
            {
                headers : {
                    'Authorization' : `Bearer ${token}`
                }
            })
        .then(_ => {
        })
        .catch(err => {
            console.log(err);
        })
    }
}