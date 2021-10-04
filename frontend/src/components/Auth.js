import React from 'react'
import { useState } from 'react'

const hasToken = () => {
    if (localStorage.getItem('token') === null) {
       return false;
    }
    return true;
}

const tokenCheck = (res) => {
    console.log(res.data);
    if (res.data.success === "false" && res.data.message === "Expired Token") {
        alert('Token expired, please login');
        window.location.href = 'http://localhost:3000/login';
        return false;
    }
    if (res.data.success === "false" && res.data.message === "Expired or invalid token") {
        alert('Authentication error');
        window.location.href = 'http://localhost:3000';
        return false;
    }
    if (res.data.success === "false") {
        alert('Unexpected error');
        window.location.href = 'http://localhost:3000';
        return false;
    }
}

const getEmail = () => {
    
    const data = fetch('http://localhost:5000/api/email', {
        method: 'GET',
        headers: { 'authorization': localStorage.getItem('token') }
    }).then((res) => res.json()).then(data => {
        return data;
    })
    return data;
}

export { tokenCheck, hasToken, getEmail };