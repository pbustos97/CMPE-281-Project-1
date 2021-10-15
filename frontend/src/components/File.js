import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import { StyledButton, StyledButtonDelete, StyledFileEntry, StyledFileGrid, StyledFileGridColumn, StyledInput } from './StyledComponents';
import { checkToken } from './Auth';

// File component for Files.js list
// Displays all options user can do with file
function File({file}) {
    const [first_name, setFirst_name] = useState('');
    const [last_name, setLast_name] = useState('');

    useEffect(() => {
        fetchData();
    }, [])

    // Should only return username's first and last names
    const fetchData = async (e) => {
        const data = await axios.get(`${process.env.REACT_APP_API}/api/user`, {
            params: {
                'email': file[2]
            }
        }).then(res => {
            console.log(res.data);
            return res.data;
        }).catch(err => {
            console.log(err);
        })
        setFirst_name(data.first_name);
        setLast_name(data.last_name);
    }

    const initialFileState = {
        description: '',
        modifyDate: '',
    }

    const [fileState, setFileState] = useState(initialFileState)
    const fileDownloadHandler = (e) => {
        window.open(file[6]);
    }

    const handleInput = (e) => {
        const name = e.currentTarget.name;
        const value = e.currentTarget.value;
        setFileState(prev => ({...prev, [name]: value}));
        fileState.modifyDate = Date.now();
        console.log(fileState);
    }

    const fileEditHandler = async (e) => {
        if (checkToken(localStorage.getItem('token')) === false ) {
            alert('Unauthenticated, please log in');
            window.location.pathname = '/login';
            return;
        }
        const formData = new FormData();
        formData.append('file', file[1]);
        formData.append('description', fileState.description);
        formData.append('modify_date', fileState.modifyDate);

        axios.put(`${process.env.REACT_APP_API}/api/files`, formData, {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }).then(res => {
            window.location.reload();
        }).catch(err => {
            console.log(err);
        });
    }
    
    const fileDeleteHandler = async (e) => {
        if (checkToken(localStorage.getItem('token')) === false ) {
            alert('Unauthenticated, please log in');
            window.location.pathname = '/login';
            return;
        }
        const formData = new FormData();
        formData.append('file', file[0]);

        axios.post(`${process.env.REACT_APP_API}/api/file`, formData, {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }
        ).then(res => {
            console.log(res);
        }).catch((error) => {
            console.log(error);
        });
        window.location.reload();
    }

    return (
        <StyledFileEntry>
            <StyledFileGrid>
                {console.log(file)}
                <StyledFileGridColumn>
                    {file[1]}
                </StyledFileGridColumn>
                <StyledFileGridColumn>
                    {file[3]}
                </StyledFileGridColumn>
                <StyledFileGridColumn>
                    {file[4]}
                </StyledFileGridColumn>
                <StyledFileGridColumn>
                    {file[5]}
                </StyledFileGridColumn>
                <StyledFileGridColumn>{first_name} {last_name}</StyledFileGridColumn>
            </StyledFileGrid>
            <StyledFileGrid>
                <div>
                <StyledButtonDelete onClick={fileDeleteHandler}>Delete</StyledButtonDelete>
                </div>
                <div>
                    <StyledInput type='text'
                        name="description"
                        value={fileState.description}
                        placeholder="File description"
                        onChange={handleInput} />
                </div>
                <div>
                <StyledButton onClick={fileEditHandler}>Edit Description</StyledButton>
                </div>
                <div>
                <StyledButton onClick={fileDownloadHandler}>Download</StyledButton>
                </div>
                
            </StyledFileGrid>
        </StyledFileEntry>
    )
}

export default File
