'use client';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import { useInfiniteQuery } from 'react-query';
//styles
import styles from './page.module.scss';
//icon
import PrevNext from '@components/icons/prevNext/icon';
//api
import { GetArtNews, getSongs } from '@app/_api/Queries/Getters';
import Songs from '@app/_api/types/queryReturnTypes/Songs';
//comps
import SongList from '@app/_components/SongList/SongList';
//api
import { likeSong } from '@app/_api/Queries/Post';
//redux
import { useAppDispatch } from '@app/_hooks/redux_hooks';
import { setCurrentSong } from '@app/_redux/reducers/MediaReducer';
//hooks
import useObserve from '@app/_hooks/useObserve';
import ArtNews from '@app/_api/types/queryReturnTypes/ArtNews';
import { CheckObjOrArrForNull } from '@app/_utils/helpers';
import StandardCard from '@app/_components/StandardCard/StandardCard';

const ViewAll = ({params}: {params: {each: string}}) => {
  const observer = useRef<IntersectionObserver>();
  const newsObserver = useRef<IntersectionObserver>();

  const dispatch = useAppDispatch()
  const id = useMemo(() => params?.each?.[0],[params.each])
  const renderSongs = useMemo(() => id !== 'news',[id])
  const renderNews = useMemo(() => id === 'news',[id])
  const [rows, setRows] = useState<Songs['rows']>([])
  const [news, setNews] = useState<ArtNews[]>([])

  const {
    data, 
    hasNextPage, 
    isFetching, 
    isError, 
    isLoading, 
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['Songs', renderSongs, id], 
    queryFn: ({pageParam = 0}) => getSongs({ page: pageParam, playlistId: id }), 
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data.rows.length ? allPages.length + 1 : undefined;
    }, 
    enabled: renderSongs && !!id
  })

  const {
    data: newsData, 
    hasNextPage: newsHasNextPage, 
    isFetching: isNewsFetching, 
    isError: isNewsError, 
    isLoading: isNewsLoading, 
    fetchNextPage: fetchNewsNextPage
  } = useInfiniteQuery({
    queryKey: ['News', renderNews], 
    queryFn: ({pageParam}) => GetArtNews(pageParam), 
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data.rows.length ? allPages.length + 1 : undefined;
    }, 
    enabled: renderNews
  })

  const lastElementRef = useObserve({
    observer, hasNextPage, 
    isFetching, isLoading, 
    fetchNextPage, 
  })
  const lastNewsRef = useObserve({
    observer: newsObserver, 
    hasNextPage: newsHasNextPage, 
    isFetching: isNewsFetching, 
    isLoading: isNewsLoading, 
    fetchNextPage: fetchNewsNextPage, 
  })

  const songsList = useMemo(() => {
    return data?.pages.reduce((acc, page) => {
      return [...acc, ...page.data.rows];
    }, [])
  }, [data]);

  const newsList = useMemo(():any => {
    // @ts-ignore
    return newsData?.pages.reduce((acc, page) => {
      return [...acc, ...page.data.rows];
    }, [])
  }, [newsData]);
  console.log('newsData', newsData)

  useEffect(() => {
    if(!isLoading && !isError)
    setRows(songsList)
  }, [songsList])

  useEffect(() => {
    if(CheckObjOrArrForNull(newsList)) setNews(newsList)
  }, [newsList])

  
  const handleLike = useCallback(async(songId: string) => {
    try {
        const response = await likeSong(songId)
        console.log('response', response)
        if(response.success && response.statusCode === 200)
        setRows(prev => prev?.map(row => row.id === songId ? {...row, isLiked: !row.isLiked} : row))
      } catch (error) {
        console.log('like song error', error)
      }
  } , [])

  return (
    <div className={styles.wrapper}>
      <div className={styles.the_top}>
          <div className={styles.backForward}>
            <PrevNext mode='prev'/>
            <PrevNext mode='next'/>
          </div>

          <div className={styles.header}>
            {
              renderNews ? 'Sungat habarlary' : "Aydymlar"
            }
          </div>
      </div>

      {
        renderSongs && 
          <div className={styles.lists}>
            <SongList 
              ref={lastElementRef}
              data={rows}
              fetchStatuses={{isLoading, isError}}
              className={styles.songList}
              onPlay={(index) => dispatch(setCurrentSong({data: rows, index, id: rows?.[index]?.id}))}
              onLike={handleLike}
            />  
        </div> 
      }
      {
        renderNews && 
        <div className={styles.gridBox}>
          {
            news?.map(eachNews => (
              <StandardCard 
                key={eachNews.id}
                ref={lastNewsRef}
                id={eachNews.id}
                newsId={eachNews.id}
                image={eachNews.cover}
                title={eachNews.title}
                videoCard
                newsCard
              />
            ))
          }
        </div>
      }
    </div>
  )
}

export default ViewAll