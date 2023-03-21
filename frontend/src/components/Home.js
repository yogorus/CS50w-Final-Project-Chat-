import { useEffect } from 'react';
import getCookie from '../utils/getCookie';

export default function Home() {
    useEffect(() => {
        async function fetchRooms() {
            const url = 'http://localhost:8000/rooms';
            const csrftoken = getCookie('csrftoken');
            const request = await fetch(url, {
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': csrftoken,
                    'Authorization': `Token ${JSON.parse(window.localStorage.getItem('token'))}`
                },
            })
            const response = await request.json()
            console.log(response)
        }
        fetchRooms()
    }, [])
    
    return(
        <div>
            
        </div>
    )
}