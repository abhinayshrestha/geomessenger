import { LOAD_USER_DATA_SUCCESS, UPDATE_SETTING_SUCCESS, HIDE_TOAST, CHANGE_PROFILEPIC_START, CHANGE_PROFILEPIC_SUCCESS
        ,SET_MESSAGE_STATUS  } from './ActionTypes';
import axios from 'axios';

const loadDataSuccess = user => {
     return {
         type : LOAD_USER_DATA_SUCCESS,
         user : user
     }   
}

export const loadUserData = token => {
    return dispatch => {
        axios.get('/app/get-user-data',{ 
            headers : {
                'Authorization' : `Bearer ${token}`
            }
        })
        .then(data => {
            const { user } = data.data;
            dispatch(loadDataSuccess(user));
        })
        .catch(err => {
            console.log(err);
        })
    }
}

const updateSettingSuccess = (distance, name) => {
    return {
        type : UPDATE_SETTING_SUCCESS,
        distance : distance,
        name : name
    }
}

export const updateSetting = (distance, name) => {
    return (dispatch, getState) => {
        axios.post('/app/setting/update-info',
                { name : name, distance : distance },
                {
                    headers : {
                        'Authorization' : `Bearer ${getState().authReducer.token}`
                    }
                })
                .then(_ => {
                    dispatch(updateSettingSuccess(distance, name));
                })
                .catch(err => {
                    console.log(err);
                })
    }
}

export const hideToast = () => {
     return {
         type : HIDE_TOAST
     }
}

const changeProfilePicStart = () => {
    return {
        type : CHANGE_PROFILEPIC_START
    }
}

const changeProfilePicSuccess = url => {
    return {
        type : CHANGE_PROFILEPIC_SUCCESS,
        url : url
    }
}

export const changeProfilePic = file => {
    return (dispatch, getState) => {
            dispatch(changeProfilePicStart());
            const formData = new FormData();
            formData.append('img', file);
            const config = {     
                headers: { 'content-type': 'multipart/form-data', 'Authorization' : `Bearer ${getState().authReducer.token}`}
            }
            axios.post('/app/setting/change-profilepic', formData, config)
            .then(result => {
                dispatch(changeProfilePicSuccess(result.data.url));
            })
            .catch(err => {
                console.log(err);
            })
    }
}

export const setMessageStatus = status => {
     return (dispatch, getState) => {
            axios.get('/app/set-read-status',
            {
                headers : {
                    'Authorization' : `Bearer ${getState().authReducer.token}`
                }
            })
            .then(_ => {
                dispatch({ type : SET_MESSAGE_STATUS, status : status }) 
            })
            .catch(err => {
                console.log(err);
            })
     }
}


