import * as actionTypes from './ActionTypes';

import axios from 'axios';

const authStart = () => {
     return {
         type : actionTypes.AUTH_START
     }
}

const authSuccess = (token, userId, _id) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userId', userId);
    localStorage.setItem('_id', _id); 
    return {
        type : actionTypes.AUTH_SUCCESS,
        token : token,
        userId : userId,
        _id : _id
    }
}

const authFail = err => {
    return {
        type : actionTypes.AUTH_FAIL
    }
}

export const logout = _ => {
   localStorage.removeItem('token');
   localStorage.removeItem('userId'); 
   localStorage.removeItem('_id'); 
   localStorage.removeItem('pageNo');
   return {
       type : actionTypes.LOG_OUT
   }
}

export const authenticate = userInfo => {
    return dispatch => {
        dispatch(authStart());
        axios.post('/auth', userInfo)
        .then(data => {
           const { token } = data.data;
           const { userId } = data.data.user;
           const { _id } = data.data.user;
           if(data.data.status === 'new'){
               axios.post('/app/create-inbox', { userId : userId })
               .then( data =>  console.log(data))
               .catch(err => console.log(err));
           }
            dispatch(authSuccess(token, userId, _id))
            console.log();
        })
        .catch(err => {
            console.log(err);
            dispatch(authFail());
        })
    }
}

export const checkAuth = () => {
     return dispatch => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        const _id = localStorage.getItem('_id');
        if(token && userId && _id) {
            dispatch(authSuccess(token, userId, _id))        
        } 
        else {
           dispatch(logout()); 
        }
     }
}