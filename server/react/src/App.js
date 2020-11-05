import React from 'react';
import { Route } from "react-router-dom";
import Header from './components/Header';
import './App.scss';
import Initiative from './components/Initiative';

const App = () => {
    return (
        <div className="App">
            <Header />
            <div className="App-container"><Initiative /></div>
        </div>
    );
};

export default App;
