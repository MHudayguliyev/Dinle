import CommonTypes from "./CommonTypes"

interface Albums extends CommonTypes {
    data: {
        count: number 
        rows: {
            id: string 
            cover: string 
            title: string 
            description: string 
        }[]
    }
}
export default Albums