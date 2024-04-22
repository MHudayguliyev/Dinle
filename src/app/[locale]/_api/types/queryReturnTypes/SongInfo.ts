import Genres from "./Genres"

interface SongInfo {
    id: string
    cover: string
    title: string 
    about: string
    lyrics: string 
    producedAt: string 
    createdAt: string 
    albomId: string 
    albom: {
        title: string 
        producedAt: SongInfo['producedAt']
        cover: string 
        id: string
    }
    artist: {
        id: string
        cover: string 
        title: string 
        count: {
            songListeners: number
            followers: number 
            songLikers: number
        }
    }
    duets: {
        type: 'compositor' | 'arranger' | 'author' | 'duet'
        artist: {
            id: string
            cover: string 
            title: string 
        }
    }[]
    genres: Genres['data']
    count: {
        followers: number 
        likers: number 
        listeners: number
        downloads: number
    }
}
export default SongInfo