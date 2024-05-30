'use client';
import React, { useMemo, useRef, useState } from 'react'
import { useInfiniteQuery, useQuery } from 'react-query';
//styles
import styles from './page.module.scss';

import { GetClips } from '@app/_api/Queries/Getters';  
import ShareSmI from '@app/_components/icons/shareSm/icon';
import { usePathname, useSearchParams } from 'next/navigation';
import { CheckObjOrArrForNull, copyLink, getQueryString, isEmpty, isUndefined } from '@app/_utils/helpers';
import useObserve from '@app/_hooks/useObserve';
import Video from '@app/_api/types/queryReturnTypes/Video';
import Bottomsheet from '@app/_components/Bottomsheet/Bottomsheet';
import toast from 'react-hot-toast';
import StandardCard from '@app/_components/StandardCard/StandardCard';

const OneShow = ({params}: {params: {each: string}}) => {
  const observer = useRef<IntersectionObserver>()
  const showId = useMemo(() => params.each,[params.each])
  const search = useSearchParams()
  const pathname = usePathname()
  const [openBs, setOpenBs] = useState<boolean>(false)
  const [bsSongId, setBsSongId] = useState<string>("")


  const actionsData = [
    {
      value: 'share', 
      label: {ru: 'Paylasmak', tm: 'Paylasmak'}, 
      icon: <ShareSmI />
    }
  ]

  const {
    data: seriesData, 
    isLoading,
    isFetching, 
    fetchNextPage, 
    hasNextPage
  } = useInfiniteQuery({
    queryKey: ['Series', showId], 
    queryFn: ({pageParam = 0}) => GetClips({
      page: pageParam, 
      showId: showId, 
      addClipId: false
    }), 
    getNextPageParam: (lastPage, allPages) => {
      if(CheckObjOrArrForNull(lastPage.data.rows)) return allPages.length + 1
      return null
    }, 
    enabled: !!showId
  })

  const lastSeriesObserver = useObserve({
    observer, fetchNextPage, 
    hasNextPage, isFetching, 
    isLoading
  })

  const seriasList = useMemo((): Video[] =>  {
    // @ts-ignore
    return seriesData?.pages.reduce((acc, page) => {
      return [...acc, ...page.data.rows];
  }, [])
  }, [seriesData])

  const handleShare = (clipId: string) => {
    const queryString = getQueryString(search)
    const notEmptyQueryString = !isUndefined(queryString) && !isEmpty(queryString)
    const url = `${pathname}/${clipId}${notEmptyQueryString ? `?${queryString}` : "" }`
    copyLink(url)?.then((mode) => {
      if(mode === 'desktop') toast.success('Link is copied.')
      if(openBs) {
        setBsSongId("")
        setOpenBs(false)
      }
    })
  }


  return (
    <>

      <div className={styles.gridBox}>
        {
          seriasList?.map(seria => (
            <StandardCard 
              ref={lastSeriesObserver}
              key={seria.id}
              id={seria.id}
              showId={showId}
              showItemId={seria.id}
              title={seria.title}
              image={seria.cover}
              showCard
              showItemCard
              onShare={() => handleShare(seria.id)}
              onOpenBottomSheet={() => {
                setBsSongId(seria.id)
                setOpenBs(true)
              }}
              queryString={getQueryString(search)}
            />
          ))
        }
      </div>

      <Bottomsheet 
        open={openBs}
        actionsData={actionsData}
        close={() => setOpenBs(false)}
        onClick={(value) => {
          if(value === 'share')
          handleShare(bsSongId)
        }}
      />
    </>
  )
}

export default OneShow