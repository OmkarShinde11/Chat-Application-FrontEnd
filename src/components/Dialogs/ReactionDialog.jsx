import React from 'react';
import {Dialog,DialogTitle,DialogContent,Tabs,Tab,Avatar,List,ListItem,ListItemAvatar,ListItemText, DialogActions} from '@mui/material';
import { closeDialog } from '../../Store/dialogStore';
import Button from '../commomComponents/Button';
import { useDispatch } from 'react-redux';

export default function ReactionDialog({chats}) {
    const dispatch=useDispatch();
  return (
    <>
        <DialogTitle>Reactions</DialogTitle>
        <DialogContent dividers>
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
