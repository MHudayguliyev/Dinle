'use client';
import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image';
import ReactPlayer from 'react-player';
//styles
import styles from './page.module.scss';

import { GetClip } from '@app/_api/Queries/Getters';  
import { useAppSelector, useAppDispatch } from '@app/_hooks/redux_hooks';
import { setIsSongPlaying } from '@app/_redux/reducers/MediaReducer';
import { useQuery } from 'react-query';

const OneKaraoke = ({params}: {params: {each: string}}) => {
    const dispatch = useAppDispatch()
    const karaokeId = useMemo(() => params.each,[params.each])
    
    const [isClient, setIsClient] = useState<boolean>(false)
    const [isVideoPlaying, setVideoPlaying] = useState<boolean>(false)
    const {isSongPlaying} = useAppSelector(state => state.mediaReducer)
    
    useEffect(() => {
      setIsClient(true)
    }, [])
    useEffect(() => {
      if(isSongPlaying && isVideoPlaying) dispatch(setIsSongPlaying(false))
    }, [isSongPlaying, isVideoPlaying, dispatch])

    const {
        data: karaokeData
      } = useQuery(['OneKaraoke', karaokeId], () => GetClip(karaokeId,'karaoke'), 
      {enabled: !!karaokeId})
      
      const cover = useMemo(() => (
        <Image src={karaokeData?.data?.cover as string} alt='cover' width='400' height='400'/>
      ), [karaokeData])
    
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
                url={karaokeData?.data?.link} 
                onEnded={() => console.log("ended playing video")}
                width={'100%'}
                height={'100%'}
                config={{
                  file: {
                    attributes: {
                      poster: karaokeData?.data?.cover
                    }
                  }
                }}
              />
            </div>
          )}
        </>
      ), [karaokeData, isClient, dispatch])

  return (
    <div className={styles.presentation}>
      <div className={styles.background_gradient}></div>
      <div className={styles.background_image}>
          {cover}
      </div>
      
      <div className={styles.wrapper}>
          <div className={styles.content_box}>
              {clipPlayer}
              <div className={styles.title}>{karaokeData?.data.title}</div>
          </div>
      </div>
    </div>
  )
}

export default OneKaraoke
