import Songs from "./Songs"

interface LikedSongs {
    count: number 
    pageCount: number 
    rows: Songs['rows']
}
export default LikedSongs