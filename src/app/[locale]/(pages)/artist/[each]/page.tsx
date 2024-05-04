'use client'
import React, {useMemo, useState, useRef, useCallback, useEffect} from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery, useInfiniteQuery } from 'react-query'
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
import { refreshAccessToken } from '@app/_api/Services/auth_token'
import FollowCheckI from '@app/_components/icons/followCheck/icon'
import { isAxiosError } from 'axios'
import useObserve from '@app/_hooks/useObserve'
import Albums from '@app/_api/types/queryReturnTypes/Albums'
import Video from '@app/_api/types/queryReturnTypes/Video'
import Bottomsheet from '@app/_components/Bottomsheet/Bottomsheet'
import ShareSmI from '@app/_components/icons/shareSm/icon'
import TopNavbar from '@app/_components/TopNavbar/TopNavbar'
import Preloader from '@app/_compLibrary/Preloader'

type Affixes = 'song' | 'clip' | 'albom' | 'artist'

const cn = classNames.bind(styles)
const Artist = ({params}: {params: {each: string}}) => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const searchParam = useSearchParams()
    const tab = searchParam.get('tab')
    const tabs: TabMenuTypes[] = [
        {
          route: 'song', label: {
            tk: 'Songs', ru:'Songs'
          }
        }, 
        {route: 'clip', label: {
            tk:'Clips', ru: 'Clips'
        }}, 
        {
          route: 'albom', label: {
           tk:'Albums', ru: 'Albums'
          }
        }
    ]

    const artistId = useMemo(() => params.each ,[params.each])
    const showSongs = useMemo(() => tab === tabs[0].route || isUndefined(tab),[tab])
    const showClips = useMemo(() => tab === tabs[1].route, [tab])
    const showAlbums = useMemo(() => tab === tabs[2].route,[tab])
    const [shareId, setShareId] = useState<string>("")

    //selectors 
    const song = useAppSelector(state => state.mediaReducer.songData)
    const songIndex = useAppSelector(state => state.mediaReducer.songIndex)
    const isSongPlaying = useAppSelector(state => state.mediaReducer.isSongPlaying)

    const songsObserver = useRef<IntersectionObserver>();
    const albomsObserver = useRef<IntersectionObserver>();

    const headerRef:any = useRef(null)
    const contentRef:any = useRef(null)
    const toggleRef:any = useRef(null)
    const [showMenu, setShowMenu] = useClickOutside(contentRef, toggleRef, 'mousedown')
    const [width] = useWindowSize()

    const [showBottomSheet, setShowBottomSheet] = useState<boolean>(false)
    const [fetchMode, setFetchMode] = useState<'artist' | 'song'>('artist')
    const [dynamicId, setDynamicId] = useState<string>("")
    const [rows, setRows] = useState<Songs['rows']>([])
    const [alboms, setAlboms] = useState<Albums['data']['rows']>([])
    const [clips, setClips] = useState<Video[]>([])

    const { scrolly } = useWindowScrollPositions()

    const {
        data: songsData, 
        hasNextPage, 
        isFetching, 
        isRefetching, 
        isError, 
        isLoading,
        fetchNextPage, 
        refetch: refetchArtist
    } = useInfiniteQuery({
        queryKey: ['GetArtist', artistId], 
        queryFn: ({pageParam}) => GetArtist(artistId, pageParam), 
        getNextPageParam: (lastPage, allPages) => {
            if(lastPage.data?.songs?.length < 10) return 
            return allPages.length + 1
            // return lastPage.data.songs ? allPages.length + 1 : undefined; 
        }, 
        enabled: !!artistId
    })
    const lastSongRef = useObserve({
        observer: songsObserver, 
        hasNextPage, isFetching, 
        isLoading, fetchNextPage, 
    })
    const dataList = useMemo(():any => {
        const getList = (type: 'songs' | 'alboms' | 'clips') => {
            // @ts-ignore
            return songsData?.pages.reduce((acc, page) => {
                return [...acc, ...page.data[type]];
            }, [])
        }
        if(showSongs) return getList('songs')
        else if(showAlbums) return getList('alboms')
        else if(showClips) return getList('clips')
    }, [songsData,showSongs, showAlbums, showClips]);
    const credentials = useMemo(() => {
        if(CheckObjOrArrForNull(songsData)){
            const pagesData = songsData?.pages?.[0]?.data
            const obj = {
                cover: pagesData?.artist?.cover, 
                count: pagesData?.artist?.count, 
                isFollowing: pagesData?.artist?.following, 
                title: pagesData?.artist?.title
            }
            return obj
        }
    }, [songsData])
    
    useEffect(() => {
        if(CheckObjOrArrForNull(dataList)){
            if(showSongs) setRows(dataList)
            else if(showAlbums) setAlboms(dataList)
            else if(showClips) setClips(dataList)
        }
    }, [dataList, showSongs, showAlbums, showClips])
    
    useEffect(() => {
        if(!!artistId) setDynamicId(artistId)
    }, [artistId])

    useEffect(() => {
        const opacity = Math.min(1, scrolly / window.innerHeight)
        if(headerRef && headerRef.current)
        headerRef.current?.style?.setProperty(
            '--opacity', opacity
        )
    }, [scrolly, headerRef])

    const refreshToken = (cb: Function) => {
        refreshAccessToken().then(isError => {
            if(isError) router.replace('/login')
            else cb()
        })
    }

    const handleCopyLink = useCallback((affix: Affixes, id: string) => {
        const isArtist = affix === 'artist'
        const isClip = affix === 'clip'
        const isAlbom = affix === 'albom'
        const url = `${isClip ? '/all/clip' : `/${affix}`}/${isArtist ? artistId : id}${!isClip && !isAlbom && !isUndefined(tab) ? `?tab=${tab}` : ""}`
        console.log('url', url)
        copyLink(url)?.then((mode) => {
            if(mode === 'desktop') toast.success('Link is copied.')
            setShareId("")      
        })
    }, [artistId, tab])

    const handleFollow = useCallback(async () => {
        if(!isAuthorized()) return dispatch(setShowAuthModal(true))

        try {
            const response = await likeArtist(artistId)
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
    }, [artistId])

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
        if(dynamicId !== artistId) setDynamicId(artistId)
        setFetchMode('artist')
        setShowMenu(!showMenu)
    }, [dynamicId, artistId, showMenu])

    const playBtn = useCallback((topFixed = false) => {
        const currentSongId = song?.[songIndex]?.id
        const rowIndex = findIndex(rows, currentSongId)
        const rowSongId = rows?.[rowIndex!]?.id

        const playFN = () => {
            if(CheckObjOrArrForNull(rows)){
                const index = (rowIndex !== -1 && currentSongId === rowSongId) ? rowIndex : 0
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

    const isFollowing = useMemo(() => credentials?.isFollowing ?? false,[credentials?.isFollowing])
    const infoToggler = useMemo(() => {
        return <Info onClick={handleClick}/>
    }, [])
    const followBtn = useMemo(() => (
        <Button startIcon={isFollowing ? <FollowCheckI /> : <></>} color={isFollowing ? 'lightDark' : 'light'} roundedSm className={styles.followBtn} onClick={handleFollow}>
            {isFollowing ? 'Following' : 'Follow'}
        </Button>
    ),[isFollowing, handleFollow])
    const shareBtn = useMemo(() => (
        <Share onClick={() => handleCopyLink('artist', artistId)}/>
    ), [artistId, tab])
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
    const cover = useMemo(() => (
        <Image src={credentials?.cover ?? ""} alt='artist' width='400' height='400'/>
    ), [credentials?.cover])

    const actionsData = [
        {
            value: 'share', 
            label: {ru: 'Paylasmak', tk: 'Paylasmak'}, 
            icon: <ShareSmI />
        }
    ]

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
                        {infoToggler}
                        {shareBtn}
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
                        <div className={styles.title}>Artist</div>
                        <div className={styles.name}>{credentials?.title}</div>
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
            baseUrl={`artist/${artistId}`}
            tabs={tabs}
            pathname={tab}
            scrollYPosition={271}
            fixed
        />
        {
            showSongs && 
            <>
                <SongList 
                    ref={lastSongRef}
                    data={rows}
                    artistId={artistId}
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
                {isFetching && <span className={styles.loader}><Preloader /></span>}
            </>

        }
        {
            showAlbums && 
            <div className={styles.grid_wrapper}>
                {
                    alboms?.map((albom, i) => (
                        <StandardCard 
                            key={i}
                            id={albom.id}
                            albomId={albom.id}
                            title={albom.title}
                            image={albom.cover}
                            alboms
                            onShare={() => 
                                handleCopyLink('albom', albom.id)
                            }
                        />              
                    ))
                }
            </div>
        }
        {
            showClips && 
            <div className={styles.clips_wrapper}>
                {
                    clips?.map((clip) => (
                        <StandardCard 
                            key={clip.id}
                            id={clip.id}
                            videoId={clip.id}
                            title={clip.title}
                            image={clip.cover}
                            videoCard
                            videoDuration={clip.duration}
                            onOpenBottomSheet={() => setShowBottomSheet(true)}
                            onShare={() => {
                                handleCopyLink('clip', clip.id)
                            }}
                        />              
                    ))
                }
            </div>
        }

        <Bottomsheet 
            actionsData={actionsData}
            open={showBottomSheet}
            close={() => setShowBottomSheet(false)}
        />
    </>
  )
}

export default Artist