import CommonTypes from "./CommonTypes"

interface HomeItems extends CommonTypes {
    data: {
        id: string 
        name: string 
        type: string
        duration: number 
        rows: {
            id: string 
            artistId?: string
            playlistId?: string 
            albomId?: string 
            genreId?: string
            title: string 
            description: string 
            cover: string 
            isLiked: boolean 
            duration?: number 
            link?: string
        }[]
    }[]
}

export default HomeItems