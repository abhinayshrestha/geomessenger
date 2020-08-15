import { FIND_FRIEND_SUCCESS, FIND_FRIEND_ERROR, LOADING_FRIENDS, LOG_OUT,USER_ONLINE, USER_OFFLINE } from '../Actions/ActionTypes';

const initState = {
    friends : [],
    loading : true
}

const friendReducer = (state= initState, action) => {
    switch(action.type) {
        case LOADING_FRIENDS : return {
            ...state,
            loading : true
        }
        case FIND_FRIEND_SUCCESS : return {
            ...state,
            friends : action.data,
            loading : false
        }
        case FIND_FRIEND_ERROR : return {
             ...state,
             loading : false   
        }
        case LOG_OUT : return {
            friends : [],
            loading : true
        }
        case USER_ONLINE : 
                const i = state.friends.findIndex(user => user.userId === action.userId.userId)
                if(i >= 0){
                    const newFriends = [...state.friends];
                    newFriends[i].isOnline = true;
                    return {
                        ...state,
                        friends : newFriends
                    }
                }
                return state;
        case USER_OFFLINE :
                    const ind = state.friends.findIndex(user => user.userId === action.userId.userId)
                    if(ind >= 0){
                        const newFriends = [...state.friends];
                        newFriends[ind].isOnline = false;
                        return {
                            ...state,
                            friends : newFriends
                        }
                    }
                    return state;
        default : return state;
    }
}

export default friendReducer;