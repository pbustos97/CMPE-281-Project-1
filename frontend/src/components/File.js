import axios from 'axios';
import React from 'react';
import { useState } from 'react';
import { StyledButton, StyledButtonDelete, StyledFileEntry, StyledFileGrid, StyledFileGridColumn } from './StyledComponents';
import { tokenCheck } from './Auth';

// File component for Files.js list
// Displays all options user can do with file
function File({file, first_name, last_name}) {
    const [description, setDescription] = useState('');
    const fileDownloadHandler = (e) => {
        window.open(file[6]);
    }

    const handleInput = (e) => {
        console.log(e);
    }

    const fileEditHandler = async (e) => {
        console.log(e);
    }
    
    const fileDeleteHandler = async (e) => {
        const formData = new FormData();
        formData.append('file', file[0]);

        axios.post(`http://localhost:5000/file`, formData, {
            headers: {
                'authorization': localStorage.getItem('token')
            }
        }
        ).then(res => {
            console.log(res);
            if (tokenCheck(res) === false) {
                window.location.href = window.location.origin;
            } else {
                window.location.reload();
            }
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
                <StyledButton onClick={fileDownloadHandler}>Download</StyledButton>
                </div>
            </StyledFileGrid>
        </StyledFileEntry>
    )
}

export default File
