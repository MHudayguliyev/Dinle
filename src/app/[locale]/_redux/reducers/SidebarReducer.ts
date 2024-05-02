import { createSlice } from '@reduxjs/toolkit';
const initialState = {
    sidebarFolded: false
}

const SidebarReducer = createSlice({
    name: 'SidebarReducer', 
    initialState: initialState, 
    reducers: {
        setToggleSidebar: (state, action) => {
            state.sidebarFolded = action.payload
        }
    }
})
export const {
    setToggleSidebar
} = SidebarReducer.actions
export default SidebarReducer.reducer