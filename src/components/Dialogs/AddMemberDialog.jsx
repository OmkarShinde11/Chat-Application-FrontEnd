import React, { useState } from 'react'
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from 'react-redux';
import { closeDialog } from '../../Store/dialogStore';
import Button from '../commomComponents/Button';
import { addRoomMember } from '../../Store/roomStore';



export default function AddMemberDialog({users}) {
    const [members,setMembers]=useState([]);
    const dispatch=useDispatch();
    const {selectedRoom}=useSelector((state)=>state.room);
    const {allUsers}=useSelector((state)=>state.auth);
    function handleChange(e){
      // setSelectedMembers(e);
      const {
        target: { value },
      } = e;
    
      setMembers(typeof value === 'string' ? value.split(',') : value);
    };

    function addMember(){
      let data=allUsers.filter((user)=>user.name===members[0]);
      const payload={
        user_id:data[0]?.id,
        room_id:selectedRoom?.id,
        userName:data[0]?.name
      };
      dispatch(addRoomMember(payload)).unwrap().then(()=>{
        dispatch(closeDialog());
      }).catch((err)=>dispatch(closeDialog()))
    }
  return (
    <>
    <DialogTitle id="responsive-dialog-title" className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-3">
          Add Member
        </DialogTitle>
        <DialogContent className="pt-4">
          <DialogContentText className="space-y-3">
        <InputLabel className="text-sm font-medium text-gray-700 mt-3" id="demo-multiple-checkbox-label">Members</InputLabel>
        <Select
        className="w-full bg-white"
        sx={{
          borderRadius: '0.75rem',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d1d5db', // gray-300
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#9ca3af', // gray-400
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#3b82f6', // blue-500
            borderWidth: '2px',
          },
        }}
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={members}
          onChange={(e)=>handleChange(e)}
          input={<OutlinedInput label="Add Member" />}
          renderValue={(selected) => selected.join(', ')}
        >
          {users.map((name) => (
            <MenuItem key={name?.id} value={name?.name}>
              <Checkbox className="text-blue-600" checked={members.includes(name?.name)} />
              <ListItemText primary={name?.name} />
            </MenuItem>
          ))}
        </Select>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>dispatch(closeDialog())}>Close</Button>
          <Button onClick={addMember}>Add</Button>
        </DialogActions>
    </>
  )
}
