import React, { useState, useCallback, memo } from 'react';
import { useDispatch } from 'react-redux';
import { post } from '../utils';
import { updateLogin } from '../actions';
import { TextField, Button } from '@material-ui/core';

const Login = () => {
    const [errorText, setErrorText] = useState(undefined);
    const [username, setUsername] = useState(undefined);
    const [password, setPassword] = useState(undefined);
    const dispatch = useDispatch();

    const handleSubmit = useCallback(() => {
        post('/login', {
            username,
            password,
        })
        .then(res => {
            dispatch(updateLogin(res.data));
        })
        .catch(err => {
            console.error(err);
            setErrorText("Username or Password was incorrect");
        });
    }, [username, password, dispatch]);

    return <div>
        <form className="login-form">
            <TextField label="Username" variant="outlined" value={username} onChange={e => setUsername(e.target.value)}/>
            <TextField label="Password" type="password" variant="outlined" value={password} onChange={e => setPassword(e.target.value)}/>
            <Button variant="outlined" onClick={handleSubmit}>Login</Button>
        </form>
        {errorText && <div className="error">{errorText}</div>}
    </div>;
}

export default memo(Login);
