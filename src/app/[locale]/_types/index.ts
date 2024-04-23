import { StaticImageData } from "next/image"

export type Localization = {
    en: string
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
export type IconTypes = 'home' | 'search' | 'playlist' | 'settings'
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