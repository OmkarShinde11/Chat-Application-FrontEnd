import { DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, ToggleButton, ToggleButtonGroup } from '@mui/material'
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import React, { useEffect, useState } from 'react'
import Button from '../commomComponents/Button'
import { useDispatch, useSelector } from 'react-redux'
import { closeDialog } from '../../Store/dialogStore'
import { createNewRoomWithMembers } from '../../Store/roomStore';

export default function AddRoomDialog({users}) {
  const {user,allUsers}=useSelector((state)=>state.auth);
  const [members,setMembers]=useState([]);
  const [roomName,setRoomName]=useState('');
  const [activetab,setActiveTab]=useState('room');
  const [singleUser,setSingleUser]=useState('');
  const dispatch=useDispatch();

  function addRoomWithMembers(){
    const payload={
      name:roomName,
    };
    const userSet=new Set(members);
    console.log(userSet);
    const filterUsers=allUsers.filter((el)=>userSet.has(el.name)).map((el)=>el.id);
    console.log(filterUsers);
    payload.members=[...filterUsers,user?.id];
    console.log(payload);
    dispatch(createNewRoomWithMembers(payload)).unwrap().then(()=>{
      dispatch(closeDialog());
    }).catch((err)=>dispatch(closeDialog()))
  }

  function startDirectConversation(){
    const payload={
      name:singleUser,
    };
    const filterUsers=allUsers.filter((el)=>el.name===singleUser).map((el)=>el.id);
    // console.log(filterUsers);
    payload.members=[...filterUsers,user?.id];
    console.log(payload);
    dispatch(createNewRoomWithMembers(payload)).unwrap().then(()=>{
      dispatch(closeDialog());
    }).catch((err)=>dispatch(closeDialog()))

  }

  function handleChange(e){
    // setSelectedMembers(e);
    const {
      target: { value },
    } = e;
  
    setMembers(typeof value === 'string' ? value.split(',') : value);
  };

  const handleToggle = (e, value) => {
    if (value !== null) setActiveTab(value);
  };

  function handleSingle(e){
    setSingleUser(e.target.value);
  }
  return (
    <>
      <DialogTitle
        id="responsive-dialog-title"
        className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3"
      >
        Start New Conversations
      </DialogTitle>

      <div className="px-6 pt-4">
        <ToggleButtonGroup
          value={activetab}
          exclusive
          onChange={handleToggle}
          fullWidth
          className="bg-gray-100 rounded-xl"
          sx={{
            backgroundColor: '#f3f4f6', // gray-100
            borderRadius: '0.75rem',
            '& .MuiToggleButton-root': {
              textTransform: 'none',
              fontWeight: 500,
              border: 'none',
            },
            '& .MuiToggleButton-root.Mui-selected': {
              backgroundColor: '#3b82f6', // blue-500
              color: '#fff',
            },
            '& .MuiToggleButton-root.Mui-selected:hover': {
              backgroundColor: '#2563eb', // blue-600
            },
          }}
        >
          <ToggleButton value="room" className="font-medium">
            Room
          </ToggleButton>
          <ToggleButton value="direct" className="font-medium">
            Direct Chat
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      {activetab === "room" && (
        <>
          <DialogContent className="pt-4">
            <DialogContentText className="space-y-3">
              <InputLabel
                className="text-sm font-medium text-gray-700 mt-3"
                id="outlined-basic"
              >
                Enter Room Name
              </InputLabel>
              <TextField
                id="outlined-basic"
                label="Enter Room Name"
                variant="outlined"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
              />
              <InputLabel
                className="text-sm font-medium text-gray-700 mt-3"
                id="demo-multiple-checkbox-label"
              >
                Add RoomMembers
              </InputLabel>
              <Select
                className="w-full bg-white"
                sx={{
                  borderRadius: "0.75rem",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#d1d5db", // gray-300
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#9ca3af", // gray-400
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#3b82f6", // blue-500
                    borderWidth: "2px",
                  },
                }}
                labelId="demo-multiple-checkbox-label"
                label="Add Room Members"
                id="demo-multiple-checkbox"
                multiple
                value={members}
                onChange={(e) => handleChange(e)}
                input={<OutlinedInput label="Add Member" />}
                renderValue={(selected) => selected.join(", ")}
              >
                {users
                  .filter((el) => el.id !== user.id)
                  .map((name) => (
                    <MenuItem key={name?.id} value={name?.name}>
                      <Checkbox
                        className="text-blue-600"
                        checked={members.includes(name?.name)}
                      />
                      <ListItemText primary={name?.name} />
                    </MenuItem>
                  ))}
              </Select>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => dispatch(closeDialog())}>Close</Button>
            <Button onClick={addRoomWithMembers}>Create New Conversation </Button>
          </DialogActions>
        </>
      )}

      {activetab === "direct" && (
        <>
          <DialogContent className="pt-4">
            <DialogContentText className="space-y-3">
              <InputLabel id="demo-simple-select-label">Select User</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={singleUser}
                label="Age"
                onChange={(e) => handleSingle(e)}
                className="w-full bg-white"
              >
                {/* <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem> */}

                {users
                  .filter((el) => el.id !== user.id)
                  .map((name) => (
                    <MenuItem key={name?.id} value={name?.name}>
                      {name?.name}
                    </MenuItem>
                  ))}
              </Select>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => dispatch(closeDialog())}>Close</Button>
            <Button onClick={startDirectConversation}>Create New Conversation </Button>
          </DialogActions>
        </>
      )}
    </>
  );
}
