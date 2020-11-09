import React, { memo } from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import Login from './Login';

const Header = () => {
    const login = useSelector(state => state.login);
    return (
        <header className="App-header row">
            <div className="col-md-3">
                <NavLink to="/extension">Parser Extension</NavLink>
            </div>
            <h1 className="col-md-6 flexbox"> Pathfinder 2 Tracker </h1>
            <div className="login col-md-3 flexbox">
                {
                    login
                    ? `Logged in as ${login.username || 'Guest'}`
                    : <Login />
                }
            </div>
        </header>
    );
};

export default memo(Header);
