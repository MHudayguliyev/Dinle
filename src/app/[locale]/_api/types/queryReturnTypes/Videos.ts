import Video from "./Video"

interface Videos {
    data: {
        count: number 
        pageCount: number 
        rows: Video[]
    }
}
export default Videos