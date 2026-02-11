import axios from "axios";
import axiosInstance from "../utils/axiosInterceptor";

export const login=async (payload)=>{
    try{
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:5000/api/v1/auth/login',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : payload
        };
        const data=await axios.request(config);
        console.log(data);
        const {user,token}=data?.data;
        localStorage.setItem('user',JSON.stringify(user));
        localStorage.setItem('token',JSON.stringify(token));
        return {user,token};
    }catch(err){
        throw(err);
    }
};


export const signIn=async ()=>{
    try{
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'http://localhost:5000/api/v1/auth/signIn',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
        };
        const data=await axios.request(config);
        console.log(data);
        const {user,token}=data;
        localStorage.setItem('user',JSON.stringify(user));
        localStorage.setItem('token',JSON.stringify(token));
        return {user,token};
    }catch(err){
        throw err;
    }
}

export const getAllUsersApi=async ()=>{
    try{
        // let config = {
        //     method: 'get',
        //     maxBodyLength: Infinity,
        //     url: 'http://localhost:5000/api/v1/auth/getAllUsers',
        //     headers: { 
        //       'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzY5NTk0ODMzLCJleHAiOjE3NzIxODY4MzN9.kjpPUZ2wi2BDJLMtukTSV3kte0834tncGS5tX_Kv2yM'
        //     }
        // };
        // const data=await axios.request(config);
        const {data}=await axiosInstance.get('auth/getAllUsers');
        console.log(data);
        return data?.users;
    }catch(err){
        throw(err);
    }
}


// export const getAllUsersApi = async () => {
//     const response = await axios.get(
//       'http://localhost:5000/api/v1/auth/getAllUsers',
//       {
//         headers: {
//           Authorization:
//             'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiaWF0IjoxNzY5NTk0ODMzLCJleHAiOjE3NzIxODY4MzN9.kjpPUZ2wi2BDJLMtukTSV3kte0834tncGS5tX_Kv2yM',
//         },
//       }
//     );
  
//     return response.data; // ✅ important
//   };