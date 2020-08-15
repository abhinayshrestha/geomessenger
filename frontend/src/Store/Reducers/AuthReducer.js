import { AUTH_SUCCESS, LOG_OUT, AUTH_START, AUTH_FAIL } from '../Actions/ActionTypes';

const initState = {
    token : null,
    userId : null,
    _id : null,
    loading : false
};

const authReducer = (state = initState, action) => {
     switch(action.type) {
         case AUTH_START : return {
             ...state,
             loading : true
         }
         case AUTH_SUCCESS : return {
             ...state,
             token : action.token,
             userId : action.userId,
             _id : action._id,
             loading : false
         }
         case AUTH_FAIL : return {
             ...state,
             loading : false
         }
         case LOG_OUT : return {
             ...state,
             token : null,
             userId : null
         }
         default : return state
     }
}

export default authReducer;