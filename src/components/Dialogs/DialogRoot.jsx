import { Dialog } from '@mui/material';
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { closeDialog } from '../../Store/dialogStore';

export default function DialogRoot() {
    const {open,component}=useSelector((state)=>state.dialog);
    const dispatch=useDispatch();
  return (
    <Dialog open={open} PaperProps={{
      className: "rounded-xl p-6 max-w-lg w-full bg-white shadow-xl"
    }} aria-labelledby="responsive-dialog-title" onClose={()=>dispatch(closeDialog)}>
        {component}
    </Dialog>
  )
}
