import { api } from "../Services/api_helpers";
import Albums from "../types/queryReturnTypes/Albums";
import Artist from "../types/queryReturnTypes/Artist";
import ArtistInfo from "../types/queryReturnTypes/ArtistInfo";
import Artists from "../types/queryReturnTypes/Artists";
import Devices from "../types/queryReturnTypes/Devices";
import Genres from "../types/queryReturnTypes/Genres";
import HomeItems from "../types/queryReturnTypes/HomeItems";
import LikedArtists from "../types/queryReturnTypes/LikedArtists";
import LikedPlaylists from "../types/queryReturnTypes/LikedPlaylists";
import LikedSongs from "../types/queryReturnTypes/LikedSongs";
import Playlists from "../types/queryReturnTypes/Playlists";
import SongInfo from "../types/queryReturnTypes/SongInfo";

export const getHomeItems = async (): Promise<HomeItems> => {
    return api.patch({
        url: '/client/home', 
        data: {
            pageSize: 6
        }
    })
}
export const getSongs = async (data: {
    playlistId?: string
    artistId?: string 
    albomId?: string
    genreId?: string, 
    pageSize?: number, 
    search?: string 
}): Promise<any> => {
    return api.patchDynamic({
        url: '/client/songs', 
        data: {
            page: 1,
            pageSize: data.pageSize ?? 5,
            search: data.search ?? "",
            artistId: data.artistId ?? "",
            playlistId: data.playlistId ?? "",
            albomId: data.albomId ?? "",
            genreId: data.genreId ?? ""
        }
    })
}
export const GetSongInfo = async (songId: string): Promise<SongInfo> => {
    return api.get<SongInfo>({
        url: `/client/songs/${songId}`
    })
}
export const GetPlaylists = async (searchValue: string): Promise<Playlists> => {
    return api.patch({
        url: '/client/playlists', 
        data: {
            page: 1,
            pageSize: 20,
            search: searchValue
        }
    })
}
export const GetArtists = async (page = 1): Promise<Artists> => {
    console.log('page', page)
    return api.patch({
        url: '/artists', 
        data: {
            page,
            pageSize: 40,
            roles: []
        }
    })
}
export const GetArtist = async (artistId: string): Promise<Artist> => {
    return api.patchDynamic({
        url: '/artists/one', 
        data: {
            artistId,
            page: 1,
            pageSize: 10
        }
    })
}
export const GetArtistInfo = async (artistId: string): Promise<ArtistInfo> => {
    return api.get<ArtistInfo>({
        url: `/artists/info/${artistId}`, 
    })
}
export const GetAlbums = async (data: {
    artistId?: string 
    search?: string 
    page?: number 
    pageSize?: number
}): Promise<Albums> => {
    return api.patch({
        url: '/client/alboms', 
        data: {
            artistId: data.artistId ?? "",
            search: data.search ?? "",
            page: data.page ?? 1,
            pageSize: data.pageSize ?? 5
        }
    })
}
export const GetGenres = async (): Promise<Genres> => {
    return api.patch({
        url: '/client/genres', 
        data: {}
    })
}
export const GetFavoriteSongs = async (): Promise<LikedSongs> => {
    return api.getPrivate<LikedSongs>({
        url: '/client/favorite-songs'
    })
}
export const GetFavoriteArists = async(): Promise<LikedArtists> => {
    return api.getPrivate<LikedArtists>({
        url: '/client/favorite-artists'
    })
}
export const GetFavoritePlaylists = async (): Promise<LikedPlaylists> => {
    return api.getPrivate<LikedPlaylists>({
        url: '/client/favorite-playlists'
    })
}
export const GetDevices = async (): Promise<Devices[]> => {
    return api.getPrivate<Devices[]>({
        url: '/auth/devices'
    })
}