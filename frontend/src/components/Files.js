import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import File from './File';
import { getEmail, getAdmin, checkToken } from './Auth';
import { StyledFileEntry, StyledFileGrid, StyledFileGridColumn } from './StyledComponents';

// Component for a list of files
function Files() {
    const [files, setFiles] = useState([]);

    // If not used, fetchData() will keep on sending requests
    useEffect(() => {
        fetchData();
    }, [])
    
    const fetchData = async () => {
        if (checkToken(localStorage.getItem('token')) === false ) {
            alert('Unauthenticated, please log in');
            window.location.pathname = '/login';
            return;
        }
        const user = await getEmail();
        const isAdmin = await getAdmin();
        if (typeof isAdmin !== "boolean") {
            alert('Error getting user data');
            window.location.href = window.location.origin;
        }

        if (window.location.pathname === '/user'){
            const data = await axios.get(`${process.env.REACT_APP_API}/api/files`, {
                params: {
                    'email': user.email
                },
                headers: {
                    'authorization': localStorage.getItem('token')
                }
            }).then(res => {
                console.log(res.data);
                return res.data;
            }).catch(err => {
                console.log(err);
            })
            setFiles(data);
        } else if (window.location.pathname === '/files' && isAdmin){
            const data = await axios.get(`${process.env.REACT_APP_API}/api/files`, {
                headers: {
                    'authorization': localStorage.getItem('token')
                }
            }).then(res => {
                return res.data;
            })
            setFiles(data);
        }
    }

    return (
        <div className='file'>
            <StyledFileEntry>
            <StyledFileGrid>
                <StyledFileGridColumn>File Name</StyledFileGridColumn>
                <StyledFileGridColumn>File Description</StyledFileGridColumn>
                <StyledFileGridColumn>Creation Date</StyledFileGridColumn>
                <StyledFileGridColumn>Modified Date</StyledFileGridColumn>
                <StyledFileGridColumn>Owner</StyledFileGridColumn>
            </StyledFileGrid>
            </StyledFileEntry>
            {files.length > 0 && files.map((file) => (
                <File key={file[0]} file={file} />
            ))}
            {files.length === 0 && (
                <StyledFileGrid>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <StyledFileEntry>No files</StyledFileEntry>
                </StyledFileGrid>
            )}
        </div>
    )
}

export default Files
