'use client';
import React, {useCallback, useEffect, useMemo, useState} from 'react'
import { useRouter } from 'next/navigation'
import { useQuery } from 'react-query';
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

const ViewAll = ({params}: {params: {each: string}}) => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const id = useMemo(() => params?.each?.[0],[params.each])
  const [rows, setRows] = useState<Songs['rows']>()

  const {
    data, 
    isLoading, 
    isError
  } = useQuery(['GetSongs', id], () => getSongs({
    playlistId: id
  }), {
    refetchOnWindowFocus: false, enabled: !!id
  })

  const viewData = useMemo(() => {
    return data?.data?.rows
  },[data?.data])

  useEffect(() => {
    if(!isLoading && !isError){
      setRows(viewData)
    }
  }, [viewData])

  
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

          <div className={styles.header}>{data?.title}</div>
      </div>

      <div className={styles.lists}>
        <SongList 
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