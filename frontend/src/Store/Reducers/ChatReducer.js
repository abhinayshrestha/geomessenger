import { SEND_MESSAGE_SUCCESS, LOADING_MESSAGE, RECEIVE_MESSAGE, LOAD_INBOX_SUCCESS, LOAD_MESSAGE_SUCCESS, UPDATE_INBOX_SUCCESS,
      UPDATE_INBOX_SUCCESS_NEW, SET_READ_STATUS, LOG_OUT, USER_ONLINE, USER_OFFLINE } from '../Actions/ActionTypes';

const initState = {
    chats : [],
    inboxList : [],
    messageLoader : false
}

const chatReducer = (state = initState, action) => {
    switch (action.type) {
        case LOADING_MESSAGE : return {
            ...state,
            messageLoader : true
        }
        case LOAD_MESSAGE_SUCCESS : return {
            ...state,
            chats : [...action.chat.chat],
            messageLoader : false
        }
        case SEND_MESSAGE_SUCCESS :
            const newChats = [...state.chats];
             newChats.unshift(action.message);
            return {
            ...state,
            chats : [...newChats]
        }
        case RECEIVE_MESSAGE :  
                const updatedChats = [...state.chats];
                updatedChats.unshift(action.message);
                    return {
                    ...state,
                    chats : [...updatedChats]
                }
        case LOAD_INBOX_SUCCESS : return {
            ...state,
            inboxList : action.inbox
        }     
        case UPDATE_INBOX_SUCCESS : 
                   const newInbox = [...state.inboxList];
                   newInbox[action.inboxIndex].lastMsg = action.message;
                   newInbox[action.inboxIndex].read = action.read;
                   newInbox[action.inboxIndex].updated_at = action.updated_at;
                    return {
                        ...state,
                        inboxList : newInbox
                    } 
        case UPDATE_INBOX_SUCCESS_NEW : 
                    return {
                        ...state,
                        inboxList : state.inboxList.concat(action.inboxInfo)    
                    }            
        case SET_READ_STATUS : 
               if(state.inboxList.length > 0) {
                    const index = state.inboxList.findIndex(list => list._id === action.r_id );
                    if(index >= 0){
                        const updatedInbox = [...state.inboxList];
                        updatedInbox[index].read = true;
                        return {
                            ...state,
                            inboxList : updatedInbox  
                        }
                    } 
               }
               return state;  
     case USER_ONLINE : 
               const oni = state.inboxList.findIndex(user => user.userId === action.userId.userId)
               if(oni >= 0){
                   const newInboxList = [...state.inboxList];
                   newInboxList[oni].isOnline = true;
                   return {
                       ...state,
                       inboxList : newInboxList
                   }
               }
               return state;
       case USER_OFFLINE :
                   const offi = state.inboxList.findIndex(user => user.userId === action.userId.userId)
                   if(offi >= 0){
                       const newInboxList = [...state.inboxList];
                       newInboxList[offi].isOnline = false;
                       return {
                           ...state,
                           inboxList : newInboxList
                       }
                   }
                   return state;
        case LOG_OUT :
                    return {
                        chats : [],
                        inboxList : [],
                        messageLoader : false
                    }                
        default : return state;
    }
}

export default chatReducer;