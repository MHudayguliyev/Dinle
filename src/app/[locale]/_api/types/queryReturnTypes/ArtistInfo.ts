import Genres from "./Genres"

interface ArtistInfo {
    genres: Genres['data']
    about: any
    createdAt: string 
    id: string 
    cover: string 
    title: string 
    following: boolean
    count: {
        songs: number 
        alboms: number 
        songListeners: number 
        followers: number 
        songLikers: number 
    }
}
export default ArtistInfo