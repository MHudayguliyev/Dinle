'use client';
import React, {useCallback, useEffect, useMemo, useState, useRef} from 'react'
import Image from 'next/image';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useQuery } from 'react-query';

import InfiniteScroll from 'react-infinite-scroller';
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

//utils
import { CheckObjOrArrForNull, delay, isEmpty, isUndefined, parse } from '@app/_utils/helpers';
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
import ArrowRightI from '@app/_components/icons/arrowRight/icon';

const cn = classNames.bind(styles)
const Search = () => {
  const inputRef:any = useRef(null)
  const dropdownRef:any = useRef<HTMLDivElement>(null)
  const dropdownToggleRef:any = useRef(null)
  const [openRecents, setOpenRecents] = useClickOutside(dropdownRef, dropdownToggleRef, 'mousedown')
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState<number>(0)
  const [width] = useWindowSize()

  const dispatch = useAppDispatch()
  const router = useRouter()
  const searchParam = useSearchParams()
  const searchType = searchParam.get('type')
  const searchAll = searchParam.get('all')

  const [searchValue, setSearchValue] = useState<string>(searchAll ?? "")
  const [openShazam, setOpenShazam] = useState<boolean>(false)
  const [isSearchDataLoading, setSearchDataLoading] = useState<boolean>(false)
  const [isNotFound, setIsNotFound] = useState<boolean>(false)
  const [albums, setAlbums] = useState<SearchType['data']['alboms']>([])
  const [songs, setSongs] = useState<SearchType['data']['songs']>([])
  const [artists, setArtists] = useState<SearchType['data']['artists']>([])
  const [shows, setShows] = useState<SearchType['data']['shows']>([])
  const [playlists, setPlaylists] = useState<SearchType['data']['playlists']>([])
  const [recentSearchData, setRecentSearchData] = useState<{title: string}[]>([])

  const tabs: TabMenuTypes[] = [
    {
      route: 'artist', label: {
        en: 'Artists', tm: 'Artists', ru:'Artists'
      }
    }, 
    {route: 'playlist', label: {
      en: 'Playlist', tm:'Playlist', ru: 'Playlist'
    }}, 
    {
      route: 'album', label: {
        en: 'Albums', tm:'Albums', ru: 'Albums'
      }
    }, 
    {
      route: 'genre', label: {
        en: 'Genres', tm:'Genres', ru: 'Genres'
      }
    }
  ]
  const showFoundData = useMemo(() => isUndefined(searchType) && (!isUndefined(searchAll) && !isEmpty(searchAll)),[searchType, searchAll])
  const showArtists = useMemo(() => searchType === tabs[0]?.route ,[searchType])
  const showPlaylists = useMemo(() => searchType === tabs[1]?.route,[searchType])
  const showAlbums = useMemo(() => searchType === tabs[2]?.route,[searchType])
  const showGenres = useMemo(() =>searchType === tabs[3]?.route,[searchType])
  // console.log('showFoundData',showFoundData)

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
        <Button color='lightDark' roundedSm>
          Refresh
        </Button>
      </div>
    )
  }, [])
  const arrowRight = useMemo(() => (
    <ArrowRightI className={styles.arrowRight}/>
  ), [])
  const loader = useCallback((type: 'artist' | 'playlist' | 'album' | 'genre', swiperMode = false) => {
    const arr = [1,2,3,4,5,6]
    return (
      <div className={styles.recomendations}>
        <span className={styles.topShimmer}></span>
        {
          swiperMode ? (
            <Swiper
              navigation
              modules={[ Navigation ]}
              slidesPerView={6}
              spaceBetween={2}
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
                    artists={type === 'artist'}
                    playlists={type === 'playlist'}
                    alboms={type === 'album'}
                    genres={type === 'genre'}
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
                    artists={type === 'artist'}
                    playlists={type === 'playlist'}
                    alboms={type === 'album'}
                    genres={type === 'genre'}
                  />
                ))
              }
            </div>
          )
        }

      </div>
    )
  }, [])


  //queries 
  const {
    data: artistsData, 
    isLoading: isArtistsLoading, 
    isError: isArtistsError
  }  = useQuery(['GetArtists', showArtists], () => GetArtists(), {
    refetchOnWindowFocus: false, enabled: showArtists,
  })

  const {
    data: playlistsData, 
    isLoading: isPlaylistsLoading, 
    isError: isPlaylistsError, 
  } = useQuery(["GetPlaylists", showPlaylists], () => GetPlaylists(), {
    refetchOnWindowFocus: false, enabled: showPlaylists
  })
  const {
    data: albumsData, 
    isLoading: isAlbumsLoading, 
    isError: isAlbumsError, 
  }  = useQuery(['GetAlbums', showAlbums], () => GetAlbums({}), {
    refetchOnWindowFocus: false, enabled: showAlbums
  })
  const {
    data: genresData, 
    isLoading: isGenresLoading, 
    isError: isGenresError, 
  }  = useQuery(['GetGenres', showGenres], () => GetGenres(), {
    refetchOnWindowFocus: false, enabled: showGenres
  })

  useEffect(() => {
    if(isUndefined(searchType) && (isUndefined(searchAll) || isEmpty(searchAll))) {
      router.push(`/search?type=${tabs[3].route}`)
    }
    else if(!isUndefined(searchAll) && !isEmpty(searchAll)) goSearch()
    setRecentSearchData(parse(getFromStorage('recentSearchData')!) ?? [])
  }, [])

  useEffect(() => {
    const localSearches = parse(getFromStorage('recentSearchData')!)
    if(!isEmpty(searchValue)){
      console.log('searchValue', searchValue)
      const searchValueTrimmed = searchValue?.trim()?.toLowerCase()
      const filtered = localSearches?.filter((searchData:any) => searchData.title?.toLowerCase().includes(searchValueTrimmed))
      setRecentSearchData(filtered)
      if(CheckObjOrArrForNull(filtered)) setOpenRecents(true)

      
    }else setRecentSearchData(localSearches)

  }, [searchValue])

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

  const goSearch = useCallback(async () => {
    const localSearches = parse(getFromStorage('recentSearchData')!)
    if(CheckObjOrArrForNull(localSearches)){
      console.log('localSearches',localSearches)
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
      //push to route right when enter clicked/searched
      router.push(`/search?all=${searchValue}`, { scroll: false })
      setSearchDataLoading(true)
      const response = await searchSong({ search: searchValue })
      if(response.statusCode === 200){
        const {
          alboms, 
          songs, 
          artists, 
          playlists, 
          shows
        } = response.data
        console.log('rsp', response.data)
        
        delay(200).then(() => {
          setAlbums(alboms)
          setArtists(artists)
          setSongs(songs)
          setPlaylists(playlists)
          setShows(shows)
          setSearchDataLoading(false)
        })

      }

    } catch (error) {
      console.log('search error', error)
      setAlbums([])
      setArtists([])
      setSongs([])
      setPlaylists([])
      setShows([])
      setSearchDataLoading(false)
    }
  }, [searchValue])

  const handleKeyDown = useCallback((e: any) => {
    if(e.keyCode === 13){
      if(isEmpty(searchValue)){
        router.push(`search?type=${tabs[3].route}`)
      }else {
        goSearch()
      }
    }
  }, [router, searchValue, goSearch])

  const searchOnIClick = useCallback(() => {
    if(isEmpty(searchValue)){
      router.push(`search?type=${tabs[3].route}`)
    }else {
      goSearch()
    }
  }, [router, searchValue, goSearch])

  const openRecentBoxFN = useCallback(() => {
    if(CheckObjOrArrForNull(recentSearchData) && !openRecents) setOpenRecents(true)
  }, [recentSearchData, openRecents])


  return (
    <>
    <SearchModal 
      show={openShazam}
      close={() => setOpenShazam(false)}
    />

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
              onChange={e => setSearchValue(e.target.value)}
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
                    active: activeSuggestionIndex === i
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
          pathname={searchType}
          fixedTopNull
          scrollYPosition={73}
        />

      </div>

        {
          showArtists && (
            isArtistsLoading  ?  loader('artist') :  
              isArtistsError ? errorDiv : 
              <div className={styles.recomendations}>
                <h3 className={styles.songCardTitle}>Artists</h3>
                  <div className={styles.grid_wrapper}>
                    {
                      artistsData?.data?.rows?.map((artist:any) => (
                        <StandardCard 
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
            isPlaylistsLoading ?  loader('playlist') :  
            isPlaylistsError ? errorDiv : 
              <div className={styles.recomendations}>
                <h3 className={styles.songCardTitle}>Playlists</h3>
                <div className={styles.grid_wrapper}>
                  {
                    playlistsData?.data?.rows?.map(playlist => (
                      <StandardCard 
                        key={playlist.id}
                        id={playlist.id}
                        playlistId={playlist.id}
                        title={playlist.title}
                        image={playlist.cover}
                        playlists
                      />
                    ))
                  }
                </div>
              </div>
          )
        }

        {
          showAlbums && (
            isAlbumsLoading ?  loader('album') :  
            isAlbumsError ? errorDiv : 
              <div className={styles.recomendations}>
                <h3 className={styles.songCardTitle}>Albums</h3>
                <div className={styles.grid_wrapper}>
                  {
                    albumsData?.data?.rows?.map(album => (
                      <StandardCard 
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
            isGenresLoading ?  loader('genre') :  
            isGenresError ? errorDiv : 
              <div className={styles.recomendations}>
                <h3 className={styles.songCardTitle}>Genres</h3>
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
          showFoundData && CheckObjOrArrForNull(songs) && (
            <div className={styles.recomendations}>
              <h3 className={styles.songCardTitle}>
                Songs
                <ArrowRightI />
              </h3>
              <SongList 
                data={songs} 
                // onLike={handleLike}
                onPlay={(index) => dispatch(setCurrentSong({data: songs, index, id: songs[index]?.id}))}
                fetchStatuses={{
                  isLoading: false, isError: false
                }}
              />
            </div>
          )
        }

      {
        showFoundData && (
          isSearchDataLoading ? loader('artist', true) : CheckObjOrArrForNull(artists) ? (
            <div className={styles.recomendations}>
              <h3 className={styles.songCardTitle}>
                Artists
                {arrowRight}
              </h3>
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
                        artists?.map(artist => (
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
                    {artists?.map(artist => (
                      <ArtistsList 
                        key={artist.id}
                        id={artist.id}
                        // artistId={artist.id} //later
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
          isSearchDataLoading ? loader('album', true) : CheckObjOrArrForNull(albums) ? (
            <div className={styles.recomendations}>
              <h3 className={styles.songCardTitle}>
                Albums
                {arrowRight}
              </h3>
                <Swiper
                  navigation
                  modules={[ Navigation ]}
                  slidesPerView={6}
                  spaceBetween={2}
                  breakpoints={standardCardBreaksPoints}
                >
                  {
                      albums?.map(album => (
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
          isSearchDataLoading ? loader('playlist', true) : CheckObjOrArrForNull(playlists) ? (
            <div className={styles.recomendations}>
              <h3 className={styles.songCardTitle}>
                Playlists
                {arrowRight}
              </h3>
                <Swiper
                  navigation
                  modules={[ Navigation ]}
                  slidesPerView={6}
                  spaceBetween={2}
                  breakpoints={standardCardBreaksPoints}
                >
                  {
                    playlists?.map(playlist => (
                      <SwiperSlide key={playlist.id}>
                        <StandardCard 
                          id={playlist.id}
                          playlistId={playlist.id}
                          title={playlist.title!}
                          image={playlist.cover}
                          playlists
                        />
                      </SwiperSlide>
                    ))
                  }
                </Swiper>
            </div>
        ) : ""
        ) 
      }
    </>
  )
}

export default Search