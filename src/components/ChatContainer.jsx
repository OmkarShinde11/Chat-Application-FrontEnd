import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchChatsByRoom, fetchRoomMembers, setMessage } from '../Store/roomStore';
import { IconButton, Menu,MenuItem, Popover } from '@mui/material';
// import { getAllUsers } from '../Store/authStore';

import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { openDialog } from '../Store/dialogStore';
import ReactionDialog from './Dialogs/ReactionDialog';

export default function ChatContainer() {
    const selectedRoom=useSelector((state)=>state.room.selectedRoom);
    const {selectedRoomChats,loadingChats}=useSelector((state)=>state.room);
    const {user}=useSelector((state)=>state.auth)
    const dispatch=useDispatch();

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [hoveredMessageId, setHoveredMessageId] = useState(null);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuPosition, setMenuPosition] = useState(null);
    const [reactionAnchor, setReactionAnchor] = useState(null);
    const [reactionPosition, setReactionPosition] = useState(null);





    const handleMenuOpen = (event, message) => {
      setMenuAnchor(event.currentTarget);
      setSelectedMessage(message);
      setMenuPosition({
        mouseX: event.clientX,
        mouseY: event.clientY,
      });
    };
  
    const handleMenuClose = () => {
      setMenuAnchor(null);
      setMenuPosition(null);
      dispatch(setMessage(selectedMessage))
    };

    const handleReactionOpen = (event, message) => {
      setReactionAnchor(event.currentTarget);
      setSelectedMessage(message);
      setReactionPosition({
        mouseX: event.clientX,
        mouseY: event.clientY,
      });
    };
  
    const handleReactionClose = () => {
      setReactionAnchor(null);
      setReactionPosition(null);
    };


    const formatTime = (dateString) => {
      const date = new Date(dateString);
      const time = date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      const day = date.toLocaleDateString('en-IN', { weekday: 'short' });
      return `${time} • ${day}`;
    };

    const handleOpenReactionDialog=(data)=>{
      dispatch(openDialog({
        component:<ReactionDialog chats={data}/>
      }))
    }

    useEffect(()=>{
        if(selectedRoom?.id){
            dispatch(fetchRoomMembers(selectedRoom?.id));
            dispatch(fetchChatsByRoom(selectedRoom?.id));
        }
    },[selectedRoom,dispatch]);
  return (
    <div>
        {
            loadingChats && (
                <p>...Loadign Chats</p>
            ) 
        }
        {
            !loadingChats && selectedRoomChats?.length==0 && (
                <>
                <p className='text-center'>No conversations happpen yet</p>
                <p className='text-center'>Send first message</p>
                </>

            )
        }
        {
            selectedRoomChats?.length > 0 && (
                <div>
                    {
                        selectedRoomChats.map((chat)=>(
                            <div className='mb-5 relative' key={chat?.id}>
                              {chat.type==='user' && (
                                <>
                                <div
                                key={chat?.id}
                                onMouseEnter={() => setHoveredMessageId(chat.id)}
                                onMouseLeave={() => setHoveredMessageId(null)}
                                className={`flex mb-2 ${
                                  chat?.user_id === user?.id ? 'justify-end' : 'justify-start'
                                }`}
                              >
                                <div className='relative group'>
                                <div
                                  className={`max-w-[100%] px-3 py-2 rounded-lg text-sm ${
                                    chat?.user_id === user?.id
                                      ? 'bg-blue-500 text-white rounded-br-none'
                                      : 'bg-gray-200 text-black rounded-bl-none'
                                  }`}
                                >
                                  {
                                    chat?.reply_to_message_id && (
                                      <div  className={`mb-1 px-2 py-1 border-l-4 text-xs rounded ${
                                        chat.user_id === user.id
                                          ? 'bg-blue-400/20 border-white text-white'
                                          : 'bg-gray-300 border-gray-600 text-black'
                                      }`}>
                                        <div className="truncate">
                                          {chat?.replyTo?.message}
                                        </div>
                                      </div>
                                    )
                                  }
                                  {chat.message}
                                </div>

                                {hoveredMessageId === chat.id && (
                        <div
                          className={`absolute top-0 ${
                            chat?.user_id === user?.id
                              ? '-left-16'
                              : '-right-[80px]'
                          } flex items-center gap-1`}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) =>
                              handleReactionOpen(e, chat)
                            }
                          >
                            <InsertEmoticonIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            onClick={(e) =>
                              handleMenuOpen(e, chat)
                            }
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </div>
                      )}
                                </div>

                              </div>
                              {
                                chat?.reaction &&chat?.reaction?.length > 0 && (
                                  <div className={`flex gap-1 mt-1 ${chat?.user_id === user?.id ? 'justify-end' : 'justify-start'}`}>
                                    {chat?.reaction.map((r)=>(
                                      <div
                                      key={r.emoji}
                                      onClick={() => handleOpenReactionDialog(chat)}
                                      className={`flex items-center gap-1 px-2 py-[2px] 
                                                 bg-gray-100 rounded-full text-xs cursor-pointer 
                                                 border hover:bg-gray-200 `}
                                    >
                                      <span>{r.emoji}</span>
                                      <span>{r.count}</span>
                                    </div>
                                    ))}
                                  </div>
                                )
                              }

                              <div className={`mb-1 text-xs text-gray-500 ${chat?.user_id === user?.id ? 'text-right' : 'text-left'}`}>
                                  <span className="font-semibold">{chat?.user?.name}</span>
                                  <span className="ml-1">{formatTime(chat?.created_at)}</span>
                                </div>
                                </>
                              )}
                              {
                                chat.type==='system' && (
                                  <div key={chat?.id}
                                  className='flex mb-2 justify-center'>
                                    <div className='max-w-[70%] px-2 py-1 rounded-lg text-sm font-bold text-black border rounded-lg'>
                                      {chat?.message}
                                    </div>
                                  </div>
                                )
                              }
                            </div>
                        ))
                    }
                </div>
            )
        }
        <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorReference="anchorPosition"
        anchorPosition={
          menuPosition !== null
            ? { top: menuPosition.mouseY, left: menuPosition.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            console.log('Reply', selectedMessage);
            handleMenuClose();
          }}
        >
          Reply
        </MenuItem>

        {selectedMessage?.user_id === user?.id && (
          <MenuItem
            onClick={() => {
              console.log('Edit', selectedMessage);
              handleMenuClose();
            }}
          >
            Edit
          </MenuItem>
        )}
      </Menu>

      <Popover
        open={Boolean(reactionAnchor)}
        anchorEl={reactionAnchor}
        onClose={handleReactionClose}
        anchorReference="anchorPosition"
        anchorPosition={
          reactionPosition !== null
            ? {
                top: reactionPosition.mouseY - 50,  // move slightly above click
                left: reactionPosition.mouseX,
              }
            : undefined
        }
      >
        <div className="flex gap-2 p-2 text-lg cursor-pointer">
          {['👍', '❤️', '😂', '😮', '😢'].map((emoji) => (
            <span
              key={emoji}
              onClick={() => {
                console.log('Reacted:', emoji, selectedMessage);
                handleReactionClose();
              }}
            >
              {emoji}
            </span>
          ))}
        </div>
      </Popover>
    </div>
  )
}


