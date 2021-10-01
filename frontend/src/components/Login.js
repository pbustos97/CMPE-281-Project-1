import React from 'react';
import { useState } from 'react';
import bcrypt from 'bcryptjs';
import { StyledFormWrapper, StyledForm, StyledInput, StyledError, StyledButton }  from './StyledComponents'


function Login() {
    const initialLoginUser = {
        email: '',
        password: ''
    };
    const [loginUser, setState] = useState(initialLoginUser);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(loginUser);

        for (let key in loginUser) {
            if (loginUser[key] === '') {
                setError(`${key} must be provided`);
                return;
            }
        }
        setError('');

        // Send data to login api backend
        fetch('http://127.0.0.1:5000/user/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(loginUser)
        }).then(res => {
            console.log(res);
            console.log(res.json());
        });
    };

    const handleInput = (e) => {
        const inputName = e.currentTarget.name;
        const value = e.currentTarget.value;

        setState(prev => ({...prev, [inputName]: value}));
    };

    return (
        <div className="container">
            <StyledFormWrapper>
                <StyledForm onSubmit={handleSubmit}>
                    <h2 className="text-center my-5">Login</h2>
                        <div className="form-group">
                        <label htmlFor="email">Email</label>
                            <StyledInput type="email" 
                                name="email"
                                required
                                value={loginUser.email}
                                placeholder="Email"
                                onChange={handleInput}/>

                            <label htmlFor="password">Password</label>
                            <StyledInput type="password"
                                name="password"
                                required
                                value={loginUser.password}
                                placeholder="Password"
                                onChange={handleInput}/>

                            <StyledButton type="submit">Login</StyledButton>

                            {error && (
                                <StyledError><p>{error}</p></StyledError>
                            )}
                        </div>
                </StyledForm>
            </StyledFormWrapper>
            
        </div>
    )
}

export default Login
