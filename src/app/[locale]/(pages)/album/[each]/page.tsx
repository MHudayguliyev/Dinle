'use client';
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query'
import Image from 'next/image';
//styles
import styles from './page.module.scss'
import classNames from 'classnames/bind'
//api
import { getSongs } from '@app/_api/Queries/Getters'
import { likeAlbum, likeSong } from '@app/_api/Queries/Post';
//comps
import InfoMenu from '@app/_components/InfoMenu/InfoMenu';
import SongList from '@app/_components/SongList/SongList';
//icons 
import PlaySm from '@app/_components/icons/play/icon';
import PlayLg from '@app/_components/icons/simplePlay/icon';
import Share from '@app/_components/icons/share/icon';
import ShuffleI from '@app/_components/icons/shuffle/icon';
import PrevNext from '@components/icons/prevNext/icon'

//hooks
import { useWindowScrollPositions } from '@hooks/useWindowOffset'
import useClickOutside from '@hooks/useOutClick';
//types
import Songs from '@app/_api/types/queryReturnTypes/Songs';
//redux
import { useAppDispatch, useAppSelector } from '@app/_hooks/redux_hooks';
import { setCurrentSong, setIsShuffle } from '@app/_redux/reducers/MediaReducer';
import { CheckObjOrArrForNull, copyLink, isAuthorized, findIndex } from '@app/_utils/helpers';
import { setShowAuthModal } from '@app/_redux/reducers/AuthReducer';
import useWindowSize from '@app/_hooks/useWindowSize';
import HeartFilledI from '@app/_components/icons/heartFilled/icon';
import toast from 'react-hot-toast';

const cn = classNames.bind(styles)
const Album = ({params}: {params: {each: string}}) => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const headerRef:any = useRef(null)
    const toggleMenuRef:any = useRef(null)
    const menuContenRef:any = useRef(null)

    const { scrolly } = useWindowScrollPositions()
    const [width] = useWindowSize()
    const id = useMemo(() => params.each,[params.each])

    const [rows, setRows] = useState<Songs['rows']>()
    const [songId, setSongId] = useState<string>("")
    const [openMenu, setOpenMenu]= useClickOutside(menuContenRef, toggleMenuRef, 'mousedown')

    //selectors 
    const song = useAppSelector(state => state.mediaReducer.songData)
    const songIndex = useAppSelector(state => state.mediaReducer.songIndex)
    const isSongPlaying = useAppSelector(state => state.mediaReducer.isSongPlaying)
    const isShuffle = useAppSelector(state => state.mediaReducer.isShuffle)

    const {
        data, 
        isLoading, 
        isError, 
        refetch: refetchAlbum
    } = useQuery(['GetAlbum', id], () => getSongs({albomId: id}), {
        refetchOnWindowFocus: false, enabled: !!id
    })
    // console.log("data", data)

    useEffect(() => {
        if(!isLoading && !isError) setRows(data?.data?.rows)
    }, [data?.data])

    // in future, move this pieace of code to its main hook
    useEffect(() => {
        const opacity = Math.min(1, scrolly / window.innerHeight)
        if(headerRef && headerRef.current)
        headerRef.current?.style?.setProperty(
            '--opacity', opacity
        )
    }, [scrolly, headerRef])

    const handleCopyLink = useCallback(() => {
        copyLink(`/album/${id}`)?.then((mode) => {
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

    const handleLikeAlbum = useCallback(async () => {
        if(!isAuthorized()) return dispatch(setShowAuthModal(true))

        try {
            const response = await likeAlbum(id);
            // console.log("res", response)
            if(response.success && response.statusCode === 200)
            refetchAlbum();
        } catch (error) {
            console.log("like album error", error)
        }
    }, [id])

    const playBtn = useCallback((topFixed = false) => {
        const currentSongId = song?.[songIndex]?.id
        const rowIndex = findIndex(rows, currentSongId)
        const rowSongId = rows?.[rowIndex]?.id

        const playFN = () => {
            if(CheckObjOrArrForNull(rows)){
                const index = (rowIndex !== -1 && currentSongId === rowSongId) ? rowIndex : 0
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
    const heartBtn = useMemo(() => (
        <HeartFilledI active={isLiked} onClick={handleLikeAlbum}/>
    ), [isLiked])
    const shuffleBtn = useMemo(() => (
        <ShuffleI active={isShuffle} onClick={() => dispatch(setIsShuffle(!isShuffle))}/>
    ), [isShuffle])
    const shareBtn = useMemo(() => (
        <Share onClick={handleCopyLink}/>
    ), [id])
    const infoMenu = useMemo(() => (
        <InfoMenu
            id={id}
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
                    <Image src={data?.data?.cover} alt='artist' width='400' height='400'/>
                    <div className={styles.artist}>
                        <div className={styles.title}>Album</div>
                        <div className={styles.name}>{data?.data?.title}</div>
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
                <Image src={data?.data?.cover} alt='artist' width='400' height='400'/>

            </div>
            <div className={styles.mobile_presentation_wrapper}>

                <div className={styles.content_box}>
                    <Image src={data?.data?.cover} alt='artist' width='400' height='400'/>

                </div>

                <div className={styles.the_bottom_content}>
                    <div className={styles.top}>
                        <div className={styles.name}>
                            {data?.data?.title}
                        </div>
                        <div className={styles.title}>
                            Album
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

export default Album