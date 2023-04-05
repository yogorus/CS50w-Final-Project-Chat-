import { useEffect, useState, useRef} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Card, Button, Form, DropdownButton } from 'react-bootstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import Layout from './Layout';
import DropdownToggle from 'react-bootstrap/esm/DropdownToggle';

export default function Room() {
    const location = useLocation();
    let room = location.state.room;
    
    const token = JSON.parse(window.localStorage.getItem('token'));
    const userId = JSON.parse(window.localStorage.getItem('user_id'));
    const username = JSON.parse(window.localStorage.getItem('username'));

    
    const [chatSocketReady, setChatSocketReady] = useState(false);
    const [chatSocket, setChatSocket] = useState(null);

        // `ws://${window.location.hostname}:8000/ws/chat/${room.slug}/?token=${token}`
    const [state, setState] = useState({
        textToSend: '',
        messages: room.messages,
    })

    useEffect(() => {
        
        const initChat = () => {
            setChatSocket(new WebSocket(
                `ws://${window.location.hostname}:8000/ws/chat/${room.slug}/?token=${token}`
            ));
            setChatSocketReady(true);
        };
        initChat();
        
        return () => {
            if (chatSocketReady) {
                chatSocket.close();
                // setChatSocket(null);
                // setChatSocketReady(false);
            }
        }
    }, []);
    
    useEffect(() => {
        // Websocket functionality
        if(!chatSocketReady) return;

        chatSocket.onopen = (e) => {
            setChatSocketReady(true);
            console.log('connected to websocket');
        };
    
        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            console.log(data)
            if (data.type === 'chat_message') {
                setState(prevState => ({
                    messages: [...prevState.messages, data.message]
                }))
            } else {
                console.log(data)
            }
            
        };
    
        chatSocket.onclose = function(e) {
            setChatSocketReady(false);
            setChatSocket(null);
            console.log('chatsocket closed');
            // setTimeout(() => {
            //     setChatSocket(new WebSocket(
            //         `ws://${window.location.hostname}:8000/ws/chat/${room.slug}/?token=${token}`));
            // }, 5000)
        };

        chatSocket.onerror = function (err) {
            console.log('Socket encountered error: ', err.message, 'Closing socket');
            setChatSocketReady(false);
            chatSocket.close();
          };
          
        console.log('useEffect triggered')
        return () => {
            chatSocket.close();
            // setChatSocket(null)
            // setChatSocketReady(false)
        };
        
    }, [chatSocket])
    
    function pressEnter(e) {
        if (e.key == 'Enter') {
            sendMessage(e);
        }
    }

    async function sendMessage(e) {
        e.preventDefault();
        await chatSocket.send(JSON.stringify({
            message: state.textToSend.trim()
        }))
        setState({...state, textToSend: ''})
        console.log("send")
    }

    const messages = state.messages.map(msg => 
        <Card key={msg.id} className='mb-1'>
            <Card.Header>
                <Card.Title>
                    {msg.username}
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <Card.Text>
                    {msg.text}
                </Card.Text>
                <Card.Subtitle>On: {msg.created_at}</Card.Subtitle>
            </Card.Body>
        </Card>
        );

    // DOM render
    return (
        <Layout>
            <Card className='w-75 mx-auto mt-2'>
                <Card.Header>
                    <Card.Title>
                        <h2 className='d-flex justify-content-between align-items-center'>
                            {room.name}
                            <DropdownButton variant='dark' title="Actions" menuVariant='dark'>
                                {room.current_users.includes(userId)
                                    ? <Dropdown.Item>Leave Room</Dropdown.Item>
                                    : <></>
                                }
                                {room.host.username === username
                                    ? <Dropdown.Item>Delete Room</Dropdown.Item>
                                    : <></>
                                }
                            </DropdownButton>
                        </h2>
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    <div className="chatbox">
                        {messages}
                        {!chatSocketReady ? <h5>Loading...</h5> : <></>}
                        <ScrollToBottom />
                    </div>
                    <Form onSubmit={sendMessage}>
                        <Form.Group className='mt-1'>
                            <Form.Control 
                            as={'textarea'} 
                            className="mb-1" 
                            onChange={(e) => setState({...state, textToSend: e.target.value})}
                            onKeyDown={pressEnter}
                            value={state.textToSend}
                            autoFocus
                            />
                            <Button type='submit'>Send</Button>
                        </Form.Group>
                    </Form>
                </Card.Body>
            </Card>
            <button onClick={() => console.log(state)}>Click to check state</button>
        </Layout>
    )
}

// Auto scroll to the bottom of chatbox
const ScrollToBottom = () => {
    const bottomRef = useRef();
    useEffect(() => bottomRef.current.scrollIntoView({
        behavior: "auto",
        block: "nearest",
        inline: "start"
    }));
    return <div ref={bottomRef} />;
};

