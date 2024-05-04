'use client';
import React, { useCallback, useMemo, useRef, useState } from 'react'
import { useInfiniteQuery } from 'react-query';
//api
import { GetArtNews } from '@app/_api/Queries/Getters';
//type
import ArtNews from '@app/_api/types/queryReturnTypes/ArtNews';
//hooks
import useObserve from '@app/_hooks/useObserve';
import { CheckObjOrArrForNull, copyLink } from '@app/_utils/helpers';
//styles
import styles from './page.module.scss'
import StandardCard from '@app/_components/StandardCard/StandardCard';
import Bottomsheet from '@app/_components/Bottomsheet/Bottomsheet';
import ShareSmI from '@app/_components/icons/shareSm/icon';
import toast from 'react-hot-toast';

const News = () => {
  const observer = useRef<IntersectionObserver>();
  const [newsId, setNewsId] = useState<string>("")
  const [showBottomSheet, setShowBottomSheet] = useState<boolean>(false)

  const {
    data: newsData, 
    hasNextPage: newsHasNextPage, 
    isFetching: isNewsFetching, 
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

  const actionsData = [
    {
        value: 'share', 
        label: {ru: 'Paylasmak', tk: 'Paylasmak'}, 
        icon: <ShareSmI />
    }, 
  ]

  const handleCopyLink = useCallback((id: string) => {
    copyLink(`/all/news/${id}`)?.then((mode) => {
      if(showBottomSheet) setShowBottomSheet(false)
      if(mode === 'desktop') toast.success('Link is copied.')
      setNewsId("")
    })
  }, [newsId, showBottomSheet])

  return (
    <>
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
              onShare={() => {
                handleCopyLink(eachNews.id)
              }}
              onOpenBottomSheet={() => {
                setNewsId(eachNews.id)
                setShowBottomSheet(true)
              }}
            />
          ))
        }
      </div>

      <Bottomsheet
        actionsData={actionsData} 
        open={showBottomSheet}
        close={() => setShowBottomSheet(false)} 
        onClick={() => handleCopyLink(newsId)}
      />
    </>
  )
}

export default News