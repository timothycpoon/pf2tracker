import React from 'react';
import { Route, Switch } from "react-router-dom";
import Header from './components/Header';
import './App.scss';
import Initiative from './components/Initiative';
import Extension from './components/Extension';

const App = () => {
    return (
        <div className="App">
            <Header />
            <Switch>
                <Route path="/extension">
                    <Extension />
                </Route>
                <Route path="/">
                    <div className="App-container"><Initiative /></div>
                </Route>
            </Switch>
        </div>
    );
};

export default App;
