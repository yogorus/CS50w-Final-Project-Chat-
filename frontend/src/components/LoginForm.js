import {React, useState, useEffect }from 'react';
import getCookie from '../utils/getCookie';

export default function LoginForm() {
    const [state, setState] = useState({
        'username': '',
        'password': ''
    })
    // useEffect(() => {
    //     console.log(state)
    // })

    function updateForm(e) {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    async function logUserIn(e) {
        e.preventDefault();
        const url = 'http://localhost:8000/api-token-auth/';
        const csrftoken = getCookie('csrftoken');
        const data = {username: state.username, password: state.password};
        let response = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(data)
        })
        response = await response.json()
        console.log(response)
        window.localStorage.setItem("token", JSON.stringify(response.token));
    }

    return(
        <div>
            <h1>Log in</h1>
            <form onSubmit={logUserIn}>
                <label htmlFor="">
                    <p>Username</p>
                    <input
                    name='username' 
                    type="text"
                    value={state.username} 
                    onChange={updateForm}
                    autoFocus={true}
                    />
                </label>
                <label htmlFor="">
                    <p>Password</p>
                    <input
                    name='password' 
                    type="password" 
                    value={state.password} 
                    onChange={updateForm}
                    />
                </label>
                <div className="">
                    <button type="submit">Log in</button>
                </div>
            </form>
        </div>
    )
}