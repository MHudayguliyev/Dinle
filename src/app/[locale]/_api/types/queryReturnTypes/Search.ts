import Albums from "./Albums"
import Songs from "./Songs"

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
        shows: []
    }
}
export default SearchType