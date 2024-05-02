import CommonTypes from "./CommonTypes"

interface Albums extends CommonTypes {
    data: {
        count: number 
        pageCount?: number
        rows: {
            id: string 
            cover: string 
            title: string 
            description: string
            isLiked: boolean
        }[]
    }
}
export default Albums