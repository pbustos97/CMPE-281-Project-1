import React from 'react';
import { useState } from 'react';
import { StyledFormWrapper, StyledFile, StyledButton, StyledInput}  from './StyledComponents';
import axios from 'axios';
import {getEmail, checkToken} from './Auth';

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
        console.log('submitting')
        if (checkToken(localStorage.getItem('token')) === false ) {
            alert('Unauthenticated, please log in');
            window.location.pathname = '/login';
            return;
        }

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

        axios.post('http://localhost:5000/api/files', formData, {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }).then(res => {
                window.location.reload();
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
                Upload to update or add file (If you want the description to be the same on update, input the description into the text field)
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
