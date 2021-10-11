import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { StyledButton, StyledButtonDelete, StyledFileEntry, StyledFileGrid, StyledFileGridColumn, StyledInput } from './StyledComponents';
import { checkToken } from './Auth';

// File component for Files.js list
// Displays all options user can do with file
function File({file, first_name, last_name}) {
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

        axios.put('http://localhost:5000/files', formData, {
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

        axios.post(`http://localhost:5000/file`, formData, {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }
        ).then(res => {
            console.log(res);
        }).catch((error) => {
            console.log(error);
        });
    }

    return (
        <StyledFileEntry>
            <StyledFileGrid>
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
