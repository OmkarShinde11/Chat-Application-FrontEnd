import React, { useState } from 'react';
import {Dialog,DialogTitle,DialogContent,Tabs,Tab,Avatar,List,ListItem,ListItemAvatar,ListItemText, DialogActions} from '@mui/material';
import { closeDialog } from '../../Store/dialogStore';
import Button from '../commomComponents/Button';
import { useDispatch, useSelector } from 'react-redux';
import { MdDelete } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";
import EmojiPicker from 'emoji-picker-react';



export default function ReactionDialog({chats,onSubmit}) {
    const dispatch=useDispatch();
    const [openReaction,setOpenReaction]=useState(false);
    const {user}=useSelector((state)=>state.auth);
    const {selectedRoom}=useSelector((state)=>state.room);

    function deleteReaction(data,reaction){
      if (typeof onSubmit !== "function") return;
      console.log(data,reaction);
      const payload={
        emoji:reaction?.emoji,
        userId:user?.id,
        chatId:data?.id,
        roomId:selectedRoom?.id
      };
      console.log(payload);
      onSubmit(payload);
    }
  return (
    <>
    <div className='flex justify-between items-center'>
        <DialogTitle>Reactions</DialogTitle>
        <IoMdAddCircleOutline title='Add Reaction' className='text-2xl text-blue-500 cursor-pointer' onClick={()=>setOpenReaction((reaction)=>!reaction)} />
    </div>
        <DialogContent dividers>
          {
            openReaction && (
              <div className="absolute  left-[160px] z-50">
                <EmojiPicker height={350} width={300}/>
              </div>
            )
          }
    {chats &&
      chats?.reaction.map((group) => (
        <div key={group?.emoji} className="mb-4">
          <div className="text-lg font-semibold mb-2">
            {group?.emoji} {group?.count}
          </div>

          <List dense>
            {group?.users?.map((u) => (
              <ListItem key={u?.id}>
                <ListItemAvatar>
                  <Avatar>{u?.name[0]}</Avatar>
                </ListItemAvatar>
                <ListItemText primary={u?.name} />
                {
                  user?.id == u?.id && (
                    <MdDelete title='remove Action' className='cursor-pointer text-2xl text-red-500' onClick={()=>deleteReaction(chats,group)} />
                  )
                }
              </ListItem>
            ))}
          </List>
        </div>
      ))}
  </DialogContent>
  <DialogActions>
            <Button onClick={() => dispatch(closeDialog())}>Close</Button>
            {/* <Button onClick={startDirectConversation}>Create New Conversation </Button> */}
          </DialogActions>
    </>
  )
}