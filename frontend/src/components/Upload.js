import React from 'react';
import { useState } from 'react';
import styled, { createGlobalStyle, css } from 'styled-components';
import { StyledFormWrapper, StyledForm, StyledFile, StyledButton }  from './StyledComponents';
import axios from 'axios';


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

    const handleSubmit = (e) => {
        console.log(e);
    };

    const fileSelectedHandler = (e) => {
        // Using integer value for easier conversion for backend
        const date = Date.now();
        console.log(date)


        // Need to change description and email to correct values
        // Need to request data from backend for email and file upload_date if file exists
        const newUploadState = {
            file: e.target.files[0],
            file_name: e.target.files[0].name,
            file_size: e.target.files[0].size,
            description: 'test',
            email: 'admin@gmail.com',
            upload_date: date,
            update_date: date
        };

        setUploadState(newUploadState);
    }

    // If successful upload, refresh page
    const fileUploadHandler = (e) => {
        const formData = new FormData();
        
        if (uploadState.file_size > 10000000) {
            alert('FILE TOO LARGE! (10 MB max file size)');
            return;
        }

        // Get email from access token
        //axios.post('email endpoint')
        
        // FormData to send all necessary info to the backend
        formData.append('file', uploadState.file, uploadState.file_name);
        formData.append('file_name', uploadState.file_name);
        formData.append('file_description', uploadState.description);
        formData.append('email', uploadState.email);
        formData.append('upload_date', uploadState.upload_date)
        formData.append('update_date', uploadState.update_date)
        formData.append('access_token', localStorage.getItem('token'))

        axios.post('http://127.0.0.1:5000/files', formData, {
            onUploadProgress: progressEvent => {
                console.log('Upload Progress: ' + Math.round(progressEvent.loaded / progressEvent.total * 100) + '%');
            }
        }).then(res => {
            console.log(res);
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <StyledFormWrapper>
            <StyledFile type='file' onChange={fileSelectedHandler}/>
            <StyledButton onClick={fileUploadHandler}>Upload</StyledButton>
        </StyledFormWrapper>
    )
}

export default Upload
