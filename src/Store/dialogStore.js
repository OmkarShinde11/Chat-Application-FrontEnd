import { createSlice } from "@reduxjs/toolkit";

const initialState={
    open:false,
    component:null,
}

const dialogSlice=createSlice({
    name:'dialog',
    initialState,
    reducers:{
        openDialog(state,action){
            state.open = true;
            state.component = action.payload.component;
        },
        closeDialog(state,action){
            state.open = false;
            state.component = null;
        }
    }
});

export const {openDialog,closeDialog}=dialogSlice.actions;

export default dialogSlice.reducer;