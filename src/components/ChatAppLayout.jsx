import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewMessage, fetchChatsByRoom, fetchRooms } from '../Store/roomStore';
import ChatList from './ChatList';
import ChatHeader from './ChatHeader';
import ChatContainer from './ChatContainer';
import ChatInput from './ChatInput';
import io from 'socket.io-client';
import { SocketContext } from '../Context/socketContext';
import { getAllUsers } from '../Store/authStore';

const endPoint = 'http://localhost:5000';

export default function ChatAppLayout() {
  const socketRef = useRef(null);
  const chatRef=useRef(null);
  const dispatch = useDispatch();
  const {selectedRoom,selectedRoomPage,hasMore}=useSelector((state)=>state.room);
  const prevRoom=useRef();
  const autoScroll=useRef();

  useEffect(() => {
    dispatch(fetchRooms());
    dispatch(getAllUsers());
  }, [dispatch]);

  useEffect(() => {
    socketRef.current = io(endPoint, {
      transports: ['websocket'],
    });
    if(prevRoom.current){
      socketRef.current.emit('leaveRoom',prevRoom.current);
    }
    socketRef.current.emit('join',selectedRoom?.id);
    prevRoom.current=selectedRoom?.id;

    return () => {
      socketRef.current.disconnect();
    };
  }, [selectedRoom]);

  useEffect(()=>{
    if (!socketRef.current) return;

    const handleNewMessage = (message) => {
      // only append if message belongs to current room
      if (message.room_id === selectedRoom?.id) {
        dispatch(addNewMessage(message));
      }
    };

    socketRef.current.on('new-message', handleNewMessage);

    return () => {
      socketRef.current.off('new-message', handleNewMessage);
    };
  },[dispatch,selectedRoom])

  useEffect(()=>{
    let timer=setTimeout(() => {
      if (chatRef.current) {
        autoScroll.current=true;
        chatRef.current.scrollTo({
          top: chatRef.current.scrollHeight,
          behavior: "smooth", // ✅ smooth scroll
        });
        setTimeout(()=>{
          autoScroll.current=false;
        },500)
      }
    }, 2000); 

    return()=>{
      clearTimeout(timer);
    }
  },[dispatch,selectedRoom]);

  async function handleScroll(){
    if(!chatRef.current) return;
    if(autoScroll.current) return;
    if(hasMore)return;
    if(chatRef.current.scrollTop < 50){
      console.log('scroll');
      await dispatch(fetchChatsByRoom({roomId:selectedRoom?.id,page_number:selectedRoomPage+1,page_size:10}));
    }
  }

  return (
    <SocketContext.Provider value={socketRef.current}>
      <div className="h-screen grid grid-cols-3">
        {/* Sidebar */}
        <aside className="col-span-1 border-r bg-gray-100 p-4">
          <ChatList />
        </aside>

        {/* Chat Container */}
        <main className="col-span-2 h-screen flex flex-col">
          <div className="border-b p-4 font-semibold">
            <ChatHeader />
          </div>

          <div className="flex-1 overflow-y-auto p-4" ref={chatRef} onScroll={handleScroll}>
            <ChatContainer />
          </div>

          <div className="border-t p-4">
            <ChatInput />
          </div>
        </main>
      </div>
    </SocketContext.Provider>
  );
}
