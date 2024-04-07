'use client'
import React, {useMemo, useState, useRef, useCallback, useEffect} from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from 'react-query'
//lib 
import Tab from '@app/_compLibrary/Tab'
import Button from '@app/_compLibrary/Button'
import PrevNext from '@components/icons/prevNext/icon'
//icons
import PlaySm from '@app/_components/icons/play/icon';
import PlayLg from '@app/_components/icons/simplePlay/icon';
import Share from '@app/_components/icons/share/icon';
import Info from '@app/_components/icons/info/icon';
//styles
import styles from './page.module.scss'
import classNames from 'classnames/bind'
//hooks
import { useWindowScrollPositions } from '@hooks/useWindowOffset'
import useClickOutside from '@hooks/useOutClick';
import useWindowSize from '@app/_hooks/useWindowSize'

//redux 
import { GetArtist } from '@app/_api/Queries/Getters'
import { useAppDispatch, useAppSelector } from '@app/_hooks/redux_hooks';
import { setCurrentSong } from '@app/_redux/reducers/MediaReducer'
import { setShowAuthModal } from '@redux/reducers/AuthReducer'

//comps
import StandardCard from '@app/_components/StandardCard/StandardCard'
import SongList from '@app/_components/SongList/SongList'
import InfoMenu from '@app/_components/InfoMenu/InfoMenu'
//api
import { likeArtist, likeSong } from '@app/_api/Queries/Post'
//types
import Songs from '@app/_api/types/queryReturnTypes/Songs'
import { TabMenuTypes } from '@app/_types'
//utils
import { isUndefined, CheckObjOrArrForNull, copyLink, isAuthorized, findIndex } from '@app/_utils/helpers'
//toast 
import toast from 'react-hot-toast'
import authToken, { refreshAccessToken } from '@app/_api/Services/auth_token'
import CheckI from '@app/_components/icons/check/icon'
import FollowCheckI from '@app/_components/icons/followCheck/icon'
import HeartIcon from '@app/_components/icons/heart/icon'
import HeartFilledI from '@app/_components/icons/heartFilled/icon'
import { isAxiosError } from 'axios'

