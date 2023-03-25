import { useEffect, useState } from 'react';
import getCookie from '../utils/getCookie';
import Layout from './Layout';
import { Button, Card, CardGroup } from 'react-bootstrap';

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
        // <div key={room.id} className="col">
            <Card key={room.id} className="m-2">
                <Card.Header>
                    <Card.Title>
                        {/* <a href={'room/' + room.slug + '/'}>{room.name}</a> */}
                        {room.name}
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    <Card.Subtitle>
                        Host: <b>{room.host.username}</b>
                    </Card.Subtitle>
                    <Card.Text>
                        lorem ipsum and all that
                    </Card.Text>
                </Card.Body>
                <a href={'room/' + room.slug + '/'} className='mx-auto mb-1'>
                    <Button variant='primary'>Enter</Button>
                </a>
                {/* <Button variant='primary'></Button> */}
            </Card>
        // {/* </div> */}
    );

    return(
        <Layout>
            <h1>My rooms</h1>
            <div className="row">
                <div className="col-12">
                    <CardGroup>
                        {rooms}
                    </CardGroup>
                </div>
            </div>
        </Layout>
    )
}