import { isUndefined } from "@app/_utils/helpers";
import { api } from "../Services/api_helpers";
import Albums from "../types/queryReturnTypes/Albums";
import Artist from "../types/queryReturnTypes/Artist";
import ArtistInfo from "../types/queryReturnTypes/ArtistInfo";
import Artists from "../types/queryReturnTypes/Artists";
import Banners from "../types/queryReturnTypes/Banners";
import Devices from "../types/queryReturnTypes/Devices";
import Genres from "../types/queryReturnTypes/Genres";
import HomeItems from "../types/queryReturnTypes/HomeItems";
import LikedArtists from "../types/queryReturnTypes/LikedArtists";
import LikedPlaylists from "../types/queryReturnTypes/LikedPlaylists";
import LikedSongs from "../types/queryReturnTypes/LikedSongs";
import Playlists from "../types/queryReturnTypes/Playlists";
import SongInfo from "../types/queryReturnTypes/SongInfo";
import ArtNews from "../types/queryReturnTypes/ArtNews";
import AllNews from "../types/queryReturnTypes/AllNews";
import Videos from "../types/queryReturnTypes/Videos";
import Video from "../types/queryReturnTypes/Video";

export const GetBanners = async (): Promise<Banners[]> => {
    return api.get<Banners[]>({
        url: '/client/banners'
    })
}

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
    page?: number
    pageSize?: number, 
    search?: string 
}): Promise<any> => {
    return api.patchDynamic({
        url: '/client/songs', 
        data: {
            page: data.page ?? 1,
            pageSize: data.pageSize ?? 10,
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
export const GetPlaylists = async (pageSize = 20, page = 1): Promise<Playlists> => {
    return api.patch({
        url: '/client/playlists', 
        data: {page, pageSize, search: null}
    })
}
export const GetArtists = async (page = 1): Promise<Artists> => {
    return api.patch({
        url: '/artists', 
        data: {
            page,
            pageSize: 40,
            roles: []
        }
    })
}
export const GetArtist = async (artistId: string, page = 1, pageSize = 10): Promise<Artist> => {
    console.log('artist song fetch page', page)
    return api.patchDynamic({
        url: '/artists/one', 
        data: {
            artistId,
            page,pageSize
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
export const GetGenres = async (songId?: string): Promise<Genres> => {
    return api.patch({
        url: `/client/genres${songId ? `?songId=${songId}` : ""}`, 
        data: {}
    })
}
export const GetFavoriteSongs = async (page = 0, pageSize = 10): Promise<LikedSongs> => {
    return api.getPrivate<LikedSongs>({
        url: `/client/favorite-songs?page=${page}&pageSize=${pageSize}`
    })
}
export const GetFavoriteArists = async(page = 0, pageSize = 10): Promise<LikedArtists> => {
    return api.getPrivate<LikedArtists>({
        url: `/client/favorite-artists?page=${page}&pageSize=${pageSize}`
    })
}
export const GetFavoritePlaylists = async (page = 0, pageSize = 10): Promise<LikedPlaylists> => {
    return api.getPrivate<LikedPlaylists>({
        url: `/client/favorite-playlists?page=${page}&pageSize=${pageSize}`
    })
}
export const GetFavoriteAlboms = async (page = 0, pageSize = 10): Promise<Albums['data']> => {
    return api.getPrivate<Albums['data']>({
        url: `/client/favorite-alboms?page=${page}&pageSize=${pageSize}`
    })
}
export const GetDevices = async (): Promise<Devices[]> => {
    return api.getPrivate<Devices[]>({
        url: '/auth/devices'
    })
}
export const GetArtNews = async (page = 0, pageSize = 10): Promise<AllNews> => {
    return api.patch({
        url: '/client/news', 
        data: {page, pageSize}
    })
}
export const GetOneArtNews = async (newsId: string): Promise<ArtNews> => {
    return api.get<ArtNews>({
        url: `/client/news/${newsId}`
    })
}
export const GetClips = async (args: {
    showId?: string
    clipId?: 'clips' | 'karaoke' | "concerts" | "videos" | string
    page?: number 
    pageSize?: number 
    search?: string
}): Promise<Videos> => {
    const {
        page = 0, 
        pageSize = 10, 
        search = "", 
        showId = "", 
        clipId = "clips", 
    } = args

    return api.patch<{
        showId?: string
        clipId?: 'clips' | 'karaoke' | "concerts" | "videos" | string
        page?: number 
        pageSize?: number 
        search?: string
    }, Videos>({
        url: `/client/clips`, 
        data: {
            showId,
            clipId, 
            page,
            pageSize,
            search
        }
    })
}
export const GetClip = async (id: string, clipId?: 'clips' | 'karaoke' | "concerts" | "videos", showId = ""): Promise<{data: Video}> => {
    console.log('showId', showId)
    return api.patch({
        url: '/client/clips/one', 
        data: {
            id, clipId, showId
        }
    })
}