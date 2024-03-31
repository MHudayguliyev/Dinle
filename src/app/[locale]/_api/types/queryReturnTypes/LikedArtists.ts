interface LikedArtists {
    count: number
    pageCount: number
    rows: {
        id: string
        title: string 
        cover: string 
        following: boolean
    }[]
}
export default LikedArtists