import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as C from './Components';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5001';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setLoading(true);
        try {
            const res = await fetch(`${API}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            });
            const data = await res.json();
            if (!res.ok) {
                setError(data.message || 'Registration failed.');
                return;
            }
            navigate('/');
        } catch {
            setError('Unable to connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <C.Parent>
            <C.Container>
                <C.SignUpContainer>
                    <C.Form onSubmit={handleSubmit} data-testid="register-form">
                        <C.Title>Create account</C.Title>
                        <C.Subtitle>Start managing your finances today</C.Subtitle>
                        {error && <C.ErrorMsg>{error}</C.ErrorMsg>}
                        <C.Input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            autoFocus
                        />
                        <C.Input
                            type="email"
                            placeholder="Email (optional)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <C.Input
                            type="password"
                            placeholder="Password (min. 6 characters)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <C.Button type="submit" disabled={!username || !password || loading}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </C.Button>
                        <C.Anchor as={Link} to="/">
                            Already have an account? Sign in
                        </C.Anchor>
                    </C.Form>
                </C.SignUpContainer>
            </C.Container>
        </C.Parent>
    );
};

export default Register;
