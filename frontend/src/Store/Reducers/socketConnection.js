import { INIT_SOCKET, LOG_OUT } from '../Actions/ActionTypes';

const init = {
    socket : null
};

const socketReducer = (state = init, action) => {
    switch(action.type) {
        case INIT_SOCKET : return {
            ...state,
            socket : action.socket
        }
        case LOG_OUT : if(state.socket) state.socket.emit('logout');
                return {
                     socket : null   
                }
        default : return state;
    } 
}

export default socketReducer;