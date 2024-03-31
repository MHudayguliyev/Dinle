import CommonTypes from "./CommonTypes"

interface Artists extends CommonTypes {
    data: {
        count: number 
        pageCount: number 
        rows: {
            cover: string 
            id: string 
            title: string
        }[]
    }
}
export default Artists