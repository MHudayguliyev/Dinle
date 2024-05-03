import { createSlice } from '@reduxjs/toolkit';
import { InitialState } from "../types/MediaTypes";
import { CheckObjOrArrForNull } from '@app/_utils/helpers';

const initialState: InitialState = {
    songData: [],
    songIndex: -1, 
    song: {
        id: "", 
        cover: "",
        description: "",  
        duration: -1, 
        isLiked: false, 
        link: "",  
        title: "", 
        lyrics: ""
    }, 
    isSongPlaying: false,
    isAudioPlayerOpen: false, 
    isShuffle: false, 
}

const MediaReducer = createSlice({
    name: 'MediaReducer', 
    initialState: initialState, 
    reducers: {
        setCurrentSong: (state, action) => {
            const {
                id, 
                index, 
                data
            } = action.payload
            state.isSongPlaying = state.songData?.[state.songIndex]?.id === id ? !state.isSongPlaying : true
            state.songData = data
            state.songIndex = index
            state.song = data[index]
            if(!state.isAudioPlayerOpen) state.isAudioPlayerOpen = true;
        }, 
        setIsSongPlaying: (state, action) => {
            state.isSongPlaying = action.payload
        }, 
        setSongIndex: (state, action) => {
            state.songIndex = action.payload
        }, 
        addToQueue: (state, action) => {
            if(!CheckObjOrArrForNull(state.songData) && !CheckObjOrArrForNull(action.payload)) return 

            const songsClone = state.songData.map(song => ({...song}))
            const currentIndex = state.songIndex
            
            for(let i = songsClone.length; i > currentIndex + 1; i--){
                songsClone[i] = songsClone[i - 1]
            }
            songsClone[currentIndex + 1] = action.payload
            state.songData = [...songsClone]
        }, 
        setIsShuffle: (state, action) => {
            state.isShuffle = action.payload
        },
        shuffle: (state, action) => {
            state.isSongPlaying = true
            state.songIndex = action.payload === state.songIndex ? action.payload + 1 : action.payload
        }, 
    }
})
export const {
    setCurrentSong, 
    setIsSongPlaying, 
    setSongIndex, 
    addToQueue,
    setIsShuffle, 
    shuffle, 
} = MediaReducer.actions
export default MediaReducer.reducer