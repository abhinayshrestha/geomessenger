import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Containers/App';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from './Store/Reducers/RootReducer';
import thunk from 'redux-thunk';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)))

axios.defaults.baseURL = 'http://localhost:8000';

const app =  
            <Provider store={store}>
                <BrowserRouter>
                    <React.Fragment>
                      <App />
                    </React.Fragment>
                </BrowserRouter>
             </Provider> 

ReactDOM.render(app,document.getElementById('root')
);