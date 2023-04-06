import { useState } from "react";
import getCookie from "../utils/getCookie";
import Layout from "./Layout";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Alert from "react-bootstrap/Alert";
import { useNavigate } from "react-router-dom";

export default function CreateRoom() {
    const [roomName, setRoomName] = useState('');
    const [showAlert, setShowAlert] = useState(false);

    const navigate = useNavigate();
    
    async function createRoomRequest(e) {
        e.preventDefault()
        const url = 'http://localhost:8000/rooms/';
        const csrftoken = getCookie('csrftoken');
        const request = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json',
                'X-CSRFToken': csrftoken,
                'Authorization': `Token ${JSON.parse(window.localStorage.getItem('token'))}`
            },
            body: JSON.stringify({
                name: roomName,
            })
        })
        console.log(request)
        const room = await request.json();
        console.log(room)
        
        if (request.status === 201) {
            navigate(`../room/${room.slug}/`, { state: {room: room} })
        } else {
            setShowAlert(true)
        }
        setRoomName('')
    } 

    return (
        <Layout>
            <Form className="mx-auto w-75" onSubmit={createRoomRequest}>
                <Form.Group className="mb-3">
                    <Form.Label><h5>Room name</h5></Form.Label>
                    <ValidationAlert 
                    status={showAlert}
                    />
                    <Form.Control 
                    type="text"
                    name="room-name" 
                    placeholder="Type in room name"
                    value={roomName}
                    autoFocus={true}
                    onChange={(e) => setRoomName(e.target.value)}
                     />
                    <Form.Text className="text-muted">
                        Create Chat Room if that name is not taken
                    </Form.Text>
                </Form.Group>
                <Button variant="primary" type="submit">Create</Button>
            </Form>
        </Layout>
    )
}

function ValidationAlert(props) {
    
    return(
        <Alert show={props.status} variant='danger'>
            Room with that name already exists or name is too long
        </Alert>
    )
}