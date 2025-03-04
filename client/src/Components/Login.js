import React, { useState, useContext } from 'react';
import { UserContext } from '../context/UserContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

import * as Components from '../Components/Components';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { dispatch } = useContext(UserContext);
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5001/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (response.ok) {
                const data = await response.json();
                console.log("the data of the user in login compo is : ", data.user);
                localStorage.setItem('token', data.token);
                dispatch({ type: 'SET_USER', payload: { user: data.user, token: data.token } });
                console.log("the dispatch has been succesfully completed. the data is : ",data.user);
            login({username,token:data.token});

            navigate('/dashboard/home');
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Login failed');
        }
    };

    return (
        <Components.Parent>
            <Components.Container>
                <Components.SignInContainer>
                    <Components.Form onSubmit={handleSubmit} data-testid="login-form">
                        <Components.Title>Sign In</Components.Title>
                        <Components.Input type='text' name='text' placeholder='Username' value={username} onChange={(e) => setUsername(e.target.value)} required />
                        <Components.Input type='password' name='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} required />
                        <Link to="/register">Don't have an account? Sign Up!</Link>
                        <Components.Anchor href='#'>Forgot your password?</Components.Anchor>
                        <Components.Button type="submit" disabled={!username || !password}>Sign In</Components.Button>
                    </Components.Form>
                </Components.SignInContainer>
            </Components.Container>
        </Components.Parent>

    );
};

export default Login;

