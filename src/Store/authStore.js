import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { signIn as signInApi, login as loginApi, getAllUsersApi } from "../Service/authService";


const initialState={
    user:null,
    status:false,
    error:null,
    token:null,
    allUsers:[],
};

export const signIn=createAsyncThunk('auth/signIn',async function(data){
    try{
        const user=await signInApi(data);
        return user
    }catch(err){
        return err;
    }
})

export const login=createAsyncThunk('auth/login',async function(data){
    try{
        const user=await loginApi(data);
        return user
    }catch(err){
        return err;
    }
})

export const getAllUsers=createAsyncThunk('auth/getAllUsers',async function(){
    try{
        const user=await getAllUsersApi();
        return user
    }catch(err){
        return err;
    }
})


// export const getAllUsers=createAsyncThunk('auth/getAllUser',async (_, { rejectWithValue }) => {
//     try {
//       const users = await getAllUsersApi();
//       return users;
//     } catch (err) {
//       return rejectWithValue(
//         err.response?.data || err.message
//       );
//     }
//   })

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetUser(state, action) {
      state.user = action.payload.storeUser;
      state.token = action.payload.storeToken;
    },
  },
  extraReducers: (builder) => {
    builder
      // SIGN IN
      .addCase(signIn.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      })

      // GET ALL USERS
      .addCase(getAllUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.status = 'idle';
        state.allUsers = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.status = 'error';
        state.allUsers = [];
        state.error = action.payload;
      })

      // LOGIN
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'idle';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'error';
        state.error = action.payload;
      });
  },
});


export const{ resetUser }=authSlice.actions;

export default authSlice.reducer;