import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { deleteMessageToEveryOne, deleteMessageToMe, fetchChatsByRoom, fetchRoomMembers, restoreDelMeMsg, restoreEveryOneDelMsg, restoreMeMsg, setMessage, updateReaction, updatedeletedMessages, updatedeletedMessagesToMe } from '../Store/roomStore';
import { IconButton, Menu,MenuItem, Popover } from '@mui/material';
// import { getAllUsers } from '../Store/authStore';
import EmojiPicker from 'emoji-picker-react';
import Snackbar from "@mui/material/Snackbar";
import Button from "@mui/material/Button";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import { closeDialog, openDialog } from '../Store/dialogStore';
import ReactionDialog from './Dialogs/ReactionDialog';
import { useSocket } from '../Context/socketContext';
import { FaDownload } from "react-icons/fa6";
import { FileFooter } from './common/FileFooter';
import UndoComponent from './common/UndoComponent';
import { MdDelete } from 'react-icons/md';


export default function ChatContainer() {
    const selectedRoom=useSelector((state)=>state.room.selectedRoom);
    const {selectedRoomChats,loadingChats}=useSelector((state)=>state.room);
    const {user}=useSelector((state)=>state.auth)
    const dispatch=useDispatch();
    const socket=useSocket();

    const [selectedMessage, setSelectedMessage] = useState(null);
    const [hoveredMessageId, setHoveredMessageId] = useState(null);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const [menuPosition, setMenuPosition] = useState(null);
    const [reactionAnchor, setReactionAnchor] = useState(null);
    const [reactionPosition, setReactionPosition] = useState(null);
    const [showUndo,setShowUndo]=useState(false);
    const [deleteState,setDeleteState]=useState(null);

    const timeRef=useRef(null);



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
      // dispatch(setMessage(selectedMessage))
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
      console.log(data);
      dispatch(openDialog({
        component:<ReactionDialog chats={data} onSubmit={(payload) => emojiDelete(payload)}/>
      }))
    }

    function emojiDelete(data){
      console.log(data);
      socket.emit('message:reaction',data);
      socket.on('message:reaction:updated',(data)=>{
        console.log(data);
        dispatch(updateReaction(data));
      })
      dispatch(closeDialog());
    }

    function handleEmojiClick(emojiData){
      // setInput((prev) => prev + emojiData.emoji);
      // setShowEmoji(false);
      console.log(emojiData);
      const payload={
        emoji:emojiData?.emoji,
        userId:user?.id,
        chatId:selectedMessage?.id,
        roomId:selectedRoom?.id
      }
      socket.emit('message:reaction',payload);
      socket.on('message:reaction:updated',(data)=>{
        console.log(data);
        dispatch(updateReaction(data));
      })
      handleReactionClose();
    }

    function handleDelete(data){
      setDeleteState(data);
      setShowUndo(false);     // reset first
      setTimeout(() => {
        setShowUndo(true); // reopen snackbar
      }, 100);
      handleMenuClose();
      if(data==='DeleteEveryOne'){
        dispatch(deleteMessageToEveryOne({chat_id:selectedMessage?.id,room_id:selectedRoom?.id})).unwrap().then(()=>{
          socket.on('deleteForEveryOne',({chat_id,newChat})=>{
            dispatch(updatedeletedMessages({chat_id,newChat}))
          })
        })
      }
      else{
        dispatch(deleteMessageToMe({user_id:user?.id,message_id:selectedMessage?.id})).unwrap().then(()=>{
          socket.on('deleteForMe',(data)=>{
            dispatch(updatedeletedMessagesToMe(data));
          })
        })
      }
    }

    function handleUndo(){
      console.log(selectedMessage);
      // setShowUndo(false);
      if(timeRef.current){
        clearTimeout(timeRef);
      }
      if(deleteState && deleteState=='DeleteMe'){
        dispatch(restoreDelMeMsg({message_id:selectedMessage?.id})).unwrap().then((res)=>{
          socket.on('restoreMsgMe',(data)=>{
            dispatch(restoreMeMsg(data));
            setShowUndo(false);
          })
        })
      };
      if(deleteState && deleteState==='DeleteEveryOne'){
        dispatch(restoreEveryOneDelMsg({message_id:selectedMessage?.id,room_id:selectedRoom?.id})).unwrap().then(()=>{
          socket.on('restoreMsg',({chat_id,newChat})=>{
            dispatch(updatedeletedMessages({chat_id,newChat}));
            setShowUndo(false);
          })
        })
      }
    }

    const handleSnackbarClose = (event, reason) => {
      if (reason === "clickaway") return; // ❌ ignore outside click
      setShowUndo(false);
    };

    useEffect(()=>{
        if(selectedRoom?.id){
            dispatch(fetchRoomMembers(selectedRoom?.id));
            dispatch(fetchChatsByRoom(selectedRoom?.id));
        }
    },[selectedRoom,dispatch]);

    const getReplyPreview = (reply) => {
      if (!reply) return "";
    
      switch (reply.message_type) {
        case "text":
          return reply.message;
    
        case "image":
          return "📷 Photo";
    
        case "audio":
          return "🎵 Audio";
    
        case "video":
          return "🎥 Video";
    
        case "document":
          return reply.file_name || "📄 Document";
    
        default:
          return "Message";
      }
    };
    
  return (
    <div>
      {loadingChats && <p>...Loadign Chats</p>}
      {!loadingChats && selectedRoomChats?.length == 0 && (
        <>
          <p className="text-center">No conversations happpen yet</p>
          <p className="text-center">Send first message</p>
        </>
      )}
      {selectedRoomChats?.length > 0 && (
        <div>
          {selectedRoomChats.map((chat) => (
            
            <div className="mb-5 relative" key={chat?.id}>
              {/* {chat.type === "user" && chat.message_type === "text" && (
                <>
                  <div
                    key={chat?.id}
                    onMouseEnter={() => setHoveredMessageId(chat.id)}
                    onMouseLeave={() => setHoveredMessageId(null)}
                    className={`flex mb-2 ${
                      chat?.user_id === user?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div className="relative group">
                      <div
                        className={`max-w-[100%] px-3 py-2 rounded-lg text-sm ${
                          chat?.user_id === user?.id
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-200 text-black rounded-bl-none"
                        }`}
                      >
                        {chat?.reply_to_message_id && (
                          <div
                            className={`mb-1 px-2 py-1 border-l-4 text-xs rounded ${
                              chat.user_id === user.id
                                ? "bg-blue-400/20 border-white text-white"
                                : "bg-gray-300 border-gray-600 text-black"
                            }`}
                          >
                            <div className="truncate">
                              {chat?.replyTo?.message}
                            </div>
                          </div>
                        )}
                        {chat.message}
                      </div>

                      {chat?.message_type == "image" && (
                        <div className='relative group'>
                            <div
                              className={`mb-1 px-2 py-1 border-l-4 text-xs rounded ${
                                chat?.user_id === user?.id
                                  ? "bg-transparent-400/20 border-white text-white"
                                  : "bg-gray-300 border-gray-600 text-black"
                              }`}
                            >
                              <img
                                src={chat?.file_url}
                                style={{ height: "50px", width: "50px" }}
                              />
                            </div>
                        </div>
                      )}

                      {hoveredMessageId === chat.id && (
                        <div
                          className={`absolute top-0 ${
                            chat?.user_id === user?.id
                              ? "-left-[300px]"
                              : "-right-[80px]"
                          } flex items-center gap-1`}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => handleReactionOpen(e, chat)}
                          >
                            <InsertEmoticonIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, chat)}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </div>
                      )}
                    </div>
                  </div>
                  {chat?.reaction && chat?.reaction?.length > 0 && (
                    <div
                      className={`flex gap-1 mt-1 ${chat?.user_id === user?.id ? "justify-end" : "justify-start"}`}
                    >
                      {chat?.reaction.map((r) => (
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
                  )}

                  <div
                    className={`mb-1 text-xs text-gray-500 ${chat?.user_id === user?.id ? "text-right" : "text-left"}`}
                  >
                    <span className="font-semibold">{chat?.user?.name}</span>
                    <span className="ml-1">{formatTime(chat?.created_at)}</span>
                  </div>
                </>
              )}
              {chat?.message_type === "image" && (
                <div className={`flex mb-2 ${
                  chat?.user_id === user?.id
                    ? "justify-end"
                    : "justify-start"
                }`}>
                  <div
                    className={`max-w-[250px] rounded-lg overflow-hidden shadow ${
                      chat?.user_id === user?.id
                        ? "bg-blue-500 text-white rounded-br-none"
                        : "bg-gray-200 text-black rounded-bl-none"
                    }`}
                  >
                    <img
                      src={chat?.file_url}
                      alt={chat?.file_name}
                      className="w-full h-auto object-cover cursor-pointer hover:opacity-90"
                      onClick={() => window.open(chat?.file_url, "_blank")}
                    />

                    <div className="flex items-center justify-between px-2 py-1 text-xs bg-black/10">
                      <div className="truncate">{chat?.file_name}</div>

                      <a
                        href={chat?.file_url}
                        download={chat?.file_name}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 hover:scale-110 transition"
                      >
                        <FaDownload className='text-xl'/>
                      </a>
                    </div>
                  </div>
                </div>
              )} */}

              {chat.type === "user" && (
                <>
                  <div
                    onMouseEnter={() => setHoveredMessageId(chat.id)}
                    onMouseLeave={() => setHoveredMessageId(null)}
                    className={`flex mb-2 ${
                      chat?.user_id === user?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div className="relative group">
                      <div
                        className={`max-w-[250px] rounded-lg overflow-hidden text-sm ${
                          chat?.user_id === user?.id
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-gray-200 text-black rounded-bl-none"
                        }`}
                      >
                        {chat?.reply_to_message_id && (
                          <div
                            className={`mb-1 px-2 py-1 border-l-4 text-xs rounded ${
                              chat.user_id === user.id
                                ? "bg-blue-400/20 border-white text-white"
                                : "bg-gray-300 border-gray-600 text-black"
                            }`}
                          >
                            <div className="font-semibold opacity-70">
                              {chat?.replyTo?.user?.name}
                            </div>

                            <div className="truncate">
                              {getReplyPreview(chat?.replyTo)}
                            </div>
                          </div>
                        )}

                        {chat.message_type === "text" && (
                          <div className="px-3 py-2">{chat?.is_deleted_for_everyone ? 'You Deleted this message':chat.message}</div>
                        )}

                        {chat.message_type === "image" && (
                          <>
                            <img
                              src={chat?.file_url}
                              alt={chat?.file_name}
                              className="w-full h-auto object-cover cursor-pointer hover:opacity-90"
                              onClick={() =>
                                window.open(chat?.file_url, "_blank")
                              }
                            />
                            <FileFooter chat={chat} />
                          </>
                        )}
                        {chat.message_type === "audio" && (
                          <div className="p-2">
                            <audio controls className="w-full">
                              <source
                                src={chat?.file_url}
                                type={chat?.mime_type}
                              />
                              Your browser does not support audio
                            </audio>

                            <FileFooter chat={chat} />
                          </div>
                        )}
                        {chat.message_type === "video" && (
                          <>
                            <video
                              controls
                              className="w-full max-h-[200px] object-cover bg-black"
                            >
                              <source
                                src={chat?.file_url}
                                type={chat?.mime_type}
                              />
                              Your browser does not support video
                            </video>

                            <FileFooter chat={chat} />
                          </>
                        )}
                        {chat.message_type === "document" && (
                          <div className="p-3 flex items-center gap-2">
                            <div className="text-2xl">📄</div>

                            <div className="flex-1 overflow-hidden">
                              <div className="truncate text-sm font-medium">
                                {chat?.file_name}
                              </div>
                              <div className="text-xs opacity-70">
                                {(chat?.file_size / 1024).toFixed(1)} KB
                              </div>
                            </div>

                            <a
                              href={chat?.file_url}
                              download={chat?.file_name}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="ml-2 hover:scale-110 transition"
                            >
                              <FaDownload />
                            </a>
                          </div>
                        )}
                      </div>

                      {hoveredMessageId === chat.id && (
                        <div
                          className={`absolute top-0 ${
                            chat?.user_id === user?.id
                              ? "-left-16"
                              : "-right-16"
                          } flex items-center gap-1`}
                        >
                          <IconButton
                            size="small"
                            onClick={(e) => handleReactionOpen(e, chat)}
                          >
                            <InsertEmoticonIcon fontSize="small" />
                          </IconButton>

                          <IconButton
                            size="small"
                            onClick={(e) => handleMenuOpen(e, chat)}
                          >
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </div>
                      )}
                    </div>
                  </div>

                  {chat?.reaction?.length > 0 && !chat?.is_deleted_for_everyone && (
                    <div
                      className={`flex gap-1 mt-1 ${
                        chat?.user_id === user?.id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      {chat?.reaction.map((r) => (
                        <div
                          key={r.emoji}
                          onClick={() => handleOpenReactionDialog(chat)}
                          className="flex items-center gap-1 px-2 py-[2px] bg-gray-100 rounded-full text-xs cursor-pointer border hover:bg-gray-200"
                        >
                          <span>{r.emoji}</span>
                          <span>{r.count}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    className={`mb-1 text-xs text-gray-500 ${
                      chat?.user_id === user?.id ? "text-right" : "text-left"
                    }`}
                  >
                    <span className="font-semibold">{chat?.user?.name}</span>
                    <span className="ml-1">{formatTime(chat?.created_at)}</span>
                  </div>
                </>
              )}
              {chat.type === "system" && (
                <div key={chat?.id} className="flex mb-2 justify-center">
                  <div className="max-w-[70%] px-2 py-1 rounded-lg text-sm font-bold text-black border rounded-lg">
                    {chat?.message}
                  </div>
                </div>
              )}
            </div>
          ))}
          <Snackbar
            open={showUndo}
            autoHideDuration={10000} // 30 sec
            onClose={handleSnackbarClose}
            message="Message deleted"
            anchorOrigin={{ vertical: "Top", horizontal: "center" }}
            action={
              <Button color="secondary" size="small" onClick={handleUndo}>
                UNDO
              </Button>
            }
          />
        </div>
      )}
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
            // console.log('Reply', selectedMessage);
            dispatch(setMessage(selectedMessage));
            handleMenuClose();
          }}
        >
          Reply
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleDelete('DeleteMe');
          }}
        >
          Delete For Me
        </MenuItem>

        {selectedMessage?.user_id === user?.id && (
          <MenuItem
            onClick={() => {
              handleDelete('DeleteEveryOne');
            }}
          >
            Delete For Everyone
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
                top: reactionPosition.mouseY - 50, // move slightly above click
                left: reactionPosition.mouseX,
              }
            : undefined
        }
      >
        <div className="flex gap-2 p-2 text-lg cursor-pointer">
          <EmojiPicker
            height={350}
            width={300}
            onEmojiClick={handleEmojiClick}
          />
        </div>
      </Popover>
    </div>
  );
}