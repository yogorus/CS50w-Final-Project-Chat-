import { useState } from "react";
import getCookie from "../utils/getCookie";
import Layout from "./Layout";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

export default function CreateRoom() {
    const [roomName, setRoomName] = useState('');
    
    async function createRoomRequest(e) {
        e.preventDefault()
        const url = 'http://localhost:8000/rooms/';
        const csrftoken = getCookie('csrftoken');
        const response = await fetch(url, {
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
        console.log(response)
        if (response.status === 201) {
            console.log('created, todo redirect(?)')
        }
        setRoomName('')
    } 

    return (
        <Layout>
            <Form className="mx-auto w-75" onSubmit={createRoomRequest}>
                <Form.Group className="mb-3">
                    <Form.Label><h5>Room name</h5></Form.Label>
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
                <Button variant="primary" type="submit">Submit</Button>
            </Form>
        </Layout>
    )
}