import {React, useState, useEffect }from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import getCookie from '../utils/getCookie';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card  from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';

export default function LoginForm() {
    let navigate = useNavigate();
    const [state, setState] = useState({
        'username': '',
        'password': '',
        "usernameValidation": '',
        "passwordValidation": '',
        "nonFieldErrs": ''
    })
    
    function updateForm(e) {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    async function logUserIn(e) {
        e.preventDefault();
        // Log user in via obtaining DRF auth token
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
        // If response returned auth token, we're safe to redirect the user
        if ('token' in response)
        {   
            window.localStorage.setItem("token", JSON.stringify(response.token));
            window.localStorage.setItem("username", JSON.stringify(response.username));
            window.localStorage.setItem('user_id', JSON.stringify(response.user_id));
            navigate('../')
        } else {
            // if unable to log in, activate alerts
            setState({
                ...state,
                usernameValidation: response.hasOwnProperty('username') ? response.username[0] : '',
                passwordValidation: response.hasOwnProperty('password') ? response.password[0] : '',
                nonFieldErrs: response.hasOwnProperty('non_field_errors') ? response.non_field_errors[0] : '',
            })
        }
    };

   return(
        <Card className='w-50 mx-auto m-1'>
            <Card.Header>
                <Card.Title>
                    Sign In
                </Card.Title>
            </Card.Header>
            <Card.Body>
            <Form className="mx-auto w-75" onSubmit={logUserIn}>
                <Form.Group className="mb-3">
                    <ValidationAlert 
                    status={!!state.nonFieldErrs}
                    response={state.nonFieldErrs}
                    />
                    <Form.Label><h5>Username</h5></Form.Label>
                    <ValidationAlert 
                    status={!!state.usernameValidation}
                    response={state.usernameValidation}
                    />
                    <Form.Control 
                    type="text"
                    name="username" 
                    placeholder="Username"
                    value={state.username}
                    autoFocus={true}
                    onChange={updateForm}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label><h5>Password</h5></Form.Label>
                    <ValidationAlert 
                    status={!!state.passwordValidation}
                    response={state.passwordValidation}
                    />
                    <Form.Control 
                    type="password"
                    name="password" 
                    placeholder="Password"
                    value={state.password}
                    onChange={updateForm}
                    />
                </Form.Group>
                <Button variant="primary" type="submit">Sign In</Button>
            </Form>
            </Card.Body>
            {/* <button onClick={() => console.log(isLoggedIn)}>Click to check state</button> */}
        </Card>
    )
}

function ValidationAlert(props) {
    
    return(
        <Alert show={props.status} variant='danger'>
            {props.response}
        </Alert>
    )
}