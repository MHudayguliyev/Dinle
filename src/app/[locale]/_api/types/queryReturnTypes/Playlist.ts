import Songs from "./Songs"

interface Playlist {
    cover: string 
    producedAt: string 
    title: string 
    duration: number
    count: number 
    rows: Songs['rows']
}
export default Playlist