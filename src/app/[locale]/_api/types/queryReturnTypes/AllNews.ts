import ArtNews from "./ArtNews";
interface AllNews  {
    data: {
        count: number 
        pageCount: number 
        rows: ArtNews[]
    }
}
export default AllNews