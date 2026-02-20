import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addMembersInRoom, createNewRoom, deleteMessageForEveryone, deleteMessageForMe, getChatsByRoom, getRoomByUsers, getRoomMembersByRoom, restoreDelEveryMsg, restoreDelMsgMeApi, uploadUserFile } from "../Service/roomService";

const initialState={
    rooms:[],
    selectedRoom:null,
    selectedRoomMembers:[],
    selectedRoomChats:[],
    selectedMessage:null,
    loadingRooms: false,
    loadingMembers: false,
    loadingChats: false,
    error: null
};

export const fetchRooms=createAsyncThunk('room/getRooms',async function(){
    try{
        const data=await getRoomByUsers();
        return data;
    }catch(err){
        return err;
    }
});
export const fetchRoomMembers=createAsyncThunk('room/getRoomMembers',async function(roomId){
    try{
        const data=await getRoomMembersByRoom(roomId);
        console.log('roomMember',data);
        return data;
    }catch(err){
        return err;
    }
});

export const fetchChatsByRoom=createAsyncThunk('room/getChatsByRoom',async function(roomId){
    try{
        const data=await getChatsByRoom(roomId);
        return data;
    }catch(err){
        return err;
    }
});

export const addRoomMember=createAsyncThunk('room/addRoomMember',async function(payload,{dispatch}){
    try{
        const data=await addMembersInRoom(payload);
        dispatch(fetchRoomMembers(payload?.room_id));
    }catch(err){
        return err;
    }
})

export const createNewRoomWithMembers=createAsyncThunk('room/createNewRoomWithMembers',async function(payload){
    try{
        const data=await createNewRoom(payload);
        return data;
    }catch(err){
        throw(err);
    }
})

export const handleUpload=createAsyncThunk('room/handleUpload',async function(payload){
    try{
        const data=await uploadUserFile(payload);
        return data;
    }catch(err){
        throw(err);
    }
})

export const deleteMessageToEveryOne=createAsyncThunk('room/deleteMessageToEveryOne',async function(payload){
    try{
        const data=await deleteMessageForEveryone(payload);
    }catch(err){
        throw(err);
    }
})

export const deleteMessageToMe=createAsyncThunk('room/deleteMessageToMe',async function(payload){
    try{
        const data=await deleteMessageForMe(payload);
    }catch(err){
        throw(err);
    }
})

export const restoreEveryOneDelMsg=createAsyncThunk('room/restoreEveryOneDelMsg',async function (payload){
    try{
        const data=await restoreDelEveryMsg(payload);
    }catch(err){
        throw(err);
    }
})

export const restoreDelMeMsg=createAsyncThunk('room/restoreDelMeMsg',async function(payload){
    try{
        const data=await restoreDelMsgMeApi(payload);
    }catch(err){
        throw(err);
    }
})

const roomSlice=createSlice({
    name:'room',
    initialState,
    reducers:{
        addNewMessage(state,action){
            state.selectedRoomChats.push(action.payload);
        },
        changeSelectedRoom(state,action){
            state.selectedRoom=action.payload
        },
        setMessage(state,action){
            state.selectedMessage=action.payload
        },
        resetSelectedMessage(state,action){
            state.selectedMessage=null;
        },
        updateReaction(state,action){
            let index=state.selectedRoomChats.findIndex(el=>el.id===action.payload.chatId);
            state.selectedRoomChats[index].reaction=action.payload.reaction;
        },
        updatedeletedMessages(state,action){
            let index=state.selectedRoomChats.findIndex(el=>el.id===action.payload.chat_id);
            state.selectedRoomChats[index]=action.payload.newChat;
        },
        updatedeletedMessagesToMe(state,action){
            let index=state.selectedRoomChats.findIndex(el=>el.id===action.payload);
            state.selectedRoomChats.splice(index,1);
        },
        restoreMeMsg(state,action){
            state.selectedRoomChats.push(action.payload[0]);
            state.selectedRoomChats.sort((a,b)=>new Date(a.created_at) - new Date(b.created_at));
        }
        
    },
    extraReducers:(builder)=>{
        builder
        .addCase(fetchRooms.pending,(state)=>{state.loadingRooms=true;})
        .addCase(fetchRooms.fulfilled,(state,action)=>{state.rooms=action.payload;state.selectedRoom=action.payload[0];state.loadingRooms=false;})
        .addCase(fetchRooms.rejected,(state)=>{state.loadingRooms=false;state.rooms=[];state.error=action.payload;})

        .addCase(fetchRoomMembers.pending,(state,action)=>{state.loadingMembers=true;})
        .addCase(fetchRoomMembers.fulfilled,(state,action)=>{state.loadingMembers=false;state.selectedRoomMembers=action.payload;})
        .addCase(fetchRoomMembers.rejected,(state,action)=>{state.loadingMembers=false;state.selectedRoomMembers=[];state.error=action.payload;})

        .addCase(fetchChatsByRoom.pending,(state,action)=>{state.loadingChats=true;})
        .addCase(fetchChatsByRoom.fulfilled,(state,action)=>{state.loadingChats=false;state.selectedRoomChats=action.payload;})
        .addCase(fetchChatsByRoom.rejected,(state,action)=>{state.loadingChats=false;state.selectedRoomChats=[];state.error=action.payload;})

        .addCase(addRoomMember.pending,(state,action)=>{state.loadingMembers=true;})
        .addCase(addRoomMember.fulfilled,(state,action)=>{state.loadingMembers=false;})
        .addCase(addRoomMember.rejected,(state,action)=>{state.loadingMembers=false;state.error=action.payload;})

        .addCase(createNewRoomWithMembers.pending,(state,action)=>{state.loadingRooms=true;})
        .addCase(createNewRoomWithMembers.fulfilled,(state,action)=>{state.loadingRooms=false;state.selectedRoom=action.payload;state.rooms=[...state.rooms,action.payload]})
        .addCase(createNewRoomWithMembers.rejected,(state,action)=>{state.loadingRooms=false;state.selectedRoom=null; state.error=action.payload;})

        .addCase(handleUpload.pending,(state,action)=>{state.loadingChats=true;})
        .addCase(handleUpload.fulfilled,(state,action)=>{state.loadingChats=false;})
        .addCase(handleUpload.rejected,(state,action)=>{state.loadingChats=false; state.error=action.payload})

        .addCase(deleteMessageToEveryOne.pending,(state,action)=>{state.loadingChats=true})
        .addCase(deleteMessageToEveryOne.fulfilled,(state,action)=>{state.loadingChats=false})
        .addCase(deleteMessageToEveryOne.rejected,(state,action)=>{state.loadingChats=false,state.error=action.payload})

        .addCase(restoreEveryOneDelMsg.pending,(state,action)=>{state.loadingChats=true})
        .addCase(restoreEveryOneDelMsg.fulfilled,(state,action)=>{state.loadingChats=false})
        .addCase(restoreEveryOneDelMsg.rejected,(state,action)=>{state.loadingChats=false,state.error=action.payload})

        .addCase(restoreDelMeMsg.pending,(state,action)=>{state.loadingChats=true})
        .addCase(restoreDelMeMsg.fulfilled,(state,action)=>{state.loadingChats=false})
        .addCase(restoreDelMeMsg.rejected,(state,action)=>{state.loadingChats=false,state.error=action.payload})

    }
})

export const {addNewMessage,changeSelectedRoom,setMessage,resetSelectedMessage,updateReaction,updatedeletedMessages,updatedeletedMessagesToMe,restoreMeMsg}=roomSlice.actions;

export default roomSlice.reducer;