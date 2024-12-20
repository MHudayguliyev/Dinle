'use client';
import React, {useCallback, useEffect, useMemo, useState, useRef} from 'react'
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useInfiniteQuery, useQuery } from 'react-query';

// lib
import Input from '@app/_compLibrary/Input'
import Button from '@app/_compLibrary/Button'
import Tab from '@app/_compLibrary/Tab';
//comp
import StandardCard from '@app/_components/StandardCard/StandardCard';
import SongList from '@app/_components/SongList/SongList';
import SearchModal from '@app/_components/Modals/SearchModal/SearchModal';
//styles
import classNames from 'classnames/bind';
import styles from './page.module.scss'
// images/icons
import SearchI from '@components/icons/search/icon';
import notFound from '@app/_assets/icons/not_found.svg';
import PrevNext from '@components/icons/prevNext/icon'
import ShazamI from '@app/_components/icons/shazam/icon';

//utils
import { CheckObjOrArrForNull, copyLink, delay, isAuthorized, isEmpty, isUndefined, parse } from '@app/_utils/helpers';
import { getFromStorage, setToStorage } from '@app/_utils/storage';
import { stringify } from '@utils/helpers';
//api/types
import SearchType from '@app/_api/types/queryReturnTypes/Search';
import { likeSong, searchSong } from '@app/_api/Queries/Post';
import { GetAlbums, GetArtists, GetGenres, GetPlaylists } from '@app/_api/Queries/Getters';
import { TabMenuTypes } from '@app/_types';
//redux
import { useAppDispatch } from '@app/_hooks/redux_hooks';
import { setCurrentSong } from '@app/_redux/reducers/MediaReducer';
//hooks
import useClickOutside from '@app/_hooks/useOutClick';
import useWindowSize from '@app/_hooks/useWindowSize';
//icons 
import RecentSearchArrowI from '@app/_components/icons/recentSearchArrow/icon';

// import Swiper JS
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
//swiper breakpoints 
import { standardCardBreaksPoints } from '@app/_assets/json_data/swiper_breakpoints';
import ArtistsList from '@app/_components/ArtistsList/ArtistsList';
import Artists from '@app/_api/types/queryReturnTypes/Artists';
import useObserve from '@app/_hooks/useObserve';
import Playlists from '@app/_api/types/queryReturnTypes/Playlists';
import Albums from '@app/_api/types/queryReturnTypes/Albums';
import CustomLink from '@app/_components/CustomLink/CustomLink';
import ArrowRightLgI from '@app/_components/icons/ArrowRightLg/icon';
import InfoMenu from '@app/_components/InfoMenu/InfoMenu';
import { setShowAuthModal } from '@app/_redux/reducers/AuthReducer';
import { isAxiosError } from 'axios';
import { refreshAccessToken } from '@app/_api/Services/auth_token';
//translations
import { useTranslations } from 'next-intl';
import toast from 'react-hot-toast';
import Bottomsheet from '@app/_components/Bottomsheet/Bottomsheet';
import ShareSmI from '@app/_components/icons/shareSm/icon';

