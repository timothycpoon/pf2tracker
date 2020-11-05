import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux';
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from 'redux-thunk';
import rootReducer from './reducers';
import { BrowserRouter } from "react-router-dom";
import App from './App';

import './index.css';

// Note: this API requires redux@>=3.1.0
const store = createStore(rootReducer, JSON.parse(document.getElementById('initial-store').innerHTML),
                          compose(composeWithDevTools(), applyMiddleware(thunk)));

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);
