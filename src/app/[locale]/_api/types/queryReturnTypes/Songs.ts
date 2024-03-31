interface Songs {
    count: number 
    duration: number
    producedAt: string
    title?: string 
    rows: {
        id: string
        artistId:string
        cover: string 
        description: string 
        duration: Songs['duration']
        isLiked: boolean
        link: string 
        title: Songs['title']
        lyrics: string
    }[]
}
export default Songs