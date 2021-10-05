import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import File from './File';
import { tokenCheck, hasToken, getEmail, getAdmin } from './Auth';
import { StyledFileEntry, StyledFileGrid, StyledFileGridColumn } from './StyledComponents';

// Component for a list of files
function Files() {
    const [files, setFiles] = useState([]);
    const [fname, setFname] = useState('');
    const [lname, setLname] = useState('');

    // If not used, fetchData() will keep on sending requests
    useEffect(() => {
        fetchData();
    }, [])
    
    const fetchData = async () => {
        if (hasToken() === false) {
            alert('Unauthenticated, please log in');
            window.location.href = 'http://localhost:3000/login';
        }
        const user = await getEmail();
        const isAdmin = getAdmin();
        //console.log(user);
        setFname(user.first_name);
        setLname(user.last_name);

        if (window.location.pathname === '/user'){
            const data = await axios.get('http://localhost:5000/files', {
                params: {
                    'email': user.email
                },
                headers: {
                    'authorization': localStorage.getItem('token')
                }
            }).then(res => {
                console.log(res.data)
                tokenCheck(res) 
                return res.data;
            })
            setFiles(data);
        } else if (window.location.pathname === '/files' && isAdmin){
            const data = await axios.get('http://localhost:5000/files', {
                headers: {
                    'authorization': localStorage.getItem('token')
                }
            }).then(res => {
                tokenCheck(res) 
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
                <File key={file[0]} file={file} first_name={fname} last_name={lname}/>
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
