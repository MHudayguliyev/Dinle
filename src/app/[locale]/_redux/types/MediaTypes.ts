import Songs from "@app/_api/types/queryReturnTypes/Songs"
import Video from "@app/_api/types/queryReturnTypes/Video"

export interface InitialState {
    songData: Songs['rows']
    songIndex: number
    song: {
        id: string
        cover: string 
        description: string 
        duration: Songs['duration']
        isLiked: boolean
        link: string 
        title: Songs['title']
        lyrics: string
    }
    isSongPlaying: boolean
    isAudioPlayerOpen: boolean
    isShuffle: boolean
}