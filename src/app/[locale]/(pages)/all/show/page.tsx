'use client';
import React, {useMemo, useRef} from 'react'
import { useInfiniteQuery } from 'react-query'
import { GetClips } from '@app/_api/Queries/Getters'
import Video from '@app/_api/types/queryReturnTypes/Video'
import useObserve from '@app/_hooks/useObserve'
import { CheckObjOrArrForNull } from '@app/_utils/helpers'
import StandardCard from '@app/_components/StandardCard/StandardCard';
//styles
import styles from './page.module.scss'
const Shows = () => {
  const observer = useRef<IntersectionObserver>()
  const {
    data: showsData, 
    isLoading,
    isFetching, 
    fetchNextPage, 
    hasNextPage
  } = useInfiniteQuery({
    queryKey: ['Shows'], 
    queryFn: ({pageParam}) => GetClips({
      page: pageParam,
    }), 
    getNextPageParam: (lastPage, allPages) => {
      if(CheckObjOrArrForNull(lastPage.data.rows)) return allPages.length + 1
      return null
    }
  })

  const lastsShowObserver = useObserve({
    observer, fetchNextPage, 
    hasNextPage, isFetching, 
    isLoading
  })

  const showsList = useMemo((): Video[] =>  {
    // @ts-ignore
    return showsData?.pages.reduce((acc, page) => {
      return [...acc, ...page.data.rows];
  }, [])
  }, [showsData])
  // console.log('show', showsData)

  return (
    <>
      <div className={styles.gridBox}>
        {
          showsList?.map(show => (
            <StandardCard 
              ref={lastsShowObserver}
              key={show.id}
              id={show.id}
              videoId={show.id}
              title={show.title}
              image={show.cover}
              videoCard
              videoDuration={show.duration}
            />
          ))
        }
      </div>
    </>
  )
}

export default Shows