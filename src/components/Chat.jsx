import queryString from 'query-string';
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

let socket;
const endPoint='localhost:5000'

export default function Chat() {
    const [name,setName]=useState(null);
    const [room,setRoom]=useState(null);
    const [messages,setMessages]=useState([]);
    const [message,setMessage]=useState('');
    useEffect(()=>{
        const {name,room}=queryString.parse(location.search);
        socket=io(endPoint);
        setName(name);
        setRoom(room);

        socket.emit('join',{name,room},()=>{

        });

        return ()=>{
            socket.disconnect();
        }
    },[endPoint]);

    useEffect(()=>{
        socket.on('message',(message)=>{
            setMessages((prev)=>[...prev,message]);
        });
    },[messages]);

    function sendMessage(event){
        event.preventDefault();

        if(message){
            socket.emit('sendMessage',message,()=>setMessage(''));
        };
    }

    console.log(message,messages);

  return (
    <>
    <div>Chat</div>
    <input type="text" value={message} onChange={(e)=>setMessage(e.target.value)} onKeyPress={(event)=>event.key==='Enter' ? sendMessage(event):null}/>
    </>
  )
}
