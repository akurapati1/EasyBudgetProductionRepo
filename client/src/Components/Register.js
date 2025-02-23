import React, { Component, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as Components from '../Components/Components';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5001/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });
    if (response.ok) {
      navigate("/login");
      console.log("success");
    } else {
      alert("Registration failed");
    }
  };

  return (
    <Components.Parent>
      <Components.Container>
        <Components.SignUpContainer>
          <Components.Form onSubmit={handleSubmit} data-testid="register-form">
            <Components.Title>Create Account</Components.Title>
            <Components.Input
              type="text"
              name="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Components.Input 
              type="email" 
              name="email" 
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Components.Input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Components.Button type="submit" disabled={!username || !password}>Sign Up</Components.Button>
            <Components.Anchor href='/'>Already have an Account? Sign in!</Components.Anchor>
          </Components.Form>
        </Components.SignUpContainer>
      </Components.Container>
    </Components.Parent>
  );
};

export default Register;