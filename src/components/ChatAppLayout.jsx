import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addNewMessage, fetchRooms } from '../Store/roomStore';
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
  const dispatch = useDispatch();
  const {selectedRoom}=useSelector((state)=>state.room);
  const prevRoom=useRef();

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

          <div className="flex-1 overflow-y-auto p-4">
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
