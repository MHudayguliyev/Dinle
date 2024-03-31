import React, {MouseEventHandler, useCallback, useEffect, useRef, useState} from 'react'
import Image from 'next/image'
//redux 
import { useAppSelector, useAppDispatch } from '@app/_hooks/redux_hooks'
//icons
import play from '@app/_assets/icons/video_play_icon.svg'
import playSm from '@app/_assets/icons/play_icon.svg'
import pause from '@app/_assets/icons/video_pause_icon.svg' //later will use
import pauseSm from '@app/_assets/icons/pause_icon.svg' // later will use
import windBack from '@app/_assets/icons/wind_back_icon.svg'
import windForward from '@app/_assets/icons/wind_forward_icon.svg'
import fullScreenIcon from '@app/_assets/icons/fullscreen_icon.svg'
import volumeIcon from '@app/_assets/icons/video_volume_icon.svg'
import mutedFilled from '@app/_assets/icons/muted_filled.svg'
//styles
import classNames from 'classnames/bind'
import styles from './video.module.scss'
//lib
import Modal from '@app/_compLibrary/Modal'
import Input from '@app/_compLibrary/Input'
import Volume from '@app/_components/icons/volume/icon'
import { formatDurationDisplay, handleBufferProgress } from '@app/_utils/helpers'
import useClickOutside from '@app/_hooks/useOutClick'

interface VideoPlayerProps {}

