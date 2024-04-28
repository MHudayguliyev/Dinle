'use client';
import React, { useMemo, useRef } from 'react'
import { useInfiniteQuery } from 'react-query';
//styles
import styles from './page.module.scss'
import TopNavbar from '@app/_components/TopNavbar/TopNavbar';
import PrevNextI from '@app/_components/icons/prevNext/icon';
import { GetClips } from '@app/_api/Queries/Getters';
import { CheckObjOrArrForNull } from '@app/_utils/helpers';
import useObserve from '@app/_hooks/useObserve';
import Video from '@app/_api/types/queryReturnTypes/Video';
import StandardCard from '@app/_components/StandardCard/StandardCard';

const Clips = () => {
  const observer = useRef<IntersectionObserver>()

  const {
    data: clipsData, 
    isLoading,
    isFetching, 
    fetchNextPage, 
    hasNextPage
  } = useInfiniteQuery({
    queryKey: ['Clips'], 
    queryFn: ({pageParam}) => GetClips({
      page: pageParam,
    }), 
    getNextPageParam: (lastPage, allPages) => {
      if(CheckObjOrArrForNull(lastPage.data.rows)) return allPages.length + 1
      return null
    }
  })

  const lastClipObserver = useObserve({
    observer, fetchNextPage, 
    hasNextPage, isFetching, 
    isLoading
  })

  const clipsList = useMemo((): Video[] =>  {
    // @ts-ignore
    return clipsData?.pages.reduce((acc, page) => {
      return [...acc, ...page.data.rows];
  }, [])
  }, [clipsData])
  console.log("clipsList",clipsList)

  return (
    <>
        <TopNavbar 
            className={styles.topHeader}
            renderOptions={() => (
                <div className={styles.opts}>
                    <PrevNextI  mode='prev'/>
                    <PrevNextI  mode='next'/>
                </div>
            )}
            renderActions={() => (
                <div className={styles.title}>
                    Klipler
                </div>
            )}
        />

        <div className={styles.gridBox}>
          {
            clipsList?.map(clip => (
              <StandardCard 
                ref={lastClipObserver}
                key={clip.id}
                id={clip.id}
                videoId={clip.id}
                title={clip.title}
                image={clip.cover}
                videoCard
                videoDuration={clip.duration}
              />
            ))
          }
        </div>
    </>
  )
}

export default Clips