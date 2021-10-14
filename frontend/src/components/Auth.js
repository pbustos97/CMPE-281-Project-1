import axios from "axios";

// Depreciated localstorage checker
// const hasToken = () => {
//     if (localStorage.getItem('token') === null) {
//        return false;
//     }
//     return true;
// }

// Depreciated token checker
// const tokenCheck = (res) => {
//     console.log(res.data);
//     if (res.data.status === "false" && res.data.message === "Expired Token") {
//         alert('Token expired, please login');
//         window.location.pathname = '/login';
//         return false;
//     }
//     if (res.data.status === "false" && res.data.message === "Expired or invalid token") {
//         alert('Authentication error');
//         window.location.href = window.location.origin;
//         return false;
//     }
//     if (res.data.status === "false") {
//         alert('Unexpected error');
//         window.location.href = window.location.origin;
//         return false;
//     }
//     return true;
// }

const checkToken = async (token) => {
    // console.log(token);
    if (token === null) {
        console.log('no token');
        return false;
    } else {
        const validToken = await axios.get(`${process.env.REACT_APP_API}/api/checkToken`, {
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then(res => {
            // console.log(res.data.status)
            return res.data.status;
        }).catch(res => {
            // console.log(res);
            return false;
        })
        // console.log(validToken)
        if (validToken === "true") {
            return true;
        } else {
            return false;
        }
    }
}

const getEmail = () => {
    
    const data = fetch(`${process.env.REACT_APP_API}/api/email`, {
        method: 'GET',
        headers: { 'authorization': localStorage.getItem('token') }
    }).then((res) => res.json()).then(data => {
        return data;
    }).catch(() => {
        return JSON.stringify({'status': 503, 'message': 'Service unavailable'});
    })
    return data;
}

const getAdmin = async () => {
    const data = fetch(`${process.env.REACT_APP_API}/api/email`, {
        method: 'GET',
        headers: { 'authorization': localStorage.getItem('token') }
    }).then((res) => res.json()).then(data => {
        return data;
    }).then(data => {
        if (data.role === "admin"){
            return true;
        }
        return false;
    }).catch(() => {
        return JSON.stringify({'status': 503, 'message': 'Service unavailable'});
    })
    return data;
}

export { getEmail, getAdmin, checkToken };