import { LOAD_USER_DATA_SUCCESS, UPDATE_SETTING_SUCCESS, HIDE_TOAST,CHANGE_PROFILEPIC_SUCCESS, CHANGE_PROFILEPIC_START, SET_MESSAGE_STATUS
        , LOG_OUT } from '../Actions/ActionTypes';

const initState = {
    name : null,
    userId : null,
    profilePicURL : null,
    distance : null,
    success : false,
    picLoader : false,
    readStatus : false
}

const userReducer = (state = initState, action) => {
    switch(action.type) {
        case LOAD_USER_DATA_SUCCESS :  return {
            ...state,
            name : action.user.name,
            userId : action.user.userId,
            profilePicURL : action.user.profilePicURL,
            distance : action.user.distance,
            readStatus : action.user.unreadStatus
        };
        case UPDATE_SETTING_SUCCESS : 
                return {
                    ...state,
                    name : action.name,
                    distance : action.distance,
                    success : true
                }
        case HIDE_TOAST : 
                return {
                    ...state,
                    success : false
                }
        case CHANGE_PROFILEPIC_START : 
                return {
                    ...state,
                    picLoader : true
                } 
        case CHANGE_PROFILEPIC_SUCCESS : 
               return {
                   ...state,
                   profilePicURL : action.url,
                   picLoader : false
               }        
        case SET_MESSAGE_STATUS : 
                return {
                    ...state,
                    readStatus : action.status
                }     
        case LOG_OUT : return {
            name : null,
            userId : null,
            profilePicURL : null,
            distance : null,
            success : false,
            picLoader : false,
            readStatus : false
        }                
        default : return state;
    }
} 

export default userReducer;