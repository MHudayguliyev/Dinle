'use client';
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import Image from 'next/image';
import { useQuery } from 'react-query'
//styles
import styles from './page.module.scss'
import classNames from 'classnames/bind'
//api
import { getSongs } from '@app/_api/Queries/Getters'
import { likePlaylist, likeSong } from '@app/_api/Queries/Post';
//comps
import InfoMenu from '@app/_components/InfoMenu/InfoMenu';
import SongList from '@app/_components/SongList/SongList';
//icons 
import PlaySm from '@app/_components/icons/play/icon';
import PlayLg from '@app/_components/icons/simplePlay/icon';
import Share from '@app/_components/icons/share/icon';
import ShuffleI from '@app/_components/icons/shuffle/icon';
import PrevNext from '@components/icons/prevNext/icon'
import HeartFilledI from '@app/_components/icons/heartFilled/icon';
//hooks
import { useWindowScrollPositions } from '@hooks/useWindowOffset'
import useWindowSize from '@app/_hooks/useWindowSize';
import useClickOutside from '@hooks/useOutClick';
//type
import PlaylistType from '@app/_api/types/queryReturnTypes/Playlist';
//redux
import { useAppDispatch, useAppSelector } from '@hooks/redux_hooks';
import { setCurrentSong } from '@redux/reducers/MediaReducer';
import { setIsShuffle } from '@redux/reducers/MediaReducer';
//utils
import { CheckObjOrArrForNull, copyLink, isAuthorized } from '@utils/helpers';
//react-hot-toast
import toast from 'react-hot-toast';
import { setShowAuthModal } from '@app/_redux/reducers/AuthReducer';

