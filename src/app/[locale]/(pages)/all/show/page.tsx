'use client';
import React, {useMemo, useRef, useState} from 'react'
import { useInfiniteQuery } from 'react-query'
import { GetClips, GetShows } from '@app/_api/Queries/Getters'
import Video from '@app/_api/types/queryReturnTypes/Video'
import useObserve from '@app/_hooks/useObserve'
import { CheckObjOrArrForNull, copyLink, getQueryString } from '@app/_utils/helpers'
import StandardCard from '@app/_components/StandardCard/StandardCard';
//styles
import styles from './page.module.scss'
import Show from '@app/_api/types/queryReturnTypes/Show';
import toast from 'react-hot-toast';
import { usePathname, useSearchParams } from 'next/navigation';
import Bottomsheet from '@app/_components/Bottomsheet/Bottomsheet';
import ShareSmI from '@app/_components/icons/shareSm/icon';
const Shows = () => {
  const observer = useRef<IntersectionObserver>()
  const search = useSearchParams()
  const pathname = usePathname()
  const [openBs, setOpenBs] = useState<boolean>(false)
  const [bsSongId, setBsSongId] = useState<string>("")


  const {
    data: showsData, 
    isLoading,
    isFetching, 
    fetchNextPage, 
    hasNextPage
  } = useInfiniteQuery({
    queryKey: ['Shows'], 
    queryFn: ({pageParam = 1}) => GetShows(pageParam), 
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

  const showsList = useMemo((): Show[] =>  {
    // @ts-ignore
    return showsData?.pages.reduce((acc, page) => {
      return [...acc, ...page.data.rows];
  }, [])
  }, [showsData])

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
          showsList?.map(show => (
            <StandardCard 
              ref={lastsShowObserver}
              key={show.id}
              id={show.id}
              showId={show.id}
              title={show.title}
              image={show.cover}
              showCard
              onShare={() => handleShare(show.id)}
              onOpenBottomSheet={() => {
                setBsSongId(show.id)
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

export default Shows