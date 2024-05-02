interface LikedPlaylists {
    count: number
    pageCount: number
    rows: {
        id: string 
        title: string 
        cover: string 
        duration: number
        songs: number
        isLiked: boolean
    }[]
}
export default LikedPlaylists;