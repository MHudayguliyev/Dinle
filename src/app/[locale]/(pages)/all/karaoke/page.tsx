'use client';
import React, { useMemo, useRef, useState } from 'react'
import { useInfiniteQuery } from 'react-query';
import { GetClips } from '@app/_api/Queries/Getters';
import { CheckObjOrArrForNull, copyLink, getQueryString, isEmpty, isUndefined } from '@app/_utils/helpers';
import useObserve from '@app/_hooks/useObserve';
import Video from '@app/_api/types/queryReturnTypes/Video';

//styles
import styles from './page.module.scss'
import StandardCard from '@app/_components/StandardCard/StandardCard';
import toast from 'react-hot-toast';
import { usePathname, useSearchParams } from 'next/navigation';
import ShareSmI from '@app/_components/icons/shareSm/icon';
import Bottomsheet from '@app/_components/Bottomsheet/Bottomsheet';

const Karaoke = () => {
  const observer = useRef<IntersectionObserver>()
  const pathname = usePathname()
  const search = useSearchParams()
  const title = search.get('title')

  const [openBs, setOpenBs] = useState<boolean>(false)
  const [bsSongId, setBsSongId] = useState<string>("")

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

  const handleShare = (clipId: string) => {
    const url = `${pathname}/${clipId}`
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

export default Karaoke