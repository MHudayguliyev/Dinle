import Song from "./Song"

interface Songs {
    count: number 
    duration: number
    producedAt: string
    title?: string 
    rows: Song[]
}
export default Songs