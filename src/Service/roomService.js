import axios from "axios";
import axiosInstance from "../utils/axiosInterceptor";

export const getRoomByUsers=async ()=>{
    try{
        // let config = {
        //     method: 'get',
        //     maxBodyLength: Infinity,
        //     url: 'http://localhost:5000/api/v1/room/getRoomByUser',
        //     headers: { 
        //       'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzY5NTk0ODMzLCJleHAiOjE3NzIxODY4MzN9.kjpPUZ2wi2BDJLMtukTSV3kte0834tncGS5tX_Kv2yM'
        //     }
        // };
        // const data=await axios.request(config);
        const {data}=await axiosInstance.get('room/getRoomByUser');
        console.log(data);
        return data?.rooms;
    }catch(err){
        throw(err);
    }
}

export const getRoomMembersByRoom=async (roomId)=>{
    try{
        // let config = {
        //     method: 'get',
        //     maxBodyLength: Infinity,
        //     url: `http://localhost:5000/api/v1/roomMember/getRoomMembersByRoom/${roomId}`,
        //     headers: { },
        // };
        // const data=await axios.request(config);
        const {data}=await axiosInstance.get(`roomMember/getRoomMembersByRoom/${roomId}`);
        return data?.roomMembers;
    }catch(err){
        throw(err);
    }
};

export const getChatsByRoom=async (roomId)=>{
    try{
        // let config = {
        //     method: 'get',
        //     maxBodyLength: Infinity,
        //     url: `http://localhost:5000/api/v1/chat/getChat/${roomId}`,
        //     headers: { 
        //       'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzY5NTk0ODMzLCJleHAiOjE3NzIxODY4MzN9.kjpPUZ2wi2BDJLMtukTSV3kte0834tncGS5tX_Kv2yM'
        //     }
        // };
    
        // const chats=await axios.request(config);
        const {data}=await axiosInstance.get(`chat/getChat/${roomId}`);
        return data?.chats;
    }catch(err){
        throw(err);
    }
}

export const addMembersInRoom = async (payload)=>{
    try{
        // let config = {
        //     method: 'post',
        //     maxBodyLength: Infinity,
        //     url: 'http://localhost:5000/api/v1/roomMember/addRoomMember',
        //     headers: { 
        //       'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzY5NTk0ODMzLCJleHAiOjE3NzIxODY4MzN9.kjpPUZ2wi2BDJLMtukTSV3kte0834tncGS5tX_Kv2yM', 
        //       'Content-Type': 'application/json'
        //     },
        //     data : payload
        // };
    
        // const result=await axios.request(config);
        const {result}=await axiosInstance.post('roomMember/addRoomMember',payload);
        return result?.member;
    }catch(err){
        throw(err);
    }
}

export const createNewRoom=async (payload)=>{
    try{
        // let config = {
        //     method: 'post',
        //     maxBodyLength: Infinity,
        //     url: 'http://localhost:5000/api/v1/room/createRoom',
        //     headers: { 
        //       'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzcwNDQ2OTI1LCJleHAiOjE3NzMwMzg5MjV9.ptzuyHpE0xAFOraVtqFrmtzttCgoyHuXT-p-bZaH8q4', 
        //       'Content-Type': 'application/json'
        //     },
        //     data : payload
        // };
        // const data=await axios.request(config);
        const {data}=await axiosInstance.post('room/createRoom',payload);
        return data?.room;
    }catch(err){
        return err;
    }
}

export const uploadUserFile=async (payload)=>{
    try{
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:5000/api/v1/chat/uploadFile',
            headers: { 
              'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzcwOTY1OTYyLCJleHAiOjE3NzM1NTc5NjJ9.30U_AOVmk6lvdJareicJVoJh9EmmtHn_aNrLg-r4QR8', 
            },
            data : payload
          };
          const {data}=await axios.request(config);
        // const {data}=await axiosInstance.post('chat/uploadFile',payload);
        return data?.chat
    }catch(err){
        return err;
    }
}

 export const deleteMessageForEveryone=(payload)=>{
    try{
        const {data}=axiosInstance.patch('/chat/deleteMessageToEveryOne',payload);
        return data;
    }catch(err){
        return err;
    }
}

export const deleteMessageForMe=(payload)=>{
    try{
        const {data}=axiosInstance.post('/chat/deleteMessageToMe',payload);
        return data;
    }catch(err){
        return err;
    }
}

export const restoreDelEveryMsg=(payload)=>{
    try{
        const {data}=axiosInstance.patch('/chat/restoreDelEveryOneMsg',payload);
        return data;
    }catch(err){
        return err;
    }
}

export const restoreDelMsgMeApi=(payload)=>{
    try{
        const {data}=axiosInstance.post('/chat/restoreDelMeMsg',payload);
        return data;
    }catch(err){
        return err;
    }
}