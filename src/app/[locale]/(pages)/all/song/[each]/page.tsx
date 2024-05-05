'use client';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import { useInfiniteQuery } from 'react-query';
//api
import {  getSongs } from '@app/_api/Queries/Getters';
//comps
import SongList from '@app/_components/SongList/SongList';
import StandardCard from '@app/_components/StandardCard/StandardCard';
//api
import { likeSong } from '@app/_api/Queries/Post';
//redux
import { useAppDispatch } from '@app/_hooks/redux_hooks';
import { setCurrentSong } from '@app/_redux/reducers/MediaReducer';
//hooks
import useObserve from '@app/_hooks/useObserve';
//utils
import { CheckObjOrArrForNull } from '@app/_utils/helpers';
//styles
import styles from './page.module.scss'
import SongsType from '@app/_api/types/queryReturnTypes/Songs';

const Songs = ({params}: {params: {each: string}}) => {
  const dispatch = useAppDispatch()
  const observer = useRef<IntersectionObserver>();
  const playlistId = useMemo(() => params.each,[params.each])
  const [rows, setRows] = useState<SongsType['rows']>([])

  const {
    data, 
    hasNextPage, 
    isFetching, 
    isError, 
    isLoading, 
    fetchNextPage
  } = useInfiniteQuery({
    queryKey: ['AllSongs', playlistId], 
    queryFn: ({pageParam = 0}) => getSongs({ page: pageParam, playlistId: playlistId }), 
    getNextPageParam: (lastPage, allPages) => {
     if(CheckObjOrArrForNull(lastPage.data.rows)) return allPages.length + 1;
     return  undefined
    }, 
    enabled: !!playlistId
  })

  const lastSongRef = useObserve({
    observer, hasNextPage, 
    isFetching, isLoading, 
    fetchNextPage, 
  })
  const songsList = useMemo(() => {
    return data?.pages.reduce((acc, page) => {
      return [...acc, ...page.data.rows];
    }, [])
  }, [data]);

  useEffect(() => {
    if(!isLoading && !isError)
    setRows(songsList)
  }, [songsList, isLoading, isError])

  const handleLike = useCallback(async(songId: string) => {
    try {
        const response = await likeSong(songId)
        if(response.success && response.statusCode === 200)
        setRows(prev => prev?.map(row => row.id === songId ? {...row, isLiked: !row.isLiked} : row))
      } catch (error) {
        console.log('like song error', error)
      }
  } , [])

  return (
    <div className={styles.lists}>
      <SongList 
        ref={lastSongRef}
        data={rows}
        fetchStatuses={{isLoading, isError}}
        className={styles.songList}
        onPlay={(index) => dispatch(setCurrentSong({data: rows, index, id: rows?.[index]?.id}))}
        onLike={handleLike}
      />  
    </div> 
  )
}

export default Songs