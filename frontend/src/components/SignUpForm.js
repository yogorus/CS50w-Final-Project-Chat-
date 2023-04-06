import getCookie from '../utils/getCookie';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Card  from 'react-bootstrap/Card';
import Alert from 'react-bootstrap/Alert';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from './Layout';

export default function SignUpForm() {
    let navigate = useNavigate();
    const [state, setState] = useState({
        'username': '',
        'password': '',
        'password2': '',
        "usernameValidation": '',
        "passwordValidation": '',
        "password2Validation": '',
        "nonFieldErrs": ''
    })

    async function register(e) {
        e.preventDefault();
        const url = 'http://localhost:8000/register/';
        const csrftoken = getCookie('csrftoken');
        const data = {username: state.username, password: state.password, password2: state.password2};

        let response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(data)
        })
        if (response.status === 201) {
            logUserIn();
        } else {
            response = await response.json();
            setState({
                ...state,
                usernameValidation: response.hasOwnProperty('username') ? response.username[0] : '',
                passwordValidation: response.hasOwnProperty('password') ? response.password[0] : '',
                password2Validation: response.hasOwnProperty('password2') ? response.password2[0] : '',
            })
        }
    }

    async function logUserIn() {
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
            console.log(response)
            window.localStorage.setItem("token", JSON.stringify(response.token));
            window.localStorage.setItem("username", JSON.stringify(response.username));
            window.localStorage.setItem('user_id', JSON.stringify(response.user_id));
            navigate('../')
        }
    }

    function updateForm(e) {
        setState({
            ...state,
            [e.target.name]: e.target.value
        })
    }

    return(
        <Layout>
            <Card className='w-50 mx-auto mt-5 m-1 auth-form'>
                <Card.Header>
                    <Card.Title>
                        Sign Up
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    <Form className="mx-auto w-75" onSubmit={register}>
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
                        <Form.Group className="mb-3">
                            <Form.Label><h5>Confirm Password</h5></Form.Label>
                            <ValidationAlert 
                            status={!!state.password2Validation}
                            response={state.password2Validation}
                            />
                            <Form.Control 
                            type="password"
                            name="password2" 
                            placeholder="Confirm Password"
                            value={state.password2}
                            onChange={updateForm}
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit">Sign Up</Button>
                    </Form>
                    {/* <button onClick={() => console.log(state)}>Click to check state</button> */}
                </Card.Body>
            </Card>
        </Layout>
    )
}

function ValidationAlert(props) {
    
    return(
        <Alert show={props.status} variant='danger'>
            {props.response}
        </Alert>
    )
}