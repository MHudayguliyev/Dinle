import { createSlice } from '@reduxjs/toolkit';
import InitialState from '../types/AuthTypes'

const initialState: InitialState = {
    isAuthenticated: false, 
    showAuthModal: false
}

const AuthReducer = createSlice({
    name: 'AuthReducer', 
    initialState: initialState, 
    reducers: {
        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload
        },
        setShowAuthModal: (state, action) => {
            state.showAuthModal = action.payload
        },
        closeModal: (state) => {
            state.showAuthModal = false
        }
    }
})

export const {
    setIsAuthenticated, 
    setShowAuthModal, 
    closeModal
} = AuthReducer.actions
export default AuthReducer.reducer