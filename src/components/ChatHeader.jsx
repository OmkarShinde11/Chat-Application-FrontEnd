import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoPeople } from "react-icons/io5";
import { IoPersonAddSharp } from "react-icons/io5";
import { openDialog } from '../Store/dialogStore';
import AddMemberDialog from './Dialogs/AddMemberDialog';


export default function ChatHeader() {
    const {selectedRoomMembers,selectedRoom}=useSelector((state)=>state.room);
    const {allUsers}=useSelector((state)=>state.auth);
    const [filteredUsers,setFilteredUsers]=useState([]);
    console.log(selectedRoomMembers);
    const dispatch=useDispatch();
    function openModal(){
        dispatch(openDialog({
            component:<AddMemberDialog users={filteredUsers}/>
        }))
    };
    useEffect(()=>{
        const id=new Set(selectedRoomMembers.map(user=>user?.user_id));
        const filtered=allUsers.filter(user=>!id.has(user.id));
        console.log(filtered);
        setFilteredUsers(filtered);
    },[allUsers,selectedRoomMembers])

  return (
    <div className='flex justify-between items-center'>
        <div>
            <h1>{selectedRoom?.name}</h1>
            {selectedRoomMembers?.length > 0 && (
            <div className="flex gap-2 text-sm text-gray-600">
                <IoPeople className='text-xl cursor-pointer'/>
                {selectedRoomMembers.map(member => (
                    <h5 key={member.user_id}>{member?.user?.name.split(' ')[0]}</h5>
                ))}
            </div>
        )}
        </div>
        <div>
            {selectedRoom?.roomType==='group' && (
                <IoPersonAddSharp title="Add Member" className='text-2xl text-blue-500 cursor-pointer' onClick={openModal}/>
            ) }
            {/* <button className='border border-blue-500 text-white rounded px-3 py-2 bg-blue-500 rounded'>Add Member</button> */}
        </div>
    </div>
  )
}
