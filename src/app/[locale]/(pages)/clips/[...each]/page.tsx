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

const Video = ({params}: {params: {each: string}}) => {
  const searchParams = useSearchParams()
  const type = searchParams.get('type')
  const renderShows = useMemo(() => type === 'show',[type])
  const videoId = useMemo(() => params.each[0],[params.each])

  const [isClient, setIsClient] = useState(false)
  const [width] = useWindowSize()
 
  useEffect(() => {
    setIsClient(true)
  }, [])

  const {
    data: clipData
  } = useQuery(['Clip', videoId, renderShows], () => GetClip(
    videoId,'clips', renderShows ? videoId : ""
  ), 
{enabled: !!videoId})
  console.log('clipData', clipData)
  console.log('renderShows', renderShows)


  const cover = useMemo(() => (
    <Image src={clipData?.data?.cover ?? ""} alt='cover' width='400' height='400'/>
  ), [clipData])

  const clipPlayer = useMemo(() => (
    <>
      {isClient && (
        <div className={styles.videoPlayer}>
          <ReactPlayer
            controls
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
      />

      <div className={styles.presentation}>
        <div className={styles.background_gradient}></div>
        <div className={styles.background_image}>
            {cover}
        </div>
        
        <div className={styles.wrapper}>
            <div className={styles.content_box}>
                {clipPlayer}
                <div className={styles.artist}>
                    <div className={styles.head}>{renderShows ? 'Showlar' : 'Klipler'}</div>
                    <div className={styles.title}>{clipData?.data.title}</div>
                </div>
            </div>
        </div>
      </div>
    </>
  )
}

export default Video