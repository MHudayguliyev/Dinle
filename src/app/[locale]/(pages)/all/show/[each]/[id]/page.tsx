'use client';
import React, { useEffect, useMemo, useState } from 'react'

//styles
import styles from './page.module.scss'
import { useQuery } from 'react-query';
import { GetClip } from '@app/_api/Queries/Getters';
import { useAppDispatch, useAppSelector } from '@app/_hooks/redux_hooks';
import { setIsSongPlaying } from '@app/_redux/reducers/MediaReducer';
import Image from 'next/image';
import ReactPlayer from 'react-player';

const EachShowClip = ({params}: {params: {id: string, each: string}}) => {
    const dispatch = useAppDispatch()
    const showId = useMemo(() => params.each,[params.each])
    const clipId = useMemo(() => params.id,[params.id])

    const [isClient, setIsClient] = useState<boolean>(false)
    const [isVideoPlaying, setVideoPlaying] = useState<boolean>(false)
    const {isSongPlaying} = useAppSelector(state => state.mediaReducer)
    useEffect(() => {
      setIsClient(true)
    }, [])
    useEffect(() => {
      if(isSongPlaying && isVideoPlaying) dispatch(setIsSongPlaying(false))
    }, [isSongPlaying, isVideoPlaying])
    
    const {
      data
    } = useQuery(['Clip', clipId], () => GetClip({
      id: clipId, showId, addClipId: false
    }), 
    {enabled: !!clipId && !!showId})

    const cover = useMemo(() => (
      <Image src={data?.data?.cover as string} alt='cover' width='400' height='400'/>
    ), [data])

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
              url={data?.data?.link} 
              onEnded={() => console.log("ended playing video")}
              width={'100%'}
              height={'100%'}
              config={{
                file: {
                  attributes: {
                    poster: data?.data?.cover
                  }
                }
              }}
            />
          </div>
        )}
      </>
    ), [data, isClient])



  return (
    <div className={styles.presentation}>
      <div className={styles.background_gradient}></div>
      <div className={styles.background_image}>
          {cover}
      </div>
      
      <div className={styles.wrapper}>
          <div className={styles.content_box}>
              {clipPlayer}
              <div className={styles.title}>{data?.data.title}</div>
          </div>
      </div>
    </div>
  )
}

export default EachShowClip