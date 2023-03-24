import { useState } from "react";
import getCookie from "../utils/getCookie";

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
        
    } 

    return (
        <form onSubmit={createRoomRequest}>
            <input 
            type="text" 
            name="room-name" 
            id="room-name"
            placeholder="Set Room Name"
            value={roomName}
            autoFocus={true}
            onChange={(e) => setRoomName(e.target.value)} />
            <button type="submit">Create Room</button>
        </form>
    )
}