const cn = classNames.bind(styles)
const VideoPlayer = () => {
  const dispatch = useAppDispatch()
  const videoRef:any = useRef(null)
  const progressBarRef:any = useRef(null)
  const playAnimationRef:any = useRef(null)
  const volumeRef:any = useRef(null)
  const toggle_volume:any = useRef(null)
  const [show] = useClickOutside(volumeRef,toggle_volume, 'mousedown')

  const [volume, setVolume] = useState<number>(50);
  const [timeProgress, setTimeProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [buffered, setBuffered] = useState<number>(0);
  const [progressPlayed, setProgressPlayed] = useState<string>('0');
  const [progressBuffered, setProgressBuffered] = useState<string>('0');
  const [goFullscreen, setGoFullscreen] = useState<boolean>(false)
  const [hideContent, setHideContent] = useState<boolean>(false)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)

  //redux states 
  const openPlayer = useAppSelector(state => state.mediaReducer.openVideoPlayer)
  const currentVideo = useAppSelector(state => state.mediaReducer.currentVideoData)
  const currentVideoIndex = useAppSelector(state => state.mediaReducer.currentVideoIndex)


  const repeat = useCallback(() => {
    const currentTime = videoRef?.current?.currentTime;
    setTimeProgress(currentTime);
    setProgressPlayed((progressBarRef.current?.value / duration ).toString())
    setProgressBuffered(((isNaN(buffered / duration) ? 0 : buffered / duration)).toString())
    if(progressBarRef.current){
      progressBarRef.current.value = currentTime !== undefined ? currentTime : 0;
      playAnimationRef.current = requestAnimationFrame(repeat); 
    }
  }, [videoRef, duration, buffered, progressBarRef, setTimeProgress])
  // console.log('progressBuffered',progressBuffered)

  useEffect(() => {
    if(openPlayer && goFullscreen)
      setGoFullscreen(false)
  }, [openPlayer])

  useEffect(() => {
    if (isPlaying) {
      videoRef?.current?.play();
    } else {
      videoRef?.current?.pause();
    }
    playAnimationRef.current = requestAnimationFrame(repeat);
  }, [isPlaying, videoRef, repeat])
  //for the volume of video
  useEffect(() => {
    if (videoRef && videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume, videoRef]);

  // to update volume track
  useEffect(() => {
    if(volumeRef){
      volumeRef?.current?.style?.setProperty(
        '--volume-progress', 
        `${volume}%`
      );
      volumeRef?.current?.style?.setProperty(
        '--volume-bg', 
        `${volume < 100 ? '#FFFFFF' : 'var(--main-color-orange)'}`
      )
    }
  }, [volume, openPlayer])

  /// autohide content after 10sec
  useEffect(() => {
    if(!hideContent && isPlaying){
        const interval = setInterval(() => {
          setHideContent(true)
        }, 10000)

        return () => clearInterval(interval)
    }
  }, [hideContent, isPlaying])

  const stopPropagation = (e:any) => {
    e.stopPropagation()
  }

  const handleMuteUnmute = (e: any) => {
    if (!videoRef.current) return;
    stopPropagation(e)
    if (videoRef?.current?.volume !== 0) {
      videoRef.current.volume = 0;
      setVolume(0)
    } else {
      videoRef.current.volume = 1;
      setVolume(15)
    }
  };
  const handleVolumeFull = (e: any) => {
    if (!videoRef.current) return;
    stopPropagation(e)
    videoRef.current.volume = 1;
    setVolume(100)
  }

  const handleProgressChange = () => {
    if (videoRef && videoRef.current)
        videoRef.current.currentTime = progressBarRef.current.value;
  };
  const handleLoadedMetadata = () => {
    const seconds = videoRef.current.duration;
    setDuration(seconds);
    progressBarRef.current.max = seconds;
  };

  const rewind = (e: MouseEventHandler<HTMLImageElement> | any) => {
    stopPropagation(e)
    const video = videoRef.current;
    video.currentTime -= 10;
  };

  const forward = (e: MouseEventHandler<HTMLImageElement> | any) => {
    stopPropagation(e)
    const video = videoRef.current;
    video.currentTime += 10;
  };
  
  return (
    <div>
        {/* <Modal
          isOpen={openPlayer}
          // close={() => dispatch(MediaAction.closeVideoPlayer())}
          onExitFullScreen={() => setGoFullscreen(false)}
          fullScreen={goFullscreen}
          className={cn({
            videoModal: true, 
            darkEffect: !hideContent
          })}
          onDblClick={() => setGoFullscreen(!goFullscreen)}
          onClick={() => setHideContent(!hideContent)}
          hideClose={hideContent}
        >
        <video 
          ref={videoRef} 
          className={styles.video}
          onLoadedMetadata={handleLoadedMetadata}
          onTimeUpdate={e => setBuffered(handleBufferProgress(e))}
          onProgress={e => setBuffered(handleBufferProgress(e))}
        >
          <source src={currentVideo[currentVideoIndex]?.src ?? ""} type="video/mp4"/>
        </video>
          <div className={cn({
            header: true, 
            hide: hideContent
          })}>
            <h1 className={styles.title}>{currentVideo[currentVideoIndex]?.title ?? ""}</h1>
            <h1 className={styles.author}>{currentVideo[currentVideoIndex]?.description ?? ""}</h1>
          </div>
          
          <div  className={cn({
            center_controls: true, 
            hide: hideContent
          })}>
            <Image 
              src={windBack} alt='windBack' 
              className={styles.rewind}
              onClick={rewind}
            />
            <Image src={isPlaying ? pause : play} 
              alt='play/pause' 
              className={styles.playPause} 
              onClick={(e) => {
                stopPropagation(e)
                setIsPlaying(!isPlaying)
                // setHideContent(true)
              }}
            />
            <Image 
              src={windForward} alt='windForward' 
              className={styles.rewind}
              onClick={forward}
            />
          </div>

          <div onClick={stopPropagation} className={cn({
            bottom_controls: true, 
            hide: hideContent
          })}>
            <Image 
              src={isPlaying ? pauseSm : playSm} 
              alt='playSm' 
              className={styles.playPause}
              onClick={(e) => {
                stopPropagation(e)
                setIsPlaying(!isPlaying)
                // setHideContent(true)
              }}
            />
            <div className={styles.progress_container}>
              <p>{formatDurationDisplay(timeProgress)}</p>
              <div className={styles.progress}>

                <Input 
                  type='range'
                  removeDefaultBg
                  removeDefaultWidth
                  className={styles.range}
                  ref={progressBarRef}
                  onChange={handleProgressChange}
                />      
                <progress value={progressPlayed} className={styles.progressPlayed}></progress> 
                <progress value={progressBuffered} className={styles.progressBuffered}></progress> 
              </div>
              <p>{formatDurationDisplay(duration)}</p>
            </div>
            <div className={styles.theRight_side}>
                <div className={styles.volume}>
                  <div className={cn({
                    volume_controls: true, 
                    showVolumeSetter: show
                  })}>
                    <Image src={mutedFilled} alt='muted' className={styles.mute} onClick={handleMuteUnmute}/>
                    <Input 
                       ref={volumeRef}
                       type='range'
                       aria-label="volume"
                       name="volume"
                       min={0}
                       step={0.05}
                       max={100}
                       removeDefaultBg
                       removeDefaultWidth
                       value={volume}
                       onChange={(e) => {
                         // if(!audioRef.current) return; optional
                         setVolume(parseInt(e.target.value))
                       }}
                       className={styles.volume_range}
                    />  
                    <Volume 
                      volume={volume} 
                      className={styles.unmute} 
                       onClick={handleVolumeFull}
                    />
                  </div>
                  <Image src={volumeIcon} alt='volumeIcon' className={styles.volume_icon}  ref={toggle_volume}/>
                </div>
                <Image src={fullScreenIcon} alt='fullScreenIcon' className={styles.fullScreen} onClick={(e) => {
                  setGoFullscreen(!goFullscreen)
                  if(!hideContent && isPlaying)
                    setHideContent(true)
                }}/>
            </div>
          </div>
        </Modal> */}
    </div>
  )
}

export default VideoPlayer