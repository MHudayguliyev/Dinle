'use client';
import React, { useMemo, useRef, useState } from 'react'
import { useInfiniteQuery } from 'react-query';
//api
import { GetArtNews } from '@app/_api/Queries/Getters';
//type
import ArtNews from '@app/_api/types/queryReturnTypes/ArtNews';
//hooks
import useObserve from '@app/_hooks/useObserve';
import { CheckObjOrArrForNull } from '@app/_utils/helpers';
//styles
import styles from './page.module.scss'
import StandardCard from '@app/_components/StandardCard/StandardCard';

const News = () => {
  const observer = useRef<IntersectionObserver>();

  const {
    data: newsData, 
    hasNextPage: newsHasNextPage, 
    isFetching: isNewsFetching, 
    isError: isNewsError, 
    isLoading: isNewsLoading, 
    fetchNextPage: fetchNewsNextPage
  } = useInfiniteQuery({
    queryKey: ['News'], 
    queryFn: ({pageParam}) => GetArtNews(pageParam), 
    getNextPageParam: (lastPage, allPages) => {
      if(CheckObjOrArrForNull(lastPage.data.rows)) return allPages.length + 1;
      return  undefined
    }
  })

  const lastNewsRef = useObserve({
    observer, 
    hasNextPage: newsHasNextPage, 
    isFetching: isNewsFetching, 
    isLoading: isNewsLoading, 
    fetchNextPage: fetchNewsNextPage, 
  })
  const newsList = useMemo(():ArtNews[] => {
    // @ts-ignore
    return newsData?.pages.reduce((acc, page) => {
      return [...acc, ...page.data.rows];
    }, [])
  }, [newsData]);

  return (
    <div className={styles.gridBox}>
      {
        newsList?.map(eachNews => (
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
  )
}

export default News