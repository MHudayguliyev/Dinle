'use client';
import React, { useEffect, useMemo, useState } from 'react'
import ReactPlayer from 'react-player/lazy'
//redux
import { useAppSelector } from '@app/_hooks/redux_hooks';
import { CheckObjOrArrForNull } from '@app/_utils/helpers';

const Video = ({params}: {params: {each: string}}) => {
  console.log("params", params.each[0])
  const videoId = useMemo(() => params.each[0],[params.each])
  const [isClient, setIsClient] = useState(false)
  const videoData = useAppSelector(state => state.mediaReducer.videoData)
  const videoIndex = useAppSelector(state => state.mediaReducer.videoIndex)

  // console.log('data', videoData)
  // console.log('index', videoIndex)

 
  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <>
      {/* {isClient && CheckObjOrArrForNull(videoData) && (
        <ReactPlayer
          controls
          url={videoData[videoIndex].link} 
          onEnded={() => console.log("ended playing video")}
        />
      )} */}
    </>
  )
}

export default Video