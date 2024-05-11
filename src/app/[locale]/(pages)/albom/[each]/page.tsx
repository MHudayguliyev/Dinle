'use client';
import React, { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useInfiniteQuery } from 'react-query'
import { useRouter } from 'next/navigation';
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
import useObserve from '@app/_hooks/useObserve';
import TopNavbar from '@app/_components/TopNavbar/TopNavbar';
import Preloader from '@app/_compLibrary/Preloader';
import { refreshAccessToken } from '@app/_api/Services/auth_token';
import { isAxiosError } from 'axios';
//translations
import { useTranslations } from 'next-intl';

const cn = classNames.bind(styles)
const Album = ({params}: {params: {each: string}}) => {
    const t = useTranslations('title')
    const router = useRouter()
    const dispatch = useAppDispatch()
    const albomsObserver = useRef<IntersectionObserver>();
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
        data: albomsData, 
        hasNextPage, 
        isFetching, 
        isError, 
        isLoading,
        fetchNextPage, 
        refetch: refetchAlbum
    } = useInfiniteQuery({
        queryKey: ['GetAlbum', id], 
        queryFn: ({pageParam}) => getSongs({ albomId: id, page: pageParam }), 
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.data.rows.length ? allPages.length + 1 : undefined;
        }, 
        enabled: !!id
    })
    const lastAlbomRef = useObserve({
        observer: albomsObserver, 
        hasNextPage, isFetching, 
        isLoading, fetchNextPage, 
    })
    const credentials = useMemo(() => {
        if(CheckObjOrArrForNull(albomsData)){
            const pagesData = albomsData?.pages?.[0]?.data
            const obj = {
                cover: pagesData?.cover, 
                count: pagesData?.count, 
                isLiked: pagesData?.isLiked, 
                title: pagesData?.title
            }
            return obj
        }
        return null
    }, [albomsData])
    const albomsList = useMemo(() => {
        return albomsData?.pages.reduce((acc, page) => {
          return [...acc, ...page.data.rows];
        }, [])
    }, [albomsData]);

    useEffect(() => {
        if(CheckObjOrArrForNull(albomsList))
        setRows(albomsList)
    },[albomsList])

    const refreshToken = (cb: Function) => {
        refreshAccessToken().then(isError => {
            if(isError) router.replace('/login')
            else cb()
        })
    }

    const handleCopyLink = useCallback(() => {
        copyLink(`/album/${id}`)?.then((mode) => {
            if(mode === 'desktop') toast.success('Link is copied.')
        })
    }, [id])

    const handleLike = useCallback(async(songId: string) => {
        if(!isAuthorized()) return dispatch(setShowAuthModal(true))
        try {
            const response = await likeSong(songId)
            // console.log('response', response)
            if(response.success && response.statusCode === 200)
            setRows(prev => prev?.map(row => row.id === songId ? {...row, isLiked: !row.isLiked} : row))
          } catch (error) {
            if(isAxiosError(error)){
                if(error.response?.status === 401){
                    refreshToken(() =>  handleLike(songId))
                }
            }else console.log('like song error', error)
          }
    }, [dispatch, refreshToken])

    const handleLikeAlbum = useCallback(async () => {
        if(!isAuthorized()) return dispatch(setShowAuthModal(true))

        try {
            const response = await likeAlbum(id);
            if(response.success && response.statusCode === 200)
            refetchAlbum();
        } catch (error) {
            if(isAxiosError(error)){
                if(error.response?.status === 401){
                    refreshToken(() => handleLikeAlbum())
                }
            }else console.log('like albom error', error)
        }
    }, [id, dispatch, refreshToken])

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
        scrolly, 
        dispatch
    ])

    const heartBtn = useMemo(() => (
        <HeartFilledI active={credentials?.isLiked} onClick={handleLikeAlbum}/>
    ), [credentials?.isLiked, handleLikeAlbum])
    const shuffleBtn = useMemo(() => (
        <ShuffleI active={isShuffle} onClick={() => dispatch(setIsShuffle(!isShuffle))}/>
    ), [isShuffle, dispatch])
    const shareBtn = useMemo(() => (
        <Share onClick={handleCopyLink}/>
    ), [id, handleCopyLink])
    const infoMenu = useMemo(() => (
        <InfoMenu
            id={songId}
            show={openMenu}
            ref={menuContenRef} 
            close={() => setOpenMenu(false)}
        />
    ), [menuContenRef, openMenu, songId, setOpenMenu])
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
                <>
                    {scrolly >= 271 && <div className={styles.name}>{credentials?.title}</div>}
                    <div className={styles.actions}>
                        {shareBtn}
                        {heartBtn}
                    </div>
                </>
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
                        <div className={styles.title}>{t('albom')}</div>
                        <div className={styles.name}>{credentials?.title}</div>
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
                {cover}

            </div>
            <div className={styles.mobile_presentation_wrapper}>

                <div className={styles.content_box}>
                    {cover}

                </div>

                <div className={styles.the_bottom_content}>
                    <div className={styles.top}>
                        <div className={styles.name}>
                            {credentials?.title}
                        </div>
                        <div className={styles.title}>
                            {t('albom')}
                        </div>
                    </div>

                    <div className={styles.bottom}>
                        {playBtn()}
                        {shuffleBtn}
                    </div>
                </div>

            </div>
        </div>

        <SongList 
            ref={lastAlbomRef}
            // @ts-ignore
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
        {isFetching && <span className={styles.loader}><Preloader /></span>}

    </>
  )
}

export default Album