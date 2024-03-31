import CommonTypes from "./CommonTypes"

interface Playlists extends CommonTypes {
    data: {
        count: number 
        pageCount: number 
        rows: {
            cover: string 
            duration: number 
            id: string 
            title: string
            songs: number 
        }[]
    }
}
export default Playlists