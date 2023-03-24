import { useEffect, useState } from 'react';
import getCookie from '../utils/getCookie';
import Layout from './Layout';

export default function Home() {
    const [state, setState] = useState({
        'rooms': []
    })

    useEffect(() => {
        async function fetchRooms() {
            const url = 'http://localhost:8000/rooms/';
            const csrftoken = getCookie('csrftoken');
            const request = await fetch(url, {
                headers: {
                    'Content-type': 'application/json',
                    'X-CSRFToken': csrftoken,
                    'Authorization': `Token ${JSON.parse(window.localStorage.getItem('token'))}`
                },
            })
            console.log(request)
            const response = await request.json()
            setState({
                rooms: response
            })
            console.log(response)
        }
        fetchRooms()
    }, [])

    const rooms = state.rooms.map(room =>
        <li 
        key={room.id}
        >
            <a href={'/room/' + room.slug}>{room.name}</a>
        </li>
    );

    return(
        <Layout>
            <div>
                <ul>
                    {rooms}
                </ul>
            </div>
        </Layout>
    )
}