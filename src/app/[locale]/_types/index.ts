import { StaticImageData } from "next/image"

export type Localization = {
    ru: string 
    tm: string
}
export type Tracks = {
    id: number
    image:StaticImageData
    song: string | number | undefined
    name:string | number | undefined
    album: string 
    added_dt: string | undefined
    duration: string
    favorite: boolean
}
export type IconTypes = 'home' | 'search' | 'favorite' | 'settings'
export type SidebarRoutes = {
    display_name: Localization
    route: string
    icon: IconTypes 
    sub: string[]
}[]

export type TabMenuTypes = {
    route: string 
    label: Localization
} 
export type CopyLinkTypes = {
    link: string 
    /** @default desktop **/
    mode?: 'mobile' | 'desktop'
}
export type ActionsType = {
    value: string 
    label: Localization
    icon: React.ReactNode
}
export interface MetaValuesType {
    title: string 
    description?: string
    keywords?: string
    icons?: string[]
    openGraph: {
        type: "music.song" | "music.album" | "music.playlist" | "video.movie" | "video.episode" | "video.tv_show" | "article" | "profile" | "website"
        title: string 
        url: string 
        description?: string
        images?: string[]
    }
}
export interface MetaReturnType extends MetaValuesType {
    authors: {
        name: string 
        url?: string 
    }[]
}