const cn = classNames.bind(styles)
const Artist = ({params}: {params: {each: string}}) => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const searchParam = useSearchParams()
    const searchType = searchParam.get('type')

    //selectors 
    const song = useAppSelector(state => state.mediaReducer.songData)
    const songIndex = useAppSelector(state => state.mediaReducer.songIndex)
    const isSongPlaying = useAppSelector(state => state.mediaReducer.isSongPlaying)

    const headerRef:any = useRef(null)
    const contentRef:any = useRef(null)
    const toggleRef:any = useRef(null)
    const [showMenu, setShowMenu] = useClickOutside(contentRef, toggleRef, 'mousedown')
    const [width] = useWindowSize()

    const [fetchMode, setFetchMode] = useState<'artist' | 'song'>('artist')
    const [dynamicId, setDynamicId] = useState<string>("")
    const [rows, setRows] = useState<Songs['rows']>()

    const tabs: TabMenuTypes[] = [
        {
          route: 'song', label: {
            en: 'Songs', tm: 'Songs', ru:'Songs'
          }
        }, 
        {route: 'playlist', label: {
          en: 'Playlist', tm:'Playlist', ru: 'Playlist'
        }}, 
        {
          route: 'album', label: {
            en: 'Albums', tm:'Albums', ru: 'Albums'
          }
        } 
    ]
    const { scrolly } = useWindowScrollPositions()
    const id = useMemo(() => params.each ,[params.each])

    //queries 
    const {
        data, 
        isLoading, 
        isError, 
        refetch: refetchArtist
    } = useQuery(['GetArtist', id], () => GetArtist(id), {
        refetchOnWindowFocus: false, enabled: !!id
    })
    // console.log('data', data)

    useEffect(() => {
        if(!isLoading && !isError) setRows(data?.data?.songs)
    }, [data])

    useEffect(() => {
        if(!!id) setDynamicId(id)
    }, [id])

    useEffect(() => {
        const opacity = Math.min(1, scrolly / window.innerHeight)
        if(headerRef && headerRef.current)
        headerRef.current?.style?.setProperty(
            '--opacity', opacity
        )
    }, [scrolly, headerRef])

    const refreshToken = (cb: Function) => {
        refreshAccessToken().then(isError => {
            console.log("is error", isError)
            if(isError) router.replace('/login')
            else cb()
        })
    }

    const handleCopyLink = useCallback(() => {
        copyLink(`/artist/${id}${!isUndefined(searchType) ? `?type=${searchType}` : ""}`)?.then((mode) => {
            if(mode === 'desktop') toast.success('Link is copied.')
        })
    }, [id, searchType])

    const handleFollow = useCallback(async () => {
        if(!isAuthorized()) return dispatch(setShowAuthModal(true))

        try {
            const response = await likeArtist(id)
            // console.log('res', response)
            if(response.success){
                toast.success(response.data.message)
                refetchArtist()
            }
        } catch (error) {
            if(isAxiosError(error)){
                if(error.response?.status === 401){
                    refreshToken(() =>  handleFollow())
                }
            }else console.log('follow error', error)
        }
    }, [id])

    const handleLike = useCallback(async(songId: string) => {
        if(!isAuthorized()) return dispatch(setShowAuthModal(true))

        try {
            const response = await likeSong(songId)
            if(response.success && response.statusCode === 200)
            setRows(prev => prev?.map(row => row.id === songId ? {...row, isLiked: !row.isLiked} : row))
          } catch (error) {
            if(isAxiosError(error)){
                if(error.response?.status === 401){
                    refreshToken(() => handleLike(songId))
                }
            }else console.log('like song error', error)
          }
    }, [])

    const handleClick = useCallback(() => {
        if(dynamicId !== id) setDynamicId(id)
        setFetchMode('artist')
        setShowMenu(!showMenu)
    }, [dynamicId, id, showMenu])



    const playBtn = useCallback((topFixed = false) => {
        const currentSongId = song?.[songIndex]?.id
        const rowIndex = findIndex(rows, currentSongId)
        const rowSongId = rows?.[rowIndex!]?.id
        
        // console.log("rowIndex",rowIndex)
        // console.log("currentSongId", currentSongId)
        // console.log("rowSongId", rowSongId)


        const playFN = () => {
            if(CheckObjOrArrForNull(rows)){
                const index = (rowIndex !== -1 && currentSongId === rowSongId) ? rowIndex : 0
                console.log('real index', index)
                dispatch(setCurrentSong({
                    data: rows, index, id: rows?.[index as number]?.id
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

    const showSongs = useMemo(() => searchType === tabs[0].route || isUndefined(searchType),[searchType])
    const showAlbums = useMemo(() => searchType === tabs[2].route,[searchType])
    const isFollowing = useMemo(() => data?.data?.artist?.following ?? false,[data?.data?.artist])
    const infoToggler = useMemo(() => {
        return <Info onClick={handleClick}/>
    }, [])
    const followBtn = useMemo(() => (
        <Button startIcon={isFollowing ? <FollowCheckI /> : <></>} color={isFollowing ? 'lightDark' : 'light'} roundedSm className={styles.followBtn} onClick={handleFollow}>
            {isFollowing ? 'Following' : 'Follow'}
        </Button>
    ),[isFollowing, handleFollow])
    const shareBtn = useMemo(() => (
        <Share onClick={handleCopyLink}/>
    ), [id, searchType])
    const infoMenu = useMemo(() => (
        <InfoMenu 
            show={showMenu} 
            close={() => setShowMenu(false)} 
            ref={contentRef}
            id={dynamicId}
            fetchMode={fetchMode}
        />
    ), [    
        showMenu, 
        contentRef, 
        dynamicId,
        fetchMode
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
            <div className={styles.actions}>
                {infoToggler}
                {shareBtn}
            </div>
        </div>

        <div className={styles.presentation}>
            <div className={styles.background_gradient}></div>
            <div className={styles.background_image}>
                <Image src={data?.data?.artist?.cover!} alt='artist' width='400' height='400'/>
            </div>
            <div className={styles.wrapper}>

                <div className={styles.content_box}>
                    <Image src={data?.data?.artist?.cover!} alt='artist' width='400' height='400'/>
                    <div className={styles.artist}>
                        <div className={styles.title}>Artist</div>
                        <div className={styles.name}>{data?.data?.artist?.title}</div>
                    </div>
                </div>

                <div className={styles.actions}>
                    {playBtn()}  
                    {followBtn}
                    {shareBtn}
                    {infoToggler}
                </div>

            </div>

        </div>


        <div className={styles.presentation_mobile}>
            <div className={styles.background_gradient}></div>
            <div className={styles.background_image}>
                <Image src={data?.data?.artist?.cover!} alt='artist' width='400' height='400'/>
            </div>
            <div className={styles.mobile_presentation_wrapper}>

                <div className={styles.content_box}>
                    <Image src={data?.data?.artist?.cover!} alt='artist' width='400' height='400'/>
                </div>

                <div className={styles.the_bottom_content}>
                    <div className={styles.top}>
                        <div className={styles.name}>
                            {data?.data?.artist?.title}
                        </div>
                        <div className={styles.title}>
                            Artist
                        </div>
                    </div>

                    <div className={styles.bottom}>
                        {playBtn()}  
                        {followBtn}
                    </div>
                </div>

            </div>
        </div>



        <Tab 
        baseUrl={`artist/${id}`}
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
            data={rows}
            artistId={data?.data?.artist.id}
            fetchStatuses={{
                isLoading, isError
            }}
            className={styles.songList}
            onShowInfo={(id) => {
                setDynamicId(id)
                setFetchMode('song')
                setShowMenu(true)
            }}
            onLike={handleLike}
            onPlay={(index) => dispatch(setCurrentSong({data: rows, index, id: rows![index]?.id}))}
        />
       </div>

       <div className={cn({
            section: true,
            show: showAlbums
       })}>
          
          <div className={styles.grid_wrapper}>
            {
                data?.data?.alboms?.map((item, i) => (
                    <StandardCard 
                        key={i}
                        id={item.id}
                        albomId={item.id}
                        title={item.title}
                        image={item.cover}
                        hideMoreI
                        alboms
                    />              
                ))
            }
          </div>

       </div>
    </>
  )
}

export default Artist