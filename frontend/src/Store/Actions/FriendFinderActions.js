import { FIND_FRIEND_SUCCESS, FIND_FRIEND_ERROR, LOADING_FRIENDS } from './ActionTypes';
import axios from 'axios'

const loadingFriends = () => {
    return {
        type : LOADING_FRIENDS
    }
}

const findFriendSuccess = data => {
    return {
        type : FIND_FRIEND_SUCCESS,
        data : data
    }
}
const findFriendError = err => {
    return {
        type : FIND_FRIEND_ERROR,
        err : err
    }
}
export const loadFriends = (lng, lat, token) => {
     return dispatch => {
         dispatch(loadingFriends());
         axios.post('/app/find-friends',{ lng, lat },{
             headers : {
                 'Authorization' : `Bearer ${token}`
             }
         })
         .then(data => {
             const { friends } = data.data
             const nearFriends = friends.map(friend => {
                 return {
                     ...friend,
                     distance : calculateDistance(lat, lng, friend.location.coordinates[1],friend.location.coordinates[0],'K')
                 }
             })
             dispatch(findFriendSuccess(nearFriends))
         })
         .catch(err => {
             console.log(err);
             dispatch(findFriendError(err))
         })
     }
}

function calculateDistance(lat1, lon1, lat2, lon2, unit) {
	if ((lat1 === lat2) && (lon1 === lon2)) {
		return '0 km';
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
            return Math.round(dist) + ' km'
        }
	}
}