const cn = classNames.bind(styles)
const Search = () => {
  //refs
  const artistsObserver = useRef<IntersectionObserver>();
  const playlistsObserver = useRef<IntersectionObserver>();
  const albomsObserver = useRef<IntersectionObserver>();

  const inputRef:any = useRef(null)
  const dropdownRef:any = useRef<HTMLDivElement>(null)
  const dropdownToggleRef:any = useRef(null)
  const [openRecents, setOpenRecents] = useClickOutside(dropdownRef, dropdownToggleRef, 'mousedown')
  const [width] = useWindowSize()

  const t = useTranslations('tabs')
  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParam = useSearchParams()
  const tab = searchParam.get('tab')
  const mask = searchParam.get('mask')
  const all = searchParam.get('all')
  const songId =  searchParam.get('songId')
  const artistId =  searchParam.get('artistId')


  const tabs: TabMenuTypes[] = [
    {
      route: 'artist', label: {
        tm:'Artist', ru: 'Артисты'
      }
    },
    {route: 'playlist', label: {
      tm:'Plaýlist', ru: 'Плейлисты'
    }}, 
    {route: 'albom', label: {
      tm:'Albom', ru: 'Альбомы'
    }}, 
    {
      route: 'genre', label: {
        tm:'Genre', ru: 'Жанры'
      }
    }
  ]

  //states
  const delayTime = 200;
  const [dynamicSongId, setDynamicSongId] = useState<string>("")
  const [searchValue, setSearchValue] = useState<string>(mask ?? "")
  const [showInfo, setShowInfo] = useState<boolean>(false)
  const [showBottomSheet, setShowBottomSheet] = useState<boolean>(false)

  const [openShazam, setOpenShazam] = useState<boolean>(false)
  const [isSearchDataLoading, setSearchDataLoading] = useState<boolean>(false)
  const [albumsSearch, setAlbums] = useState<SearchType['data']['alboms']>([])
  const [songsSearch, setSongs] = useState<SearchType['data']['songs']>([])
  const [artistsSearch, setArtists] = useState<SearchType['data']['artists']>([])
  const [clipsSearch, setClips] = useState<SearchType['data']['clips']>([])
  const [playlistsSearch, setPlaylists] = useState<SearchType['data']['playlists']>([])
  const [recentSearchData, setRecentSearchData] = useState<{title: string}[]>([])
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(0)
  const [isLoading, setLoading] = useState({
    artists: false, 
    alboms: false, 
    playlists: false, 
    genres: false
  })
  const [openBs, setOpenBs] = useState<boolean>(false)
  const [bsSongId, setBsSongId] = useState<string>("")

  const showFoundData = useMemo(() => isUndefined(tab) && (!isUndefined(mask) && !isEmpty(mask)),[tab, mask])
  const showArtists = useMemo(() => tab === tabs[0]?.route ,[tab, tabs])
  const showPlaylists = useMemo(() => tab === tabs[1]?.route,[tab, tabs])
  const showAlbums = useMemo(() => tab === tabs[2]?.route,[tab, tabs])
  const showGenres = useMemo(() =>tab === tabs[3]?.route,[tab, tabs])
  const isViewAll = useMemo(() => !isUndefined(all) && !isEmpty(all),[all])

  const goSearch = useCallback(async () => {
    const localSearches = parse(getFromStorage('recentSearchData')!)
    if(CheckObjOrArrForNull(localSearches)){
      let sameFound = false
      for(let i = 0; i < localSearches?.length; i++){
        const search:string = localSearches[i].title.toLowerCase()
        if(search.includes(searchValue?.trim()?.toLowerCase())) {
          sameFound = true
          break;
        }
      }

      if(!sameFound){
        if(localSearches.length >= 5) localSearches.pop()
        localSearches.unshift({title: searchValue?.trim()})
        setToStorage('recentSearchData', stringify(localSearches))
        setRecentSearchData(localSearches)
      }

    }  else {
      const newSearchData = new Array()
      newSearchData.push({title: searchValue?.trim()})
      setToStorage('recentSearchData', stringify(newSearchData))
      setRecentSearchData(newSearchData)
    }

    try {
      interface DataToSend {
        search: string;
        type?: string
      }
      let dataToSend: DataToSend = {
        search: searchValue,
      };

      if(!isViewAll){
        router.push(`/search?mask=${searchValue}`, { scroll: false })
      }else {
        dataToSend = {...dataToSend, type: all as string}
      }

      setSearchDataLoading(true)
      setAlbums([])
      setArtists([])
      setSongs([])
      setPlaylists([])

      const response = await searchSong(dataToSend)
      if(response.statusCode === 200){
        const {
          alboms, 
          songs, 
          artists, 
          playlists, 
          clips
        } = response.data
        
        delay(delayTime).then(() => {
          setAlbums(alboms)
          setArtists(artists)
          setSongs(songs)
          setPlaylists(playlists)
          setClips(clips)
          setSearchDataLoading(false)
        })

      }

    } catch (error) {
      // console.log('search error', error)
      setAlbums([])
      setArtists([])
      setSongs([])
      setPlaylists([])
      setClips([])
      setSearchDataLoading(false)
    }
  }, [searchValue, isViewAll])

  //queries
  const {
    data:artistsData, 
    hasNextPage: hasArtistNextPage, 
    isFetching: isFetchingArtists, 
    isError: isArtistsError, 
    isLoading: isArtistsLoading,
    fetchNextPage: fetchArtistNextPage, 
  } = useInfiniteQuery({
    queryKey: ['Artists', showArtists, isLoading.artists], 
    queryFn: ({pageParam}) => GetArtists(pageParam), 
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data.rows.length ? allPages.length + 1 : undefined;
    }, 
    enabled: showArtists || isLoading.artists
  })
  const {
    data: playlistsData, 
    hasNextPage: hasPlaylistNextPage, 
    isFetching: isFetchingPlaylists, 
    isError: isPlaylistsError, 
    isLoading: isPlaylistsLoading,
    fetchNextPage: fetchPlaylistNextPage, 
  } = useInfiniteQuery({
    queryKey: ['Playlists', showPlaylists, isLoading.playlists], 
    queryFn: ({pageParam}) => GetPlaylists(20, pageParam), 
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data.rows.length ? allPages.length + 1 : undefined;
    }, 
    enabled: showPlaylists || isLoading.playlists
  })
  const {
    data: albomsData, 
    hasNextPage: hasAlbomNextPage, 
    isFetching: isFetchingAlboms, 
    isError: isAlbomsError, 
    isLoading: isAlbomsLoading,
    fetchNextPage: fetchAlbomNextPage, 
  } = useInfiniteQuery({
    queryKey: ['Alboms', showAlbums], 
    queryFn: ({pageParam}) => GetAlbums({ page: pageParam }), 
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data.rows.length ? allPages.length + 1 : undefined;
    }, 
    enabled: showAlbums
  })
  const {
    data: genresData,
    isError: isGenresError, 
    isLoading: isGenresLoading,
  } = useQuery(['Genres', showGenres, songId, artistId, isLoading.genres], () => GetGenres({
    id: songId ? songId : artistId ? artistId : undefined,
    mode: songId ? 'song' : artistId ? 'artist' : undefined
  }),{
    refetchOnWindowFocus: false, enabled: showGenres || isLoading.genres
  })

  //last element refs
  const lastArtistRef = useObserve({
    observer: artistsObserver, 
    hasNextPage: hasArtistNextPage, 
    isFetching: isFetchingArtists, 
    isLoading: isArtistsLoading, 
    fetchNextPage: fetchArtistNextPage, 
  })
  const lastPlaylistRef = useObserve({
    observer: playlistsObserver, 
    hasNextPage: hasPlaylistNextPage, 
    isFetching: isFetchingPlaylists, 
    isLoading: isPlaylistsLoading, 
    fetchNextPage: fetchPlaylistNextPage, 
  })
  const lasAlbomRef = useObserve({
    observer: albomsObserver, 
    hasNextPage: hasAlbomNextPage, 
    isFetching: isFetchingAlboms, 
    isLoading: isAlbomsLoading, 
    fetchNextPage: fetchAlbomNextPage, 
  })
  const refetchData = useCallback(() => {
    if(showArtists) {
      setLoading(() => ({ genres: false, alboms: false, artists: true, playlists: false }))
    }else if(showPlaylists){
      setLoading(() => ({ genres: false, alboms: false, artists: false, playlists: true}))
    }else if(showAlbums){
      setLoading(() => ({ genres: false, alboms: true, artists: false, playlists: false}))
    }else if(showGenres){
      setLoading(() => ({ genres: true, alboms: false, artists: false, playlists: false}))
    }
  }, [
    showArtists, 
    showPlaylists, 
    showAlbums, 
    showGenres
  ])

  //lists
  const artistsList = useMemo((): Artists['data']['rows'] => {
    delay(delayTime).then(() => {
      setLoading(prevState => ({...prevState, artists: false}))
    })
    // @ts-ignore
    return artistsData?.pages.reduce((acc, page) => {
      return [...acc, ...page.data.rows];
    }, [])
  }, [artistsData]);
  const playlistsList = useMemo((): Playlists['data']['rows'] => {
    delay(delayTime).then(() => {
      setLoading(prevState => ({...prevState, playlists: false}))
    })
    // @ts-ignore
    return playlistsData?.pages.reduce((acc, page) => {
      return [...acc, ...page.data.rows];
    }, [])
  }, [playlistsData]);
  const albomsList = useMemo((): Albums['data']['rows'] => {
    delay(delayTime).then(() => {
      setLoading(prevState => ({...prevState, alboms: false}))
    })
    // @ts-ignore
    return albomsData?.pages.reduce((acc, page) => {
      return [...acc, ...page.data.rows];
    }, [])
  }, [albomsData]);

  useEffect(() => {
    if(showGenres && (!isGenresLoading && !isGenresError) && isLoading.genres){
      delay(delayTime).then(() => {
        setLoading(prevState => ({...prevState, genres: false}))
      })
    }
  }, [
    isGenresLoading, 
    isGenresError, 
    showGenres, 
    isLoading.genres
  ])
  const errorDiv = useMemo(() => {
    return (
      <div className={styles.error_container}>
        <Image src={notFound} alt='not found'/>
        <div className={styles.error_txt}>
            Gynansakda tapylmady...
        </div>
        <p className={styles.helper_txt}>
          Artistler, aýdymlar, videolar w.b
        </p>
        <Button color='lightDark' roundedSm onClick={refetchData}>
          Refresh
        </Button>
      </div>
    )
  }, [refetchData])
  const loader = useCallback((type: 'artist' | 'playlist' | 'album' | 'genre' | 'clip', swiperMode = false) => {
    const arr = [1,2,3,4,5,6];
    const renderArtists = type === 'artist'
    const renderPlaylists = type === 'playlist'
    const renderAlboms = type === 'album'
    const renderGenres= type === 'genre'
    const renderClips = type === 'clip'

    return (
      <div className={styles.recomendations}>
        <span className={styles.topShimmer}></span>
        {
          swiperMode ? (
            <Swiper
              navigation
              modules={[ Navigation ]}
              slidesPerView={6}
              spaceBetween={15}
              breakpoints={standardCardBreaksPoints}
            >
              {
                arr.map(item => (
                <SwiperSlide key={item}>
                  <StandardCard 
                    key={item}
                    id=""
                    title=""
                    shimmer
                    artists={renderArtists}
                    playlists={renderPlaylists}
                    alboms={renderAlboms}
                    genres={renderGenres}
                  />
                </SwiperSlide>
                ))
              }
            </Swiper>
          ) : (
            <div className={styles.grid_wrapper}>
              {
                arr.map(item => (
                  <StandardCard 
                    key={item}
                    id=""
                    title=""
                    shimmer
                    artists={renderArtists}
                    playlists={renderPlaylists}
                    alboms={renderAlboms}
                    genres={renderGenres}
                    videoCard={renderClips}
                  />
                ))
              }
            </div>
          )
        }

      </div>
    )
  }, [])
  const arrowRight = useMemo(() => (
    <ArrowRightLgI />
  ), [])


  useEffect(() => {
    if(isUndefined(tab) && (isUndefined(mask) || isEmpty(mask))) {
      router.push(`/search?tab=${tabs[3].route}`)
    }
    else if(!isUndefined(mask) && !isEmpty(mask)) goSearch()
    setRecentSearchData(parse(getFromStorage('recentSearchData')!) ?? [])
  }, [mask, router, tab])

  useEffect(() => {
    if(isViewAll)
    goSearch()
  }, [isViewAll])

  useEffect(() => {
    const localSearches = parse(getFromStorage('recentSearchData')!)
    if(!isEmpty(searchValue)){
      const searchValueTrimmed = searchValue?.trim()?.toLowerCase()
      const filtered = localSearches?.filter((searchData:any) => searchData.title?.toLowerCase().includes(searchValueTrimmed))
      setRecentSearchData(filtered)
      if(CheckObjOrArrForNull(filtered)) setOpenRecents(true)

      
    }else setRecentSearchData(localSearches)


    if(isEmpty(searchValue) && isViewAll) {
      router.push(`/search?tab=${tabs[3].route}`)
    }

  }, [searchValue, isViewAll])

  useEffect(() => {
    if(!CheckObjOrArrForNull(recentSearchData) && openRecents) setOpenRecents(false)
  }, [recentSearchData])


  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const isFocused = inputRef?.current?.focus

      if(e.key === 'ArrowUp'){
        if(activeSuggestionIndex === 0 ) setActiveSuggestionIndex(recentSearchData?.length - 1);
        else setActiveSuggestionIndex(activeSuggestionIndex - 1)
        inputRef?.current?.blur()
      }else if(e.key === 'ArrowDown'){
        if(activeSuggestionIndex === recentSearchData?.length - 1) setActiveSuggestionIndex(0);
        else setActiveSuggestionIndex(activeSuggestionIndex + 1)
        inputRef?.current?.blur()
      }else if(e.key === 'Enter' && !isFocused){  
        setSearchValue(recentSearchData[activeSuggestionIndex]?.title)
        setOpenRecents(false)
        inputRef?.current?.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [activeSuggestionIndex, recentSearchData, inputRef])

  useEffect(() => {
    if(
      (showArtists || showPlaylists || showAlbums || showGenres) && 
      !isEmpty(searchValue)
      ) 
    setSearchValue("")
  }, [
    showArtists, 
    showPlaylists, 
    showAlbums, 
    showGenres, 
  ])

  const handleKeyDown = useCallback((e: any) => {
    if(e.keyCode === 13){
      if(isEmpty(searchValue)){
        router.push(`search?tab=${tabs[3].route}`)
      }else {
        goSearch()
      } 
    }else if(e.keyCode === 32) e.stopPropagation()
  }, [router, searchValue])

  const searchOnIClick = useCallback(() => {
    if(isEmpty(searchValue)){
      router.push(`search?tab=${tabs[3].route}`)
    }else {
      goSearch()
    }
  }, [router, searchValue])

  const openRecentBoxFN = useCallback(() => {
    if(CheckObjOrArrForNull(recentSearchData) && !openRecents) setOpenRecents(true)
  }, [recentSearchData, openRecents])

  const refreshToken = useCallback((cb: Function) => {
    refreshAccessToken().then(isError => {
        if(isError) router.replace('/login')
        else cb()
    })
  }, [])

  const handleLike = useCallback(async(songId: string) => {
    if(!isAuthorized()) return dispatch(setShowAuthModal(true))

    try {
        const response = await likeSong(songId)
        if(response.success && response.statusCode === 200)
        setSongs(prev => prev?.map(row => row.id === songId ? {...row, isLiked: !row.isLiked} : row))
      } catch (error) {
        if(isAxiosError(error)){
            if(error.response?.status === 401){
              refreshToken(() => handleLike(songId))
            }
        }else console.log('like song error', error)
      }
}, [])


  useEffect(() => {
    if(!isViewAll && showFoundData){
      goSearch()
    }
  }, [isViewAll, showFoundData])
  

  const infoMenu = useMemo(() => (
    <InfoMenu 
      id={dynamicSongId}
      show={showInfo}
      close={() => setShowInfo(false)}
    />
  ), [dynamicSongId, showInfo, setShowInfo])

  const handleShare = (clipId: string) => {
    copyLink(`/all/clip/${clipId}`)?.then((mode) => {
      if(mode === 'desktop') toast.success('Link is copied.')
      if(openBs) {
        setBsSongId("")
        setOpenBs(false)
      }
    })
  }

  const actionsData = [
    {
      value: 'share', 
      label: {ru: 'Paylasmak', tm: 'Paylasmak'}, 
      icon: <ShareSmI />
    }
  ]

  return (
    <>
    <SearchModal 
      show={openShazam}
      close={() => setOpenShazam(false)}
    />
    {infoMenu}
    
      <div className={styles.search_wrapper}>

        <div className={styles.search__actions}>
          <PrevNext  mode='prev'/>
          <PrevNext  mode='next'/>
          <div className={styles.input__container}>
            <Input
              ref={inputRef}
              type='search'
              fontSize='medium' 
              fontWeight='medium'
              rounded
              leftIcon={<SearchI />}
              removeDefaultWidth
              className={styles.inputField}
              value={searchValue}
              onChange={e => 
                setSearchValue(e.target.value)
              }
              rightIcon={<ShazamI />}
              hideEndIcon={!isEmpty(searchValue)}
              onLeftClick={searchOnIClick}
              onRightClick={() => setOpenShazam(true)}
              onKeyDown={handleKeyDown}
              onFocus={openRecentBoxFN}
            />

            <div ref={dropdownRef} className={cn({
              recent_search_wrapper: true, 
              openRecents: openRecents
            })}>
              {
                recentSearchData?.map((searchData, i) => (
                  <div className={cn({
                    searchData: true, 
                    active: activeSuggestionIndex === i, 
                    borderTopRadius: i === 0, 
                    borderBottomRadius: i === recentSearchData.length - 1
                  })} key={i} onClick={() => {
                    setSearchValue(searchData.title)
                    inputRef?.current?.focus()
                  }}>
                    <span>{searchData.title}</span>
                    <RecentSearchArrowI />
                  </div>
                ))
              }
            </div>
          </div>
        </div>

        <Tab 
          baseUrl='search'
          searchMenu
          tabs={tabs}
          pathname={tab}
          fixedTopNull
          scrollYPosition={73}
        />

      </div>

        {
          showArtists && (
            isArtistsLoading || isLoading.artists ?  loader('artist') :  
              isArtistsError ? errorDiv : 
              <div className={styles.recomendations}>
                <h3 className={styles.songCardTitle}>{t('artist')}</h3>
                  <div className={styles.grid_wrapper}>
                    {
                      artistsList?.map((artist:any) => (
                        <StandardCard
                          ref={lastArtistRef}
                          key={artist.id}
                          id={artist.id}
                          artistId={artist.id}
                          artists
                          title={artist.title}
                          image={artist.cover}
                        />
                      ))
                    }
                  </div> 
              </div>
          )
        }

        {
          showPlaylists && (
            isPlaylistsLoading || isLoading.playlists ?  loader('playlist') :  
            isPlaylistsError ? errorDiv : 
              <div className={styles.recomendations}>
                <h3 className={styles.songCardTitle}>{t('playlist')}</h3>
                <div className={styles.grid_wrapper}>
                  {
                    playlistsList?.map(playlist => (
                      <StandardCard 
                        ref={lastPlaylistRef}
                        key={playlist.id}
                        id={playlist.id}
                        playlistId={playlist.id}
                        title={playlist.title}
                        image={playlist.cover}
                        playlists
                        hideMoreI
                      />
                    ))
                  }
                </div>
              </div>
          )
        }

        {
          showAlbums && (
            isAlbomsLoading || isLoading.alboms ?  loader('album') :  
            isAlbomsError ? errorDiv : 
              <div className={styles.recomendations}>
                <h3 className={styles.songCardTitle}>{t('albom')}</h3>
                <div className={styles.grid_wrapper}>
                  {
                    albomsList?.map(album => (
                      <StandardCard 
                        ref={lasAlbomRef}
                        key={album.id}
                        id={album.id}
                        albomId={album.id}
                        title={album.title}
                        image={album.cover}
                        alboms
                        hideMoreI
                      />
                    ))
                  }
                </div>
              </div>
          )
        }

        {
          showGenres && (
            isGenresLoading || isLoading.genres ?  loader('genre') :  
            isGenresError ? errorDiv : 
              <div className={styles.recomendations}>
                <h3 className={styles.songCardTitle}>{t('genre')}</h3>
                <div className={styles.grid_wrapper}>
                  {
                    genresData?.data.map(genre => (
                      <StandardCard 
                        key={genre.genreId}
                        id={genre.genreId}
                        genreId={genre.genreId}
                        title={genre.name}
                        image={genre.cover}
                        genres
                      />
                    ))
                  }
                </div>
              </div>
          )
        }

        {
          showFoundData && CheckObjOrArrForNull(songsSearch) && (
            <div className={styles.recomendations}>
              <div className={styles.songCardTitle}>
                <CustomLink href={`/search?mask=${searchValue}&all=songs`}>
                  <h3>{t('song')}</h3>
                  {
                    isViewAll ? "" : arrowRight
                  }
                </CustomLink>
              </div>
              <SongList 
                data={songsSearch} 
                onLike={handleLike}
                
                onShowInfo={(id) => {
                  setDynamicSongId(id)
                  setShowInfo(true)
                }}
                onPlay={(index) => dispatch(setCurrentSong({data: songsSearch, index, id: songsSearch[index]?.id}))}
                fetchStatuses={{
                  isLoading: false, isError: false
                }}
              />
            </div>
          )
        }

      {
        showFoundData && (
          isSearchDataLoading ? loader('artist', true) : CheckObjOrArrForNull(artistsSearch) ? (
            <div className={styles.recomendations}>
              <div className={styles.songCardTitle}>
                <CustomLink href={`/search?mask=${searchValue}&all=artists`}>
                  <h3>{t('artist')}</h3>
                  {
                    isViewAll ? "" : arrowRight
                  }
                </CustomLink>
              </div>
                {
                  width >=768 ? 
                  <Swiper
                    navigation
                    modules={[ Navigation ]}
                    slidesPerView={6}
                    spaceBetween={2}
                    breakpoints={standardCardBreaksPoints}
                  >
                    {
                        artistsSearch?.map(artist => (
                          <SwiperSlide key={artist.id}>
                          <StandardCard 
                            id={artist.id}
                            artistId={artist.id}
                            title={artist.title}
                            image={artist.cover}
                            artists
                          />
                          </SwiperSlide>
                        ))
                      }
                  </Swiper> : 
                  <div>
                    {artistsSearch?.map(artist => (
                      <ArtistsList 
                        key={artist.id}
                        id={artist.id}
                        image={artist.cover}
                        name={artist.title}
                      />
                    ))}
                  </div>
                }
            </div>
        ) : ""
        ) 
      }

      {
        showFoundData && (
          isSearchDataLoading ? loader('album', true) : CheckObjOrArrForNull(albumsSearch) ? (
            <div className={styles.recomendations}>
              <div className={styles.songCardTitle}>
                <CustomLink href={`/search?mask=${searchValue}&all=alboms`}>
                  <h3>{t('albom')}</h3>
                  {
                    isViewAll ? "" : arrowRight
                  }
                </CustomLink>
              </div>
              <Swiper
                navigation
                modules={[ Navigation ]}
                slidesPerView={6}
                spaceBetween={2}
                breakpoints={standardCardBreaksPoints}
              >
                {
                    albumsSearch?.map(album => (
                      <SwiperSlide key={album.id}>
                      <StandardCard 
                        id={album.id}
                        albomId={album.id}
                        title={album.title}
                        image={album.cover}
                        alboms
                        hideMoreI
                      />
                      </SwiperSlide>
                    ))
                  }
              </Swiper>
            </div>
        ) : ""
        ) 
      }

      {
        showFoundData && (
          isSearchDataLoading ? loader('playlist', true) : CheckObjOrArrForNull(playlistsSearch) ? (
            <div className={styles.recomendations}>
              <div className={styles.songCardTitle}>
                <CustomLink href={`/search?mask=${searchValue}&all=playlists`}>
                  <h3>{t('playlist')}</h3>
                  {
                    isViewAll ? "" : arrowRight
                  }
                </CustomLink>
              </div>
              <Swiper
                navigation
                modules={[ Navigation ]}
                slidesPerView={6}
                spaceBetween={2}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  playlistsSearch?.map(playlist => (
                    <SwiperSlide key={playlist.id}>
                      <StandardCard 
                        id={playlist.id}
                        playlistId={playlist.id}
                        title={playlist.title!}
                        image={playlist.cover}
                        playlists
                        hideMoreI
                      />
                    </SwiperSlide>
                  ))
                }
              </Swiper>
            </div>
        ) : ""
        ) 
      }

      {
        showFoundData && (
          isSearchDataLoading ? loader('clip', true) : CheckObjOrArrForNull(clipsSearch) ? (
            <div className={styles.recomendations}>
              <div className={styles.songCardTitle}>
                <CustomLink href={`/search?mask=${searchValue}&all=clips`}>
                  <h3>{t('clip')}</h3>
                  {
                    isViewAll ? "" : arrowRight
                  }
                </CustomLink>
              </div>
              <Swiper
                navigation
                modules={[ Navigation ]}
                slidesPerView={6}
                spaceBetween={2}
                breakpoints={standardCardBreaksPoints}
              >
                {
                  clipsSearch?.map(clip => (
                    <SwiperSlide key={clip.id}>
                      <StandardCard 
                        id={clip.id}
                        clipId={clip.id}
                        title={clip.title}
                        image={clip.cover}
                        clipCard
                        videoDuration={clip.duration}
                        onShare={() => handleShare(clip.id)}
                        onOpenBottomSheet={() => {
                          setBsSongId(clip.id)
                          setOpenBs(true)
                        }}
                      />
                    </SwiperSlide>
                  ))
                }
              </Swiper>
            </div>
        ) : ""
        ) 
      }

      <Bottomsheet 
        open={openBs}
        actionsData={actionsData}
        close={() => setOpenBs(false)}
        onClick={(value) => {
          if(value === 'share')
          handleShare(bsSongId)
        }}
      />
    </>
  )
}

export default Search