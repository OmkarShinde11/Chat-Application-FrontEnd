import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Loader';
import { changeSelectedRoom } from '../Store/roomStore';
import { IoIosAdd } from "react-icons/io";
import { openDialog } from '../Store/dialogStore';
import AddRoomDialog from './Dialogs/AddRoomDialog';


export default function ChatList() {
    const loadingSpinner=useSelector(state=>state.room.loadingRooms);
    const {rooms,selectedRoom}=useSelector(state=>state.room) || [];
    const {user,allUsers}=useSelector((state)=>state.auth);
    const dispatch=useDispatch();
    function changeRoom(room){
        dispatch(changeSelectedRoom(room));
    }
    function openRoomChat(){
      dispatch(openDialog({
        component:<AddRoomDialog users={allUsers}/>
      }))
    }
  return (
    <div>
        <div className='flex justify-between items-center mb-6'>
            <h2 className="font-semibold">Room Chats</h2>
            <IoIosAdd title="Add Room" onClick={openRoomChat} className="text-2xl text-blue-500 cursor-pointer"/>
        </div>
      {loadingSpinner && rooms.length==0 && (
        <Loader/>
      )}
      {
        !loadingSpinner && rooms.length==0 && (
            <p>No Rooms Found</p>
        )
      }
      {
        rooms.map(room => (
            <div
              key={room.id}
              onClick={()=>changeRoom(room)}
              className={`p-2 cursor-pointer hover:bg-gray-200 rounded ${selectedRoom?.id==room.id ? 'bg-blue-500 text-white':''}`}
            >
              <h5 className="font-medium">{room.name}</h5>
            </div>
          ))
      }
    </div>
  )
}
