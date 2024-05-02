'use client';
import React, { useEffect, useMemo, useState } from 'react'
import ReactPlayer from 'react-player/lazy'
import { useQuery } from 'react-query';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
//styles
import styles from './page.module.scss';

import { GetClip } from '@app/_api/Queries/Getters';
import TopNavbar from '@app/_components/TopNavbar/TopNavbar';
import PrevNextI from '@app/_components/icons/prevNext/icon';
import useWindowSize from '@app/_hooks/useWindowSize';
import { useAppSelector, useAppDispatch } from '@app/_hooks/redux_hooks';
import { setIsSongPlaying } from '@app/_redux/reducers/MediaReducer';
import { CheckObjOrArrForNull } from '@app/_utils/helpers';

const Video = ({params}: {params: {each: string}}) => {
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  const renderShows = useMemo(() => type === 'show',[type])
  const videoId = useMemo(() => params.each[0],[params.each])

  const [isClient, setIsClient] = useState<boolean>(false)
  const [isVideoPlaying, setVideoPlaying] = useState<boolean>(false)

  const {
    songData, 
    songIndex, 
    isSongPlaying, 
  } = useAppSelector(state => state.mediaReducer)
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  // useEffect(() => {
  //   if(isSongPlaying) dispatch(setIsSongPlaying(false))
  // }, [isSongPlaying])

  const {
    data: clipData
  } = useQuery(['Clip', videoId, renderShows], () => GetClip(
    videoId,'clips', renderShows ? videoId : ""
  ), 
{enabled: !!videoId})
  // console.log('clipData', clipData)
  // console.log('renderShows', renderShows)
  
  const cover = useMemo(() => (
    <Image src={clipData?.data?.cover ?? ""} alt='cover' width='400' height='400'/>
  ), [clipData])
  

  const clipPlayer = useMemo(() => (
    <>
      {isClient && (
        <div className={styles.videoPlayer}>
          <ReactPlayer
            controls
            onPlay={() => {
              if(isSongPlaying) dispatch(setIsSongPlaying(false))
              setVideoPlaying(true)
            }}
            onPause={() => setVideoPlaying(false)}
            playing={isVideoPlaying}
            url={clipData?.data?.link} 
            onEnded={() => console.log("ended playing video")}
            width={'100%'}
            height={'100%'}
            config={{
              file: {
                attributes: {
                  poster: clipData?.data?.cover
                }
              }
            }}
          />
        </div>
      )}
    </>
  ), [clipData, isClient])

  useEffect(() => {
    if(isSongPlaying && isVideoPlaying) dispatch(setIsSongPlaying(false))
  }, [isSongPlaying, isVideoPlaying])


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
            <div className={styles.actions}>
              Klipler
            </div>
          )}
      />

      <div className={styles.presentation}>
        <div className={styles.background_gradient}></div>
        <div className={styles.background_image}>
            {cover}
        </div>
        
        <div className={styles.wrapper}>
            <div className={styles.content_box}>
                {clipPlayer}
                <div className={styles.title}>{clipData?.data.title}</div>
            </div>
        </div>
      </div>
    </>
  )
}

export default Video