'use client';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import { useInfiniteQuery } from 'react-query';
//styles
import styles from './page.module.scss';
//icon
import PrevNext from '@components/icons/prevNext/icon';
//api
import { getSongs } from '@app/_api/Queries/Getters';
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

const ViewAll = ({params}: {params: {each: string}}) => {
  const observer = useRef<IntersectionObserver>();
  const dispatch = useAppDispatch()
  const id = useMemo(() => params?.each?.[0],[params.each])
  const [rows, setRows] = useState<Songs['rows']>()



  const {
    data, 
    hasNextPage, 
    isFetching, 
    isError, 
    isLoading, 
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['Songs', id], 
    queryFn: ({pageParam}) => getSongs({ page: pageParam }), 
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.data.rows.length ? allPages.length + 1 : undefined;
    }, 
    enabled: !!id, refetchOnWindowFocus: false
  })


  const lastElementRef = useObserve({
    observer, hasNextPage, 
    isFetching, isLoading, 
    fetchNextPage, 
  })

  const songsData = useMemo(() => {
    console.log("data", data)
    // @ts-ignore
    return data?.pages.reduce((acc, page) => {
      return [...acc, ...page.data.rows];
    }, [])
  }, [data]);

  // const songTitle = useMemo(() => data?.pages?[0]?.,[data])

  useEffect(() => {
    if(!isLoading && !isError)
    setRows(songsData)
  }, [songsData])

  
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

          {/* <div className={styles.header}>{data?.title}</div> */}
      </div>

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
    </div>
  )
}

export default ViewAll