import React from 'react';
import { Route, NavLink } from "react-router-dom";
import Login from './components/Login';
import './App.scss';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Login />
      </header>
      <div className="App-container">
      </div>
    </div>
  );
}

export default App;
