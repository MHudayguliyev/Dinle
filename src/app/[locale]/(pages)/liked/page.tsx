'use client';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from 'react-query';
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
import Preloader from '@app/_compLibrary/Preloader';
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
import { CheckObjOrArrForNull, copyLink, getUserDevice, isUndefined } from '@app/_utils/helpers';

import { GetFavoriteArists, GetFavoritePlaylists, GetFavoriteSongs } from '@app/_api/Queries/Getters';
//icons
import LikeStaticI from '@app/_components/icons/likeStatic/icon';
//toast
import toast from 'react-hot-toast';
import { likeSong } from '@app/_api/Queries/Post';

const cn = classNames.bind(styles)
const ViewAll = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const searchParam = useSearchParams()
    const searchType = searchParam.get('type')
    const { scrolly } = useWindowScrollPositions()
    const [width] = useWindowSize()

    const tabs: TabMenuTypes[] = [
      {
        route: 'song', label: {
          en: 'Songs', tm: 'Songs', ru:'Songs'
        }
      }, 
      {
        route: 'artist', label: {
          en: 'Artists', tm:'Artists', ru: 'Artists'
        }
      },
      {route: 'playlist', label: {
        en: 'Playlist', tm:'Playlist', ru: 'Playlist'
      }}
    ]

    const showSongs = useMemo(() => searchType === tabs[0].route || isUndefined(searchType),[searchType])
    const showArtists = useMemo(() => searchType === tabs[1].route,[searchType])
    const showPlaylists = useMemo(() => searchType === tabs[2].route,[searchType])

    //redux states 
    const song = useAppSelector(state => state.mediaReducer.songData)
    const songIndex = useAppSelector(state => state.mediaReducer.songIndex)
    const isSongPlaying = useAppSelector(state => state.mediaReducer.isSongPlaying)
    const isShuffle = useAppSelector(state => state.mediaReducer.isShuffle)

    const headerRef:any = useRef(null)
    const toggleRef: any = useRef(null)
    const contentRef: any = useRef(null)
    const [showInfoMenu, setShowInfoMenu] = useClickOutside(contentRef, toggleRef, 'mousedown')
    const [songId, setSongId] = useState<string>("")
    const [songsRow, setSongsRow] = useState<Songs['rows']>([])

    //queries
    const {
      data: songs, 
      isLoading: isSongsLoading, 
      isError: isSongsError, 
      isRefetching: refetchingSongs
    } = useQuery(['GetFavoriteSongs', showSongs], () => GetFavoriteSongs(), {
      refetchOnWindowFocus: false, enabled: showSongs
    })
    // console.log('songs', songs)

    const {
      data: artists, 
      isLoading: isArtistsLoading, 
      isError: isArtistsError, 
      isRefetching: refetchingArtists
    } = useQuery(['GetFavoriteArtists', showArtists], () => GetFavoriteArists(), {
      refetchOnWindowFocus: false, enabled: showArtists
    })
    const {
      data: playlists, 
      isLoading: isPlaylistsLoading, 
      isError: isPlaylistsError, 
      isRefetching: refetchingPlaylists
    } = useQuery(['GetFavoritePlaylists', showPlaylists], () => GetFavoritePlaylists(), {
      refetchOnWindowFocus: false, enabled: showPlaylists
    })

    useEffect(() => {
      if(!isSongsLoading && !isSongsError) setSongsRow(songs!?.rows)
    }, [songs])

    useEffect(() => {
      const opacity = Math.min(1, scrolly / window.innerHeight)
      if(headerRef && headerRef.current)
      headerRef.current?.style?.setProperty(
          '--opacity', opacity
      )
    }, [scrolly, headerRef])


    const handleLike = useCallback(async (id: string) => {
      try {
        const repsonse = await likeSong(id)
        console.log("res", repsonse)
        if(repsonse.statusCode === 200 && repsonse.success)
        setSongsRow(prevRows => prevRows.filter(row => row.id !== id))
      } catch (error) {
        console.log(error)
      }
    }, [setSongsRow])

    const loader = useCallback((type: 'artist' | 'playlist' | 'album' | 'genre', withTopShimmer = false) => {
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
                  artists={type === 'artist'}
                  playlists={type === 'playlist'}
                  alboms={type === 'album'}
                  genres={type === 'genre'}
                  title=''
                />
              ))
            }
          </div>
        </>
      )
    }, [])
    
    const toggleShuffle = useCallback(() => dispatch(setIsShuffle(!isShuffle)), [isShuffle])

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
      songIds
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
      showPlaylists
  ])

  return (
    <>
      {infoMenu}
      <div className={styles.header} ref={headerRef}>
        <div className={styles.opts}>
          <PrevNext  mode='prev'/>
          <PrevNext  mode='next'/>
          {playBtn(true)}
        </div>
        <div className={styles.share}>
          {shareBtn}
        </div>
      </div>

      <div className={styles.presentation}>
        <div className={styles.gradient}></div>
        <div className={styles.wrapper}>

          <div className={styles.content_box}>
            <div className={styles.box}>
              <LikeStaticI />
            </div>

            <div className={styles.my_favorite}>
              <div className={styles.title}>My foverim</div>
              <p>Songs {songs?.count}</p>
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
              <p>Songs {songs?.count}</p>
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
        pathname={searchType}
        scrollYPosition={271}
        fixed
      />

      <div className={cn({
        section: true, 
        show: showSongs
      })}>

        <SongList 
          data={songsRow ?? []}
          fetchStatuses={{
            isLoading: isSongsLoading, isError: isSongsError
          }}
          className={styles.songsList}
          onLike={handleLike}
          onPlay={(index) => dispatch(setCurrentSong({data: songsRow, index, id: songsRow[index]?.id}))}
          onShowInfo={(id) => {
            console.log("id", id)
            setSongId(id)
            setShowInfoMenu(true)
          }}
        />

      </div>

      <div className={cn({
        section: true,
        show: showArtists
      })}>
        {
          isArtistsLoading || refetchingArtists ? loader('artist') : 
          <div className={styles.grid_wrapper}>
            {
              artists?.rows?.map(artist => (
                <StandardCard 
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
      </div>


      <div className={cn({
        section: true,
        show: showPlaylists
      })}>
        {
          isPlaylistsLoading || refetchingPlaylists ? loader('playlist') : 
          <div className={styles.grid_wrapper}>
            {
              playlists?.rows?.map(playlist => (
                <StandardCard 
                  id={playlist.id}
                  playlistId={playlist.id}
                  image={playlist.cover}
                  title={playlist.title}
                  playlists
                />
              ))
            }
          </div>
        }
      </div>

    </>
  )
}

export default AuthMiddleware(ViewAll)