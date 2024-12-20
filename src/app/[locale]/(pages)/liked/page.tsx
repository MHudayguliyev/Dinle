'use client';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useInfiniteQuery } from 'react-query';
//styles
import styles from './page.module.scss';
import classNames from 'classnames/bind';
//icons 
import PlaySm from '@app/_components/icons/play/icon';
import PlayLg from '@app/_components/icons/simplePlay/icon';
import PlayExtraSm from '@app/_components/icons/playExtraSm/icon';
import Share from '@components/icons/share/icon';
import ShuffleI from '@components/icons/shuffle/icon';
import ShuffleSmI from '@app/_components/icons/shuffleSm/icon';
import PrevNext from '@components/icons/prevNext/icon'
//libs
import Tab from '@app/_compLibrary/Tab';
import Button from '@app/_compLibrary/Button';
import SongList from '@app/_components/SongList/SongList';
//redux
import { useAppDispatch, useAppSelector } from '@app/_hooks/redux_hooks';
import { setCurrentSong, setIsShuffle } from '@app/_redux/reducers/MediaReducer';
//types
import { TabMenuTypes } from '@app/_types';
import Songs from '@app/_api/types/queryReturnTypes/Songs';
//comps
import StandardCard from '@app/_components/StandardCard/StandardCard';
import InfoMenu from '@app/_components/InfoMenu/InfoMenu';
import AuthMiddleware from '@app/_components/AuthMiddleware';
//hooks
import useClickOutside from '@app/_hooks/useOutClick';
import { useWindowScrollPositions } from '@hooks/useWindowOffset'
import useWindowSize from '@app/_hooks/useWindowSize';
//utils
import { CheckObjOrArrForNull, copyLink, isUndefined } from '@app/_utils/helpers';

import { GetFavoriteAlboms, GetFavoriteArists, GetFavoritePlaylists, GetFavoriteSongs } from '@app/_api/Queries/Getters';
//icons
import LikeStaticI from '@app/_components/icons/likeStatic/icon';
//toast
import toast from 'react-hot-toast';
import { likeSong } from '@app/_api/Queries/Post';
import useObserve from '@app/_hooks/useObserve';
import Artists from '@app/_api/types/queryReturnTypes/Artists';
import LikedSongs from '@app/_api/types/queryReturnTypes/LikedSongs';
import Albums from '@app/_api/types/queryReturnTypes/Albums';
import LikedPlaylists from '@app/_api/types/queryReturnTypes/LikedPlaylists';
import TopNavbar from '@app/_components/TopNavbar/TopNavbar';
//api
import { refreshAccessToken } from '@app/_api/Services/auth_token';
import { isAxiosError } from 'axios';
//translations
import { useTranslations } from 'next-intl';

