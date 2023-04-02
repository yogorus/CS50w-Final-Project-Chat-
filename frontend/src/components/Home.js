import { useEffect, useState } from 'react';
import getCookie from '../utils/getCookie';
import Layout from './Layout';
import { Button, Card, CardGroup, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    let navigate = useNavigate();
    const [state, setState] = useState({
        rooms: [],
    })
    
    const [myRooms, setMyRooms] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")

    useEffect(() => {
        async function fetchRooms() {
            const url = `http://localhost:8000/rooms/?my_rooms=${myRooms}&search=${searchQuery}`;
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

        return () => {
            setState({...state, rooms: []})
        }
    }, [myRooms, searchQuery])

    const rooms = state.rooms.map(room => 
        <Col xs={6} md={4} lg={3} key={room.id}>
            <Card className='m-2'>
                <Card.Header>
                    <Card.Title>
                        <h4>{room.name}</h4>
                    </Card.Title>
                    <Card.Subtitle>
                        <span className='text-muted'>Host: </span>
                        {room.host.username}
                    </Card.Subtitle>
                </Card.Header>
                <Card.Body className='p-2'>
                    {room.messages.length > 0 ?
                        <>
                            <Card.Subtitle>Last Message:</Card.Subtitle>
                            <Card.Text className='last-message'>
                                {/* the ? sign is called chaining */}
                                <b>{room.messages.slice(-1)[0]?.username}</b>: {room?.messages.slice(-1)[0]?.text}
                            </Card.Text>   
                        </>
                        :
                        <Card.Text>No messages yet...</Card.Text>
                    }
                </Card.Body>
                <Button variant='outline-primary' onClick={() => navigate(`room/${room.slug}/`, { state: {room: room} })}>Enter</Button>
            </Card>
        </Col>    
    )

    return(
        <Layout>
            <Button></Button>
            <h1>My rooms</h1>
            <Container fluid>
                <Row className='align-items-center'>
                    {rooms}
                </Row>
            </Container>
        </Layout>
    )
}

