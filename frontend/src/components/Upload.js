import React from 'react';
import { useState } from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';
import { StyledFormWrapper, StyledForm, StyledFile, StyledButton, StyledInput, StyledTextArea }  from './StyledComponents';
import axios from 'axios';
import {getEmail, tokenCheck} from './Auth';


function Upload() {
    const initialUploadState = {
        file: null,
        file_name: null,
        file_size: null,
        description: '',
        first_name: '',
        last_name: '',
        upload_date: null,
        update_date: null
    };
    const [uploadState, setUploadState] = useState(initialUploadState);

    const handleSubmit = async (e) => {
        const formData = new FormData();
        if (uploadState.file_size > 10000000) {
            alert('FILE TOO LARGE! (10 MB max file size)');
            return;
        }

        if (uploadState.file === null) {
            return;
        }

        // Get email from access token
        const email = await getEmail()
        console.log(email.email)
        // FormData to send all necessary info to the backend
        formData.append('file', uploadState.file, uploadState.file_name);
        formData.append('file_name', uploadState.file_name);
        formData.append('file_description', uploadState.description);
        formData.append('email', email.email);
        formData.append('upload_date', uploadState.upload_date);
        formData.append('update_date', uploadState.update_date);
        formData.append('access_token', localStorage.getItem('token'));

        axios.post('http://localhost:5000/files', formData, {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }).then(res => {
            if (tokenCheck(res) === false) {
                window.location.href= 'http://localhost:3000';
            } else {
                window.location.reload();
            }
        }).catch((error) => {
            console.log(error);
        });
    };

    const fileSelectedHandler = (e) => {
        // Using integer value for easier conversion for backend
        const date = Date.now();
        console.log(date)

        const newUploadState = {
            file: e.target.files[0],
            file_name: e.target.files[0].name,
            file_size: e.target.files[0].size,
            upload_date: date,
            update_date: date
        };

        setUploadState(newUploadState);
    }

    const handleInput = (e) => {
        const inputName = e.currentTarget.name;
        const value = e.currentTarget.value;

        setUploadState(prev => ({...prev, [inputName]: value}));
    }

    return (
        <StyledFormWrapper>
                <StyledFile type='file' onChange={fileSelectedHandler} />
                <StyledInput type='text' 
                    name="description"
                    value={uploadState.description}
                    placeholder="File description"
                    onChange={handleInput} />
                <StyledButton onClick={handleSubmit}>Upload</StyledButton>
        </StyledFormWrapper>
    )
}

export default Upload
