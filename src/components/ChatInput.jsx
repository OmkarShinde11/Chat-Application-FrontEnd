import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';

import { useSocket } from '../Context/socketContext';
import Button from './commomComponents/Button';
import EmojiPicker from 'emoji-picker-react';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { IconButton } from '@mui/material';
import { handleUpload, resetSelectedMessage } from '../Store/roomStore';
import { IoCloudUpload } from "react-icons/io5";


export default function ChatInput() {
    const socket=useSocket();
    const [input,setInput]=useState('');
    const {selectedRoom,selectedMessage}=useSelector((state)=>state.room);
    const {user}=useSelector((state)=>state.auth);
    const [showEmoji, setShowEmoji] = useState(false);
    const [mode,setMode]=useState('');
    const [inputFile,setInputFile]=useState('');
    const dispatch=useDispatch();

    const fileInputRef=useRef(null);  

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
      console.log(input);
      setShowEmoji(false);
    }

    function closeReply(){
      setMode('');
      dispatch(resetSelectedMessage());
    }

    function handleChange(e){
      console.log(e?.target?.files);
      setInputFile(e?.target?.files);
      const formData=new FormData();
      formData.append('file',e?.target?.files[0]);
      formData.append('room_id',selectedRoom?.id);
      formData.append('user_id',user?.id);
      dispatch(handleUpload(formData));
    }

    function handleFileClick(){
      fileInputRef.current.click();
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
        onChange={(e)=>setInput(e.target.value)}
        onKeyDown={(e)=>keyPress(e)}
      />
      <div>
        <input type='file' ref={fileInputRef} style={{ display: "none" }}
        onChange={handleChange}/> 
      <IoCloudUpload title='Upload' className='text-2xl text-blue-500 cursor-pointer' onClick={handleFileClick}/>
      </div>
      {/* <button onClick={sendMessage} className='w-[10%] border border-blue-500 text-white rounded px-3 py-2 bg-blue-500'>Send</button> */}
      <Button onClick={sendMessage}>Send</Button>
    </div>
  )
}
