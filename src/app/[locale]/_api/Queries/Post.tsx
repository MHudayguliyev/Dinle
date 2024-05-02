import { api } from "../Services/api_helpers"
import Devices from "../types/queryReturnTypes/Devices"
import SearchType from "../types/queryReturnTypes/Search"

export const signUp = async (phone: any): Promise<{
    statusCode: number,
    success: boolean, 
    data: {
        message: string
    }
}> => {
    // console.log("phone", phone)
    return api.post({
        url: '/auth/sign-up', 
        data: phone
    })
}

export const sendOtp = async (phone: any): Promise<{
    statusCode: number,
    success: boolean, 
    data: {
        message: string
    }
}> => {
    // console.log("phone", phone)
    return api.post({
        url: '/auth/send-otp', 
        data: phone
    })
}
export const checkOtp = async (values: {
    phone: string 
    otp: number 
    device: {
        name: string 
        os: string 
        version: string 
        id: string 
    } | any
}): Promise<{
    statusCode: number, 
    success: boolean, 
    data: {
        userId: string
        phone: string 
        notifications: boolean
        createdAt: string 
        worksUntil: string
        deletedAt?: null 
        token: string 
        refreshToken: string
    }
}> => {
    return api.post({
        url: '/auth/check-otp', 
        data: values
    })
}

export const searchSong = async (data: {
    search: string, 
    type?: string
}): Promise<SearchType> => {
    return api.post({
        url: '/client/search', 
        data: data
    })
}
export const likeSong = async (songId: string): Promise<{
    statusCode: number, 
    success: boolean, 
    data: {liked: boolean}
}> => {
    return api.patchPrivate({
        url: `/client/song-like/${songId}`, 
        data: {}
    })
}
export const likeArtist = async (artistId: string):Promise<{
    statusCode: number, 
    success: boolean, 
    data: {message: string}
}> => {
    return api.postPrivate({
        url: '/artists/subscribe', 
        data: {artistId}
    })
}
export const likePlaylist = async (playlistId: string): Promise<{
    statusCode: number, 
    success: boolean, 
    data: {message: string}
}> => {
    return api.patchPrivate({
        url: `/client/playlist-like/${playlistId}`, 
        data: {}
    })
}
export const likeAlbum = async (albumId:string): Promise<{
    statusCode: number, 
    success: boolean, 
    data: {message: string}
}> => {
    return api.patchPrivate({
        url: `/client/albom-like/${albumId}`, 
        data: {}
    })
}
export const removeDevice = async(deviceId:string): Promise<{
    statusCode: number, 
    success: boolean, 
    data: Devices[]
}> => {
    return api.postPrivate({
        url: `/auth/remove-device/${deviceId}`,
        data: {}
    })
}
export const logOut = async (deviceId:string): Promise<{
    statusCode: number, 
    success: boolean, 
    data: {logout: boolean}
}> => {
    return api.postPrivate({
        url: `/auth/log-out/${deviceId}`, 
        data: {}
    })
}