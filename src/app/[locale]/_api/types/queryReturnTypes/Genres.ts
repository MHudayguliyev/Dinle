import CommonTypes from "./CommonTypes"

interface Genres extends CommonTypes {
    data: {
        genreId: string 
        cover: string 
        name: string 
    }[]
}
export default Genres