const cn = classNames.bind(styles)
const Playlist = ({params}: {params: {each: string}}) => {

    const dispatch = useAppDispatch()
    const headerRef:any = useRef(null)
    const toggleMenuRef:any = useRef(null)
    const menuContenRef:any = useRef(null)

    const { scrolly } = useWindowScrollPositions()
    const [width] = useWindowSize()
    const id = useMemo(() => params.each,[params.each])

    //selectors 
    const song = useAppSelector(state => state.mediaReducer.songData)
    const songIndex = useAppSelector(state => state.mediaReducer.songIndex)
    const isSongPlaying = useAppSelector(state => state.mediaReducer.isSongPlaying)
    const isShuffle = useAppSelector(state => state.mediaReducer.isShuffle)

    const [rows, setRows] = useState<PlaylistType['rows']>()
    const [songId, setSongId] = useState<string>("")
    const [openMenu, setOpenMenu]= useClickOutside(menuContenRef, toggleMenuRef, 'mousedown')

    const {
        data, 
        isLoading, 
        isError, 
        refetch: refetchPlaylist
    } = useQuery(['GetPlaylist', id], () => getSongs({playlistId: id}), {
        refetchOnWindowFocus: false, enabled: !!id
    })
    // console.log("data", data)

    useEffect(() => {
        if(!isLoading && !isError) setRows(data?.data?.rows)
    }, [data?.data])

    useEffect(() => {
        const opacity = Math.min(1, scrolly / window.innerHeight)
        if(headerRef && headerRef.current)
        headerRef.current?.style?.setProperty(
            '--opacity', opacity
        )
    }, [scrolly, headerRef])

    const handleCopyLink = useCallback(() => {
        copyLink(`/playlist/${id}`)?.then((mode) => {
            if(mode === 'desktop') toast.success('Link is copied.')
        })
    }, [id])

    const handleLike = useCallback(async(songId: string) => {
        if(!isAuthorized()) return dispatch(setShowAuthModal(true))

        try {
            const response = await likeSong(songId)
            console.log('response', response)
            if(response.success && response.statusCode === 200)
            setRows(prev => prev?.map(row => row.id === songId ? {...row, isLiked: !row.isLiked} : row))
          } catch (error) {
            console.log('like song error', error)
          }
    }, [])

    const handleLikePlaylist = useCallback(async () => { 
        if(!isAuthorized()) return dispatch(setShowAuthModal(true))

        try {
            const response = await likePlaylist(id);
            console.log("resonse", response)
            if(response.success && response.statusCode === 200)
            refetchPlaylist()
        } catch (error) {
            console.log("like playlist error ", error)
        }
    }, [id])

    const playBtn = useCallback((topFixed = false) => {
        const currentSongId = song?.[songIndex]?.id
        const rowSongId = rows?.[songIndex]?.id
        const playFN = () => {
            if(CheckObjOrArrForNull(rows)){
                const index = (songIndex !== -1 && songIndex <= rows!?.length - 1 && currentSongId === rowSongId) ? songIndex : 0
                dispatch(setCurrentSong({
                    data: rows, index, id: rows?.[index]?.id
                }))
            }
        }

        const foundSameId = rows?.some(row => row.id === currentSongId)
        const isPlaying = isSongPlaying && (currentSongId === rowSongId || foundSameId)
        const styles = cn({
            topPlay: topFixed, 
            showPlayTop: scrolly >= 248 
        })

        return (
            <>
                {
                    width >= 768 ? 
                    <PlayLg className={styles} onClick={playFN} mode={isPlaying ? 'pause' : 'play'}
                    /> : <PlaySm className={styles} onClick={playFN}  mode={isPlaying ? 'pause' : 'play'}/>
                }
            </>
        )
    }, [
        song, 
        rows, 
        songIndex, 
        isSongPlaying, 
        width, 
        scrolly
    ])

    const isLiked = useMemo((): boolean => data?.data?.isLiked ?? false,[data?.data])
    // console.log("data?.data", data?.data)
    const shuffleBtn = useMemo(() => (
        <ShuffleI active={isShuffle} onClick={() => dispatch(setIsShuffle(!isShuffle))}/>
    ), [isShuffle])
    const heartBtn = useMemo(() => (
        <HeartFilledI active={isLiked} onClick={handleLikePlaylist}/>
    ), [isLiked])
    const shareBtn = useMemo(() => (
        <Share onClick={handleCopyLink}/>
    ), [id])
    const infoMenu = useMemo(() => (
        <InfoMenu
            id={songId}
            show={openMenu}
            ref={menuContenRef} 
            close={() => setOpenMenu(false)}
        />
    ), [menuContenRef, openMenu, songId])


  return (
    <>
        {infoMenu}
        <div className={styles.header} ref={headerRef}>
            <div className={styles.opts}>
                <PrevNext  mode='prev'/>
                <PrevNext  mode='next'/>
                {playBtn(true)}
            </div>
            <div className={styles.actions}>
                {shuffleBtn}
                {shareBtn}
                {heartBtn}
            </div>
        </div>

        <div className={styles.presentation}>
            <div className={styles.background_gradient}></div>
            <div className={styles.background_image}>
                <Image src={data?.data?.cover} alt='artist' width='400' height='400'/>
            </div>
            <div className={styles.wrapper}>

                <div className={styles.content_box}>
                    <Image src={data?.data?.cover!} alt='artist' width='400' height='400'/>
                    <div className={styles.playlistInfo}>
                        <div className={styles.title}>Playlist</div>
                        <div className={styles.name}>{data?.data?.title}</div>
                        <div className={styles.about}>
                            Песни {data?.data?.count} · Примерно {data?.data?.duration}
                        </div>
                    </div>
                </div>

                <div className={styles.actions}>
                    {playBtn()}
                    {shuffleBtn}
                    {shareBtn}
                    {heartBtn}
                </div>
            </div>
        </div>

        <div className={styles.presentation_mobile}>
            <div className={styles.background_image}>
                <Image src={data?.data?.cover!} alt='artist' width='400' height='400'/>
            </div>
            <div className={styles.mobile_presentation_wrapper}>

                <div className={styles.content_box}>
                    <Image src={data?.data?.cover!} alt='artist' width='400' height='400'/>
                </div>

                <div className={styles.the_bottom_content}>
                    <div className={styles.top}>
                        <div className={styles.name}>
                            {data?.data?.title}
                        </div>
                        <div className={styles.about}>
                            Песни {data?.data?.count} · Примерно {data?.data?.duration}
                        </div>
                        <div className={styles.title}>
                            Playlist
                        </div>
                    </div>

                    <div className={styles.bottom}>
                        {playBtn()}
                    </div>
                </div>

            </div>
        </div>

        <SongList 
            data={rows}
            fetchStatuses={{
                isLoading, isError
            }}
            className={styles.songList}
            onShowInfo={(id) => {
                setSongId(id)
                setOpenMenu(true)
            }}
            onLike={handleLike}
            onPlay={(index) => dispatch(setCurrentSong({data: rows, index, id: rows?.[index]?.id}))}
        />
    </>
  )
}

export default Playlist