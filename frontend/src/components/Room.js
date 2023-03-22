import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import getCookie from '../utils/getCookie';

export default function Room() {
    let params = useParams();
    const roomName = params.roomName
    
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
            data.messages.forEach(e => {
                const message = e;
                // document.querySelector('#chat-log').value += (message.text + '\n')
            })
        } else {
            // document.querySelector('#chat-log').value += (data.message.text + '\n');
        } 
    };

    chatSocket.onclose = function(e) {
        console.error('Chat socket closed unexpectedly');
    };

    return (
        <>
        {roomName}
        </>
    )
}

