import { useEffect, useState, useRef} from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Card, Button } from 'react-bootstrap';
import getCookie from '../utils/getCookie';
import Layout from './Layout';

export default function Room() {
    let params = useParams();
    const roomSlug = params.roomSlug;
    
    const location = useLocation();
    let room = location.state.room;
    
    // const chatBoxRef = useRef(null)

    const [state, setState] = useState({
        messages: room.messages,
    })
    
    
    useEffect(() => {
        getWebSocket()
        // scrollToBottom() 
        console.log('useEffect triggered')
    }, [])

    // const scrollToBottom = () => chatBoxRef.current?.scrollIntoView({behavior: "smooth"})   

    // Websocket functionality
    function getWebSocket() {
        const chatSocket = new WebSocket(
            'ws://'
            + window.location.hostname
            + ':8000'
            + '/ws/chat/'
            + roomSlug
            + '/'
        );
    
        chatSocket.onopen = (e) => {
            // const messages = JSON.parse(e.data);
            // document.querySelector('#chat-log').value = '';
            console.log(e.data);
        };
    
        chatSocket.onmessage = function(e) {
            const data = JSON.parse(e.data);
            console.log(data)
            if (data.type === 'chat_message') {
                const prevMsgs = state.messages;
                const result = [...prevMsgs, ...data.message]
                setState({
                    ...state,
                    messages: result  
                })
            } else {
                console.log('unexpected behavior')
            }
            
        };
    
        chatSocket.onclose = function(e) {
            console.error('Chat socket closed unexpectedly');
        };
    }

    const messages = state.messages.map(msg => 
        <Card key={msg.id}>
            <Card.Header>
                <Card.Title>
                    {msg.user.username}
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
                        <h2>{room.name}</h2>
                    </Card.Title>
                </Card.Header>
                <Card.Body>
                    <div className="chatbox">
                        {messages}
                        

Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut purus et quam elementum congue. Nulla faucibus non nulla a rutrum. Etiam et elit eget augue aliquam malesuada. Vestibulum et arcu sed mi commodo viverra nec id turpis. Sed urna ligula, dignissim pharetra tellus sit amet, maximus rhoncus lorem. Integer blandit justo bibendum, interdum lorem vel, molestie ex. Proin eu lorem tincidunt, consectetur felis et, volutpat erat. Mauris dignissim bibendum diam, quis ultrices sapien tempor vel. Donec sodales, nibh nec semper porttitor, tortor justo euismod odio, id efficitur mi erat ac nisi. Proin rutrum eu ante in varius. Curabitur convallis vel purus in elementum. Sed scelerisque ipsum sit amet metus eleifend blandit. Aliquam eu molestie ipsum. Nunc ultricies finibus ornare.

Duis convallis augue metus, sed molestie risus placerat eget. Mauris eu elementum felis. Aliquam erat volutpat. Maecenas feugiat feugiat est. Donec eleifend felis nisi, id posuere elit accumsan quis. Nullam at erat ut tortor finibus ultrices. Donec at mauris sit amet tortor tincidunt faucibus. Donec eget nibh massa. Duis semper consectetur pulvinar. Vestibulum condimentum ac neque ut aliquet. Praesent vitae ipsum interdum, condimentum ante id, venenatis nunc. Sed turpis elit, molestie at pulvinar imperdiet, facilisis auctor massa. Aenean quis augue eros.

Nullam vitae euismod justo, non faucibus orci. Ut ornare tristique interdum. Vivamus id dictum ex. Praesent luctus lacus vitae bibendum consequat. Praesent tellus nisi, rhoncus a ligula at, ultricies imperdiet est. Nam lobortis magna vitae nibh dignissim congue. Etiam pretium pretium mollis. Sed vitae tempor magna. Proin sodales libero at semper dapibus. Duis et euismod elit. Quisque ac lorem felis. Suspendisse iaculis porta velit vitae facilisis. Fusce auctor quam vitae magna ultricies accumsan. Proin volutpat eros id felis blandit porttitor. Nullam consectetur, elit vel lacinia auctor, lectus eros auctor tellus, et volutpat metus dolor id magna. Ut fringilla placerat felis, dapibus consequat ex auctor ut.

Pellentesque rhoncus varius sapien quis porttitor. Pellentesque lobortis eu leo ac dignissim. Sed ultrices volutpat dui, et porttitor sem. Suspendisse sollicitudin neque nec mi sollicitudin, eget blandit felis vehicula. In lorem tortor, bibendum et sollicitudin at, posuere eu arcu. Proin vitae est quis eros imperdiet consectetur quis sed libero. Suspendisse potenti. Nunc molestie urna eget ante efficitur, in dapibus nunc volutpat. Cras convallis, sem et tincidunt venenatis, nibh enim condimentum lacus, vel aliquet dolor risus id turpis. Pellentesque eu blandit tellus, ac euismod lectus. In ligula enim, vehicula ac nunc volutpat, posuere pharetra nulla.

Mauris interdum convallis condimentum. Praesent vitae orci augue. Ut condimentum nunc eget lacus hendrerit bibendum. Ut tincidunt fringilla nisi, vestibulum pellentesque augue sollicitudin vel. Praesent sit amet ante eleifend, blandit dolor ut, eleifend sapien. Phasellus at pellentesque tellus, sed posuere quam. Vestibulum vitae nisl sed mauris malesuada volutpat sit amet molestie risus. 


Lorem ipsum dolor sit amet, consectetur adipiscing elit. In ut purus et quam elementum congue. Nulla faucibus non nulla a rutrum. Etiam et elit eget augue aliquam malesuada. Vestibulum et arcu sed mi commodo viverra nec id turpis. Sed urna ligula, dignissim pharetra tellus sit amet, maximus rhoncus lorem. Integer blandit justo bibendum, interdum lorem vel, molestie ex. Proin eu lorem tincidunt, consectetur felis et, volutpat erat. Mauris dignissim bibendum diam, quis ultrices sapien tempor vel. Donec sodales, nibh nec semper porttitor, tortor justo euismod odio, id efficitur mi erat ac nisi. Proin rutrum eu ante in varius. Curabitur convallis vel purus in elementum. Sed scelerisque ipsum sit amet metus eleifend blandit. Aliquam eu molestie ipsum. Nunc ultricies finibus ornare.

Duis convallis augue metus, sed molestie risus placerat eget. Mauris eu elementum felis. Aliquam erat volutpat. Maecenas feugiat feugiat est. Donec eleifend felis nisi, id posuere elit accumsan quis. Nullam at erat ut tortor finibus ultrices. Donec at mauris sit amet tortor tincidunt faucibus. Donec eget nibh massa. Duis semper consectetur pulvinar. Vestibulum condimentum ac neque ut aliquet. Praesent vitae ipsum interdum, condimentum ante id, venenatis nunc. Sed turpis elit, molestie at pulvinar imperdiet, facilisis auctor massa. Aenean quis augue eros.

Nullam vitae euismod justo, non faucibus orci. Ut ornare tristique interdum. Vivamus id dictum ex. Praesent luctus lacus vitae bibendum consequat. Praesent tellus nisi, rhoncus a ligula at, ultricies imperdiet est. Nam lobortis magna vitae nibh dignissim congue. Etiam pretium pretium mollis. Sed vitae tempor magna. Proin sodales libero at semper dapibus. Duis et euismod elit. Quisque ac lorem felis. Suspendisse iaculis porta velit vitae facilisis. Fusce auctor quam vitae magna ultricies accumsan. Proin volutpat eros id felis blandit porttitor. Nullam consectetur, elit vel lacinia auctor, lectus eros auctor tellus, et volutpat metus dolor id magna. Ut fringilla placerat felis, dapibus consequat ex auctor ut.

Pellentesque rhoncus varius sapien quis porttitor. Pellentesque lobortis eu leo ac dignissim. Sed ultrices volutpat dui, et porttitor sem. Suspendisse sollicitudin neque nec mi sollicitudin, eget blandit felis vehicula. In lorem tortor, bibendum et sollicitudin at, posuere eu arcu. Proin vitae est quis eros imperdiet consectetur quis sed libero. Suspendisse potenti. Nunc molestie urna eget ante efficitur, in dapibus nunc volutpat. Cras convallis, sem et tincidunt venenatis, nibh enim condimentum lacus, vel aliquet dolor risus id turpis. Pellentesque eu blandit tellus, ac euismod lectus. In ligula enim, vehicula ac nunc volutpat, posuere pharetra nulla.

Mauris interdum convallis condimentum. Praesent vitae orci augue. Ut condimentum nunc eget lacus hendrerit bibendum. Ut tincidunt fringilla nisi, vestibulum pellentesque augue sollicitudin vel. Praesent sit amet ante eleifend, blandit dolor ut, eleifend sapien. Phasellus at pellentesque tellus, sed posuere quam. Vestibulum vitae nisl sed mauris malesuada volutpat sit amet molestie risus. 
                    <ScrollToBottom />
                    </div>
                    <div className="form-group mt-1">
                        <textarea className='form-control mb-1' autoFocus></textarea>
                        <Button>Send</Button>
                    </div>
                </Card.Body>
            </Card>
            <button onClick={() => console.log(state)}>Click to check state</button>
        </Layout>
    )
}

const ScrollToBottom = () => {
    const bottomRef = useRef();
    useEffect(() => bottomRef.current.scrollIntoView());
    return <div ref={bottomRef} />;
};

