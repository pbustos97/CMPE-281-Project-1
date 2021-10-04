import React from 'react';
import { useState } from 'react';
import bcrypt from 'bcryptjs';
import { StyledFormWrapper, StyledForm, StyledInput, StyledError, StyledButton }  from './StyledComponents'
import axios from 'axios';


function Login() {
    const initialLoginUser = {
        email: '',
        password: ''
    };
    const [loginUser, setState] = useState(initialLoginUser);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        for (let key in loginUser) {
            if (loginUser[key] === '') {
                setError(`${key} must be provided`);
                return;
            }
        }
        setError('');

        // Send data to login api backend
        axios.post('http://localhost:5000/user/login', loginUser).then(res => {
            console.log(res);
            console.log(res.headers);
            if (res.data.success === 'false') {
                alert('Username or password is wrong');
            }
            else {
                localStorage.setItem('token', res.data.token);
                window.location.href = 'http://localhost:3000';
            }
        }).catch(err => {
        })
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
