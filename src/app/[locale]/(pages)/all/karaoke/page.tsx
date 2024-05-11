'use client';
import React, { useMemo, useRef } from 'react'
import { useInfiniteQuery } from 'react-query';
import { GetClips } from '@app/_api/Queries/Getters';
import { CheckObjOrArrForNull } from '@app/_utils/helpers';
import useObserve from '@app/_hooks/useObserve';
import Video from '@app/_api/types/queryReturnTypes/Video';

//styles
import styles from './page.module.scss'
import StandardCard from '@app/_components/StandardCard/StandardCard';

const Karaoke = () => {
  const observer = useRef<IntersectionObserver>()
  const {
    data: karaokeData, 
    isLoading,
    isFetching, 
    fetchNextPage, 
    hasNextPage
  } = useInfiniteQuery({
    queryKey: ['Karaoke'], 
    queryFn: ({pageParam}) => GetClips({
      page: pageParam,
      clipId: 'karaoke'
    }), 
    getNextPageParam: (lastPage, allPages) => {
      if(CheckObjOrArrForNull(lastPage.data.rows)) return allPages.length + 1
      return null
    }
  })

  const lastKaraokeObserver = useObserve({
    observer, fetchNextPage, 
    hasNextPage, isFetching, 
    isLoading
  })

  const karaokeList = useMemo((): Video[] =>  {
    // @ts-ignore
    return karaokeData?.pages.reduce((acc, page) => {
      return [...acc, ...page.data.rows];
  }, [])
  }, [karaokeData])

  return (
    <>
      <div className={styles.gridBox}>
        {
          karaokeList?.map(clip => (
            <StandardCard 
              ref={lastKaraokeObserver}
              key={clip.id}
              id={clip.id}
              karaokeId={clip.id}
              videoId={clip.id}
              title={clip.title}
              image={clip.cover}
              karaokeCard
              videoDuration={clip.duration}
            />
          ))
        }
      </div>
    </>
  )
}

export default Karaoke