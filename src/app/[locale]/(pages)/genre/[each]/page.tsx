'use client';
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useRouter } from 'next/navigation';
import { useQuery, useInfiniteQuery } from 'react-query'
import Image from 'next/image';
//styles
import styles from './page.module.scss'
import classNames from 'classnames/bind'
//api
import { getSongs } from '@app/_api/Queries/Getters'
import { likeSong } from '@app/_api/Queries/Post';
//libs
import PrevNext from '@components/icons/prevNext/icon'
//comps
import InfoMenu from '@app/_components/InfoMenu/InfoMenu';
import SongList from '@app/_components/SongList/SongList';
//icons 
import PlaySm from '@app/_components/icons/play/icon';
import PlayLg from '@app/_components/icons/simplePlay/icon';
import Share from '@app/_components/icons/share/icon';
import ShuffleI from '@app/_components/icons/shuffle/icon';
//hooks
import { useWindowScrollPositions } from '@hooks/useWindowOffset'
import useClickOutside from '@hooks/useOutClick';
//types
import Songs from '@app/_api/types/queryReturnTypes/Songs';
//redux
import { useAppDispatch, useAppSelector } from '@app/_hooks/redux_hooks';
import { setCurrentSong, setIsShuffle } from '@app/_redux/reducers/MediaReducer';
import { CheckObjOrArrForNull, copyLink, findIndex } from '@app/_utils/helpers';
import useWindowSize from '@app/_hooks/useWindowSize';
import toast from 'react-hot-toast';
import useObserve from '@app/_hooks/useObserve';
import TopNavbar from '@app/_components/TopNavbar/TopNavbar';

const cn = classNames.bind(styles)
const Genre = ({params}: {params: {each: string}}) => {
    const dispatch = useAppDispatch()
    const toggleMenuRef:any = useRef(null)
    const menuContenRef:any = useRef(null)
    const genresRef = useRef<IntersectionObserver>();

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

    //query
    const {
        data: genresData, 
        hasNextPage, 
        isFetching, 
        isError, 
        isLoading,
        fetchNextPage, 
    } = useInfiniteQuery({
        queryKey: ['GetGenre', id], 
        queryFn: ({pageParam}) => getSongs({genreId: id, page: pageParam}), 
        enabled: !!id
    })
    const lastGenreRef = useObserve({
        observer: genresRef, 
        hasNextPage, isFetching, 
        isLoading, fetchNextPage, 
    })
    const credentials = useMemo(() => {
        if(CheckObjOrArrForNull(genresData)){
            const pagesData = genresData?.pages?.[0]?.data
            const obj = {
                cover: pagesData?.cover, 
                count: pagesData?.count, 
                isLiked: pagesData?.isLiked, 
                title: pagesData?.title, 
                duration: pagesData?.duration, 
                producedAt: pagesData?.producedAt
            }
            return obj
        }
        return null
    }, [genresData])
    const genresList = useMemo(() => {
        return genresData?.pages.reduce((acc, page) => {
          return [...acc, ...page.data.rows];
        }, [])
    }, [genresData]);

    useEffect(() => {
        if(CheckObjOrArrForNull(genresList)) setRows(genresList)
    }, [genresList])

    const handleCopyLink = useCallback(() => {
        copyLink(`/genre/${id}`)?.then((mode) => {
            if(mode === 'desktop') toast.success('Link is copied.')
        })
    }, [id])

    const handleLike = useCallback(async(songId: string) => {
        try {
            const response = await likeSong(songId)
            console.log('response', response)
            if(response.success && response.statusCode === 200)
            setRows(prev => prev?.map(row => row.id === songId ? {...row, isLiked: !row.isLiked} : row))
          } catch (error) {
            console.log('like song error', error)
          }
    }, [])
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

    const shuffleBtn = useMemo(() => (
        <ShuffleI active={isShuffle} onClick={() => dispatch(setIsShuffle(!isShuffle))}/>
    ), [isShuffle])
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
    const cover = useMemo(() => (
        <Image src={credentials?.cover ?? ""} alt='artist' width='400' height='400'/>
    ), [credentials?.cover])

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
                <div className={styles.actions}>
                    {shuffleBtn}
                    {shareBtn}
                </div>
            )}
        />

        <div className={styles.presentation}>
            <div className={styles.background_gradient}></div>
            <div className={styles.background_image}>
                {cover}
            </div>
            <div className={styles.wrapper}>

                <div className={styles.content_box}>
                    {cover}
                    <div className={styles.artist}>
                        <div className={styles.title}>Genre</div>
                        <div className={styles.name}>{credentials?.title}</div>
                    </div>
                </div>

                <div className={styles.actions}>
                    {playBtn()}
                    {shuffleBtn}
                    {shareBtn}
                </div>
            </div>
        </div>

        <div className={styles.presentation_mobile}>
            <div className={styles.background_image}>
                {cover}
            </div>
            <div className={styles.mobile_presentation_wrapper}>

                <div className={styles.content_box}>
                    {cover}
                </div>

                <div className={styles.the_bottom_content}>
                    <div className={styles.top}>
                        <div className={styles.name}>{credentials?.title}</div>
                        <div className={styles.title}>
                            Genre
                        </div>
                    </div>

                    <div className={styles.bottom}>
                        {playBtn()}
                    </div>
                </div>

            </div>
        </div>

        <SongList 
            ref={lastGenreRef}
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

export default Genre