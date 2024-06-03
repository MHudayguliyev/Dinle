'use client';
import React, {useMemo, useRef, useState} from 'react'
import { useSearchParams, usePathname } from 'next/navigation';
import { useInfiniteQuery } from 'react-query'
import { GetClips } from '@app/_api/Queries/Getters'
import Video from '@app/_api/types/queryReturnTypes/Video'
import useObserve from '@app/_hooks/useObserve'
import { CheckObjOrArrForNull, copyLink, getQueryString, isEmpty, isUndefined} from '@app/_utils/helpers'
import StandardCard from '@app/_components/StandardCard/StandardCard';
//styles
import styles from './page.module.scss'
import toast from 'react-hot-toast';
import Bottomsheet from '@app/_components/Bottomsheet/Bottomsheet';
import ShareSmI from '@app/_components/icons/shareSm/icon';

const Videos = () => {
  const observer = useRef<IntersectionObserver>()
  const search = useSearchParams()
  const pathname = usePathname()
  const [openBs, setOpenBs] = useState<boolean>(false)
  const [bsSongId, setBsSongId] = useState<string>("")

  const {
    data: clipsData, 
    isLoading,
    isFetching, 
    fetchNextPage, 
    hasNextPage
  } = useInfiniteQuery({
    queryKey: ['Videos'], 
    queryFn: ({pageParam}) => GetClips({
      page: pageParam,
      clipId: 'videos'
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

  const actionsData = [
    {
      value: 'share', 
      label: {ru: 'Paylasmak', tm: 'Paylasmak'}, 
      icon: <ShareSmI />
    }
  ]

  return (
    <>
      <div className={styles.gridBox}>
        {
          clipsList?.map(clip => (
            <StandardCard 
              ref={lastClipObserver}
              key={clip.id}
              id={clip.id}
              concertId={clip.id}
              title={clip.title}
              image={clip.cover}
              concertCard
              videoDuration={clip.duration}
              onShare={() => handleShare(clip.id)}
              onOpenBottomSheet={() => {
                setBsSongId(clip.id)
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

export default Videos