const cn = classNames.bind(styles)
const ViewAll = () => {
    const songsObserver = useRef<IntersectionObserver>();
    const artistsObserver = useRef<IntersectionObserver>();
    const playlistsObserver = useRef<IntersectionObserver>();
    const albomsObserver = useRef<IntersectionObserver>();

    const t = useTranslations('favorite')
    const router = useRouter()
    const dispatch = useAppDispatch()
    const searchParam = useSearchParams()
    const tab = searchParam.get('tab')
    const { scrolly } = useWindowScrollPositions()
    const [width] = useWindowSize()
    const tabs: TabMenuTypes[] = [
      {
        route: 'song', label: {
          tm: 'Aýdym', ru: 'Песни'
        }
      }, 
      {
        route: 'artist', label: {
          tm:'Artist', ru: 'Артисты'
        }
      },
      {route: 'albom', label: {
        tm:'Albom', ru: 'Альбомы'
      }}, 
      {route: 'playlist', label: {
        tm:'Plaýlist', ru: 'Плейлисты'
      }}
    ]

    const showSongs = useMemo(() => tab === tabs[0].route || isUndefined(tab),[tab,tabs])
    const showArtists = useMemo(() => tab === tabs[1].route,[tab, tabs])
    const showAlboms = useMemo(() => tab === tabs[2].route,[tab, tabs])
    const showPlaylists = useMemo(() => tab === tabs[tabs.length - 1].route,[tab, tabs])
    

    //redux states 
    const song = useAppSelector(state => state.mediaReducer.songData)
    const songIndex = useAppSelector(state => state.mediaReducer.songIndex)
    const isSongPlaying = useAppSelector(state => state.mediaReducer.isSongPlaying)
    const isShuffle = useAppSelector(state => state.mediaReducer.isShuffle)

    const toggleRef: any = useRef(null)
    const contentRef: any = useRef(null)
    const [showInfoMenu, setShowInfoMenu] = useClickOutside(contentRef, toggleRef, 'mousedown')
    const [songId, setSongId] = useState<string>("")
    const [songsRow, setSongsRow] = useState<Songs['rows']>([])

    //queries
    const {
      data: songsData, 
      hasNextPage: hasSongNextPage, 
      isFetching: isFetchingSongs, 
      isError: isSongsError, 
      isLoading: isSongsLoading,
      fetchNextPage: fetchSongNextPage, 
      isRefetching: isSongsRefetcing
    } = useInfiniteQuery({
      queryKey: ['FavoriteSongs', showSongs], 
      queryFn: ({pageParam}) => GetFavoriteSongs(pageParam), 
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.rows.length ? allPages.length + 1 : undefined;
      }, 
      enabled: showSongs
    })
    const {
      data: artistsData, 
      hasNextPage: hasArtistNextPage, 
      isFetching: isFetchingArtists, 
      isError: isArtistsError, 
      isLoading: isArtistsLoading,
      fetchNextPage: fetchArtistNextPage, 
      isRefetching: isArtistsRefetcing
    } = useInfiniteQuery({
      queryKey: ['FavoriteArtists', showArtists], 
      queryFn: ({pageParam}) => GetFavoriteArists(pageParam), 
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.rows.length ? allPages.length + 1 : undefined;
      }, 
      enabled: showArtists
    })
    const {
      data: albomsData, 
      hasNextPage: hasAlbomNextPage, 
      isFetching: isFetchingAlboms, 
      isError: isAlbomsError, 
      isLoading: isAlbomsLoading,
      fetchNextPage: fetchAlbomNextPage, 
      isRefetching: isAlbomsRefetcing
    } = useInfiniteQuery({
      queryKey: ['FavoriteAlboms', showAlboms], 
      queryFn: ({pageParam}) => GetFavoriteAlboms(pageParam), 
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.rows.length ? allPages.length + 1 : undefined;
      }, 
      enabled: showAlboms
    })
    const {
      data: playlistsData, 
      hasNextPage: hasPlaylistNextPage, 
      isFetching: isFetchingPlaylists, 
      isError: isPlaylistsError, 
      isLoading: isPlaylistsLoading,
      fetchNextPage: fetchPlaylistNextPage, 
      isRefetching: isPlaylistsRefetcing
    } = useInfiniteQuery({
      queryKey: ['FavoritePlaylists', showPlaylists], 
      queryFn: ({pageParam}) => GetFavoritePlaylists(pageParam), 
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.rows.length ? allPages.length + 1 : undefined;
      }, 
      enabled: showPlaylists
    })

    //last element refs
    const lastSongRef = useObserve({
      observer: songsObserver, 
      hasNextPage: hasSongNextPage, 
      isFetching: isFetchingSongs, 
      isLoading: isSongsLoading, 
      fetchNextPage: fetchSongNextPage, 
    })
    const lastArtistRef = useObserve({
      observer: artistsObserver, 
      hasNextPage: hasArtistNextPage, 
      isFetching: isFetchingArtists, 
      isLoading: isArtistsLoading, 
      fetchNextPage: fetchArtistNextPage, 
    })
    const lastAlbomRef = useObserve({
      observer: albomsObserver, 
      hasNextPage: hasAlbomNextPage, 
      isFetching: isFetchingAlboms, 
      isLoading: isAlbomsLoading, 
      fetchNextPage: fetchAlbomNextPage, 
    })
    const lastPlaylistRef = useObserve({
      observer: playlistsObserver, 
      hasNextPage: hasPlaylistNextPage, 
      isFetching: isFetchingPlaylists, 
      isLoading: isPlaylistsLoading, 
      fetchNextPage: fetchPlaylistNextPage, 
    })

  //lists
  const songsList = useMemo((): LikedSongs['rows'] => {
    // @ts-ignore
    return songsData?.pages.reduce((acc, page) => {
      return [...acc, ...page.rows];
    }, [])
  }, [songsData]);
  const artistsList = useMemo((): Artists['data']['rows'] => {
    // @ts-ignore
    return artistsData?.pages.reduce((acc, page) => {
      return [...acc, ...page.rows];
    }, [])
  }, [artistsData]);
  const albomsList = useMemo((): Albums['data']['rows'] => {
    // @ts-ignore
    return albomsData?.pages.reduce((acc, page) => {
      return [...acc, ...page.rows];
    }, [])
  }, [albomsData]);
  const playlistsList = useMemo((): LikedPlaylists['rows'] => {
    // @ts-ignore
    return playlistsData?.pages.reduce((acc, page) => {
      return [...acc, ...page.rows];
    }, [])
  }, [playlistsData]);
  
  useEffect(() => {
    if(CheckObjOrArrForNull(songsList)) setSongsRow(songsList)
  }, [songsList])

  const refreshToken = (cb: Function) => {
    refreshAccessToken().then(isError => {
        if(isError) router.replace('/login')
        else cb()
    })
  }

  const handleLike = useCallback(async (id: string) => {
    try {
      const repsonse = await likeSong(id)
      if(repsonse.statusCode === 200 && repsonse.success)
      setSongsRow(prevRows => prevRows.filter(row => row.id !== id))
    } catch (error) {
      if(isAxiosError(error)){
        if(error.response?.status === 401){
            refreshToken(() =>  handleLike(id))
        }
      }else console.log('like song error', error)
    }
  }, [setSongsRow, refreshToken])

  const loader = useCallback((tab: 'artist' | 'playlist' | 'albom' | 'genre', withTopShimmer = false) => {
    return (
      <>
      {withTopShimmer && <span className={styles.topShimmer}></span>}
        <div className={styles.grid_wrapper}>
          {
            [1,2,3,4,5].map(item => (
              <StandardCard 
                id=""
                key={item}
                shimmer
                artists={tab === 'artist'}
                playlists={tab === 'playlist'}
                alboms={tab === 'albom'}
                genres={tab === 'genre'}
                title=''
              />
            ))
          }
        </div>
      </>
    )
  }, [])
  
  const toggleShuffle = useCallback(() => dispatch(setIsShuffle(!isShuffle)), [isShuffle, dispatch])

  const songIds = useMemo(() => {
    return {
      currentSongId: song?.[songIndex]?.id, 
      rowSongId: songsRow?.[songIndex]?.id
    }
  }, [  
    song, 
    songIndex, 
    songsRow
  ])
  const shareBtn = useMemo(() => (
    <Share onClick={() => 
      copyLink('/liked')?.then((mode) => {
        if(mode === 'desktop') toast.success('Link is copied.')
      })
    }/>
  ), [])
  const infoMenu = useMemo(() => (
    <InfoMenu
      id={songId} 
      ref={contentRef}
      show={showInfoMenu}
      close={() => setShowInfoMenu(false)}
      fetchMode='song'
    />
  ), [
    songId, 
    contentRef, 
    showInfoMenu, 
    setShowInfoMenu
  ])

  const playFN = useCallback(() => {
    const {
      currentSongId, 
      rowSongId
    } = songIds
    if(CheckObjOrArrForNull(songsRow)){
      const index = (songIndex !== -1 && songIndex <= songsRow!?.length - 1 && currentSongId === rowSongId) ? songIndex : 0
      dispatch(setCurrentSong({
        data: songsRow, index, id: songsRow[index]?.id
      }))
    }
  }, [
    songsRow, 
    songIndex, 
    songIds, 
    dispatch
  ])

  const playBtn = useCallback((topFixed = false, extraSm = false) => {
    const {
      currentSongId, 
      rowSongId
    } = songIds
    
    const disabled = (showArtists || showPlaylists)
    const foundSameId = songsRow?.some(row => row.id === currentSongId)
    const isPlaying = isSongPlaying && (currentSongId === rowSongId || foundSameId)
    const styles = cn({
        topPlay: topFixed, 
        showPlayTop: scrolly >= 248 
    })
    
    return (
        <>
            {
              width <= 768 && extraSm ? 
              <PlayExtraSm mode={isPlaying ? 'pause' : 'play'} disable={disabled}/> : 
              width <= 768 ? 
              <PlaySm disable={disabled} className={styles} onClick={playFN}  mode={isPlaying ? 'pause' : 'play'}/> : 
              <PlayLg disable={disabled} className={styles} onClick={playFN} mode={isPlaying ? 'pause' : 'play'}
              /> 
            }
        </>
    )
}, [
    songIds,  
    isSongPlaying, 
    width, 
    scrolly, 
    showArtists, 
    showPlaylists, 
    songsRow,
    playFN
])

  return (
    <>
      {infoMenu}
      <TopNavbar 
        className={styles.topHeader}
        renderOptions={() => (
            <div className={styles.opts}>
                <PrevNext  mode='prev'/>
                <PrevNext  mode='next'/>
                {playBtn(true)}  
            </div>
        )}
        renderActions={() => (
            <>
              {scrolly >= 271 && <div className={styles.title}>{t('title')}</div>}
              <div className={styles.topActions}>
                {shareBtn}
              </div>
            </>
        )}
      />

      <div className={styles.presentation}>
        <div className={styles.gradient}></div>
        <div className={styles.wrapper}>

          <div className={styles.content_box}>
            <div className={styles.box}>
              <LikeStaticI />
            </div>

            <div className={styles.my_favorite}>
              <div className={styles.title}>{t('title')}</div>
              {/* <p>Songs {songs?.count}</p> */}
            </div>
          </div>

          <div className={styles.actions}>
            {playBtn()}
            <ShuffleI active={isShuffle} onClick={toggleShuffle}/>
            {shareBtn}
          </div>

        </div>

      </div>

      <div className={styles.presentation_mobile}>
        <div className={styles.gradient}></div>
        <div className={styles.mobile_presentation_wrapper}>

          <div className={styles.content_box}>
            <div className={styles.box}>
              <LikeStaticI />
            </div>
          </div>

          <div className={styles.the_bottom}>
            <div className={styles.my_favorite}>
              <div className={styles.title}>My foverim</div>
              {/* <p>Songs {songs?.count}</p> */}
            </div>

            <div className={styles.actions}>
              <Button color='lightDarkThird' roundedSm className={styles.actionBtn} onClick={playFN}>
                {playBtn(false, true)}
              </Button>
              <Button color='lightDarkThird' roundedSm className={styles.actionBtn} onClick={toggleShuffle}>
                <ShuffleSmI />
              </Button>
            </div>
          </div>

        </div>

      </div>

      <Tab 
        baseUrl='liked'
        tabs={tabs}
        pathname={tab}
        scrollYPosition={271}
        fixed
      />

      {
        showSongs && 
        <SongList 
          ref={lastSongRef}
          data={songsRow ?? []}
          fetchStatuses={{
            isLoading: isSongsLoading, isError: isSongsError
          }}
          className={styles.songsList}
          onLike={handleLike}
          onPlay={(index) => dispatch(setCurrentSong({data: songsRow, index, id: songsRow[index]?.id}))}
          onShowInfo={(id) => {
            // console.log("id", id)
            setSongId(id)
            setShowInfoMenu(true)
          }}
        />
      }

      {
        showArtists && 
        isArtistsLoading ? loader('artist') : 
        <div className={styles.grid_wrapper}>
          {
            artistsList?.map(artist => (
              <StandardCard
                key={artist.id}
                ref={lastArtistRef} 
                id={artist.id}
                artistId={artist.id}
                image={artist.cover}
                title={artist.title}
                artists
              />
            ))
          }
        </div>
      }

      {
        showAlboms && 
        isAlbomsLoading ? loader('albom') : 
        <div className={styles.grid_wrapper}>
          {
            albomsList?.map(albom => (
              <StandardCard
                key={albom.id}
                ref={lastAlbomRef} 
                id={albom.id}
                albomId={albom.id}
                artistId={albom.id}
                image={albom.cover}
                title={albom.title}
                alboms
              />
            ))
          }
        </div>
      }

      {
        showPlaylists && 
        isPlaylistsLoading ? loader('playlist') : 
        <div className={styles.grid_wrapper}>
          {
            playlistsList?.map(playlist => (
              <StandardCard
                key={playlist.id}
                ref={lastPlaylistRef} 
                id={playlist.id}
                playlistId={playlist.id}
                image={playlist.cover}
                title={playlist.title}
                playlists
                hideMoreI
              />
            ))
          }
        </div>
      }

        

    </>
  )
}

export default AuthMiddleware(ViewAll)