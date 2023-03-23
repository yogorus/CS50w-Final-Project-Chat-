import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import getCookie from '../utils/getCookie';
import Layout from './Layout';

export default function Room() {
    let params = useParams();
    const [state, setState] = useState({
        messages: [],
    })
    
    const roomName = params.roomName
    
    useEffect(() => {
        getWebSocket()
    }, [])

    // Websocket functionality
    function getWebSocket() {
        const chatSocket = new WebSocket(
            'ws://'
            + window.location.hostname
            + ':8000'
            + '/ws/chat/'
            + roomName
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
            if (data.type === 'load_messages') {
                const prevMsgs = state.messages;
                setState({
                    ...state,
                    messages: prevMsgs.concat(data.messages) // concatenate two arrays
                })
                // console.log(state)
            } else {
                setState({
                    messages: [...state.messages, data.message]
                })
                // document.querySelector('#chat-log').value += (data.message.text + '\n');
                console.log('single msg ' + data.message)
            }
            
        };
    
        chatSocket.onclose = function(e) {
            console.error('Chat socket closed unexpectedly');
        };
    }

    // DOM render
    return (
        <Layout>
            {roomName}
            <button onClick={() => console.log(state)}>Click to check state</button>
        </Layout>
    )
}

