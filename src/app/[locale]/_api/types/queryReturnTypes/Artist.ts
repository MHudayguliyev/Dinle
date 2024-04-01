import Albums from "./Albums"
import Songs from "./Songs"

interface Artist {
    data: {
        artist: {
            id: string 
            following: boolean
            title: string 
            cover: string 
            count: {
                songListeners: number
                songLikers: number 
                songReposters: number 
                followers: number 
                visitors: number 
            }
        }
        songs: Songs['rows']
        alboms: Albums['data']['rows']
    }
}
export default Artist