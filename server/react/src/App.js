import React from 'react';
import { Route, Switch } from "react-router-dom";
import Header from './components/Header';
import './App.scss';
import Initiative from './components/Initiative';

const App = () => {
    return (
        <div className="App">
            <Header />
            <Switch>
                <Route path="/">
                    <div className="App-container"><Initiative /></div>
                </Route>
            </Switch>
        </div>
    );
};

export default App;
