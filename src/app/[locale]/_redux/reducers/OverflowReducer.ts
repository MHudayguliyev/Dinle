import { createSlice } from '@reduxjs/toolkit';

const OverFlowReducer = createSlice({
    name: "OverflowReducer", 
    initialState: {
        isBlockOverflow: false, 
    }, 
    reducers: {
        setIsBlockOverflow: (state, action) => {
            state.isBlockOverflow = action.payload
        }
    }
})

export const {
    setIsBlockOverflow
} = OverFlowReducer.actions
export default OverFlowReducer.reducer