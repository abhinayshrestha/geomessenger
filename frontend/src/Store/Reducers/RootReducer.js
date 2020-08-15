import authReducer from './AuthReducer';
import { combineReducers } from 'redux';
import userReducer from './UserReducer';
import friendsReducer from './FriendsReducer';
import chatReducer from './ChatReducer';
import socketReducer from './socketConnection';

const rootReducer = combineReducers({
    authReducer,
    userReducer,
    friendsReducer,
    chatReducer,
    socketReducer
})

export default rootReducer;