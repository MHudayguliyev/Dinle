import Albums from "./Albums"
import Songs from "./Songs"
import Video from "./Video"

interface SearchType {
    statusCode: number
    success: boolean
    data: {
        alboms: Albums['data']['rows']
        artists: {
            cover:string 
            id:string 
            title: string
        }[] 
        songs: Songs['rows']
        playlists: Songs['rows']
        clips: Video[]
    }
}
export default SearchType