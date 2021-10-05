import React from 'react'
import { tokenCheck } from '../components/Auth'
import Files from '../components/Files'
import Header from '../components/Header'
import Upload from '../components/Upload'

function UserPage() {
    return (
        <div>
            <Files />
            <Upload />
        </div>
    )
}

export default UserPage
