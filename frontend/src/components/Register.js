import React from 'react';
import bcrypt from 'bcryptjs';
import { useState } from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';
import { StyledFormWrapper, StyledForm, StyledInput, StyledError, StyledButton }  from './StyledComponents'
import axios from 'axios';

function Register() {
    const initialRegisterUser = {
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        date: ''
    };
    const [newUser, setState] = useState(initialRegisterUser);
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        newUser.date = Date.now();
        e.preventDefault();
        console.log(newUser);

        for (let key in newUser) {
            if (newUser[key] === '') {
                setError(`${key} must be provided`);
                return;
            }
        }
        setError('');

        axios.post('http://localhost:5000/user/register', newUser).then(res => {
            console.log(res.data);
            if (res.data.success === 'false') {
                alert('Error creating user');
            }
            else {
                window.location.pathname = '/login';
                alert('Successful user creation, please login');
            }
        }).catch(err => {
            console.log(err);
        })
    }

    const handleInput = (e) => {
        const inputName = e.currentTarget.name;
        const value = e.currentTarget.value;

        setState(prev => ({...prev, [inputName]: value}));
    };

    return (
        <div className="container">
            <StyledFormWrapper>
                <StyledForm onSubmit={handleSubmit}>
                    <h2 className="text-center my-5">Register a New Account</h2>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <StyledInput type="email" 
                                name="email"
                                required
                                value={newUser.email}
                                placeholder="Email"
                                onChange={handleInput}/>

                            <label htmlFor="password">Password</label>
                            <StyledInput type="password"
                                name="password"
                                required
                                value={newUser.password}
                                placeholder="Password"
                                onChange={handleInput}/>

                            <label htmlFor="first_name">First Name</label>
                            <StyledInput type="text" 
                                name="first_name"
                                required
                                value={newUser.first_name}
                                placeholder="First name"
                                onChange={handleInput}/>

                            <label htmlFor="last_name">Last Name</label>
                            <StyledInput type="text" 
                                name="last_name"
                                required
                                value={newUser.last_name}
                                placeholder="Last name"
                                onChange={handleInput}/>

                            <StyledButton type="submit">Register</StyledButton>
                            
                            {error && (
                                <StyledError><p>{error}</p></StyledError>
                            )}
                        </div>
                </StyledForm>
            </StyledFormWrapper>
        </div>
    )
}

export default Register
