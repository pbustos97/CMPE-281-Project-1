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
        window.location.pathname = '/login';
        return false;
    }
    if (res.data.success === "false" && res.data.message === "Expired or invalid token") {
        alert('Authentication error');
        window.location.href = window.location.origin;
        return false;
    }
    if (res.data.success === "false") {
        alert('Unexpected error');
        window.location.href = window.location.origin;
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

const getAdmin = async () => {
    const data = fetch('http://localhost:5000/api/email', {
        method: 'GET',
        headers: { 'authorization': localStorage.getItem('token') }
    }).then((res) => res.json()).then(data => {
        return data;
    }).then(data => {
        if (data.role === "admin"){
            return true
        }
        return false;
    })
    return data;
}

export { tokenCheck, hasToken, getEmail, getAdmin };