import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';

import { useSocket } from '../Context/socketContext';
import Button from './commomComponents/Button';
import EmojiPicker from 'emoji-picker-react';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { IconButton } from '@mui/material';
import { resetSelectedMessage } from '../Store/roomStore';


export default function ChatInput() {
    const socket=useSocket();
    const [input,setInput]=useState('');
    const {selectedRoom,selectedMessage}=useSelector((state)=>state.room);
    const {user}=useSelector((state)=>state.auth);
    const [showEmoji, setShowEmoji] = useState(false);
    const [mode,setMode]=useState('');
    const dispatch=useDispatch();

    useEffect(()=>{
      if(selectedMessage){
        // setInput(selectedMessage?.message);
        setMode('reply');
      }
    },[selectedMessage])

    function keyPress(e){
        if(e.key=='Enter'){
            console.log(input);
            sendMessage();
        }
    };

    function sendMessage(){
        if (!socket) return;
        console.log(input);
        // setInput('');
        let sendPayload={
            roomId:selectedRoom?.id,
            userId:user?.id,
            message:input,
        };
        if(selectedMessage && mode==='reply') sendPayload['reply_to_message_id']=selectedMessage?.id;
        console.log(sendPayload);
        socket.emit('sendMessage',sendPayload);
        setInput('');
        if(selectedMessage && mode==='reply'){
          closeReply();
        };
    }

    function handleEmojiClick(emojiData){
      setInput((prev) => prev + emojiData.emoji);
      setShowEmoji(false);
    }

    function closeReply(){
      setMode('');
      dispatch(resetSelectedMessage());
    }
  return (
    <div className="relative flex items-center gap-2">
       <IconButton onClick={() => setShowEmoji((prev) => !prev)}>
        <InsertEmoticonIcon />
      </IconButton>

      {/* Emoji Picker */}
      {showEmoji && (
        <div className="absolute bottom-14 left-0 z-50">
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            height={350}
            width={300}
          />
        </div>
      )}
      {
        selectedMessage && mode==='reply' && (
          <div className="absolute -top-16 left-0 right-0 bg-gray-100 border-l-4 border-blue-500 p-2 rounded flex justify-between items-start">
            <div>
              <div className="text-sm text-gray-700 truncate max-w-[90%]">
                {selectedMessage?.message}
              </div>
            </div>
            <button className="text-gray-500 hover:text-red-500 text-sm" onClick={closeReply}>✕</button>
          </div>
        )
      }
        <input
        className="w-[90%] border rounded px-3 py-2"
        placeholder="Type a message…"
        value={input}
        onChange={(e)=>setInput(e.target.value)}
        onKeyDown={(e)=>keyPress(e)}
      />
      {/* <button onClick={sendMessage} className='w-[10%] border border-blue-500 text-white rounded px-3 py-2 bg-blue-500'>Send</button> */}
      <Button onClick={sendMessage}>Send</Button>
    </div>
  )
}
