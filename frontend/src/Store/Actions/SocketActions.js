import { INIT_SOCKET } from './ActionTypes';
import openSocket from 'socket.io-client';


export const initSocket = () => {
    return dispatch => {
        dispatch({ type : INIT_SOCKET, socket : openSocket('https://geomessenger.herokuapp.com/') })
        // dispatch({ type : INIT_SOCKET, socket : openSocket('http://localhost:8000') })
    }
}