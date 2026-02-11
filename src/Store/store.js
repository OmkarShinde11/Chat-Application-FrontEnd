import { configureStore } from "@reduxjs/toolkit";
import authSlice from './authStore';
import roomSlice from '../Store/roomStore';
import dialogSlice from '../Store/dialogStore';


const store=configureStore({
    reducer:{
       auth:authSlice,
       room:roomSlice,
       dialog:dialogSlice
    }
});

export default store;