import React, {useState, useEffect, useCallback, useRef, Ref, useMemo} from 'react'
import Image from 'next/image';
// images
import artist from '@app/_assets/images/player_artist.png';
import SimplePlayI from '@components/icons/simplePlay/icon';
import PlayPauseSm from '@components/icons/playsm/icon';
import Heart from '@components/icons/heart/icon';
import BackAndForth from '@components/icons/backandforth/icon';
import ShuffleI from '@components/icons/shuffle/icon';
import RepeatI from '@components/icons/repeat/icon';
import TextI from '@components/icons/text/icon';
import Volume from '@components/icons/volume/icon';
// import Device from '@components/icons/device/icon';
import List from '@components/icons/list/icon';
import ArrowBottomI from '@components/icons/arrowBottom/icon';
import MoreSm from '@components/icons/moreSm/icon';
import Equalizer from '@app/_assets/lottie/equalizer.json';
import LottieI from '@components/Lottie/LottieI';
//styles
import classNames from 'classnames/bind';
import styles from './audio.module.scss';
//lib
import Input from '@compLibrary/Input';
//hooks
import { useAppDispatch, useAppSelector } from '@hooks/redux_hooks';
import useClickOutside from '@hooks/useOutClick';
//redux
import { setCurrentSong, setIsSongPlaying, setSongIndex, setIsShuffle, shuffle, addToQueue } from '@redux/reducers/MediaReducer';
import { setShowAuthModal } from '@redux/reducers/AuthReducer';
import { setIsBlockOverflow } from '@redux/reducers/OverflowReducer';
//comps
import Bottomsheet from '@components/Bottomsheet/Bottomsheet'
import InfoMenu from '@components/InfoMenu/InfoMenu';
//hooks
import useWindowSize from '@hooks/useWindowSize';
import { isAuthorized, isEmpty, isUndefined, randomize } from '@utils/helpers';
//HLS 
import HLS from 'hls.js'  
//api
import { likeSong } from '@api/Queries/Post';
//utils
import CustomLink from '@components/CustomLink/CustomLink';
import InfoSmI from '@app/_components/icons/infoSm/icon';
import ShareSmI from '@app/_components/icons/shareSm/icon';
import ReadMoreI from '@app/_components/icons/readMore/icon';
import Song from '@app/_api/types/queryReturnTypes/Song';

function handleBufferProgress(e: any) {
  const audio = e.currentTarget;
  const dur = audio.duration;
  if (dur > 0) {
    for (let i = 0; i < audio.buffered.length; i++) {
      if (
        audio.buffered.start(audio.buffered.length - 1 - i) < audio.currentTime
      ) {
        const bufferedLength = audio.buffered.end(
          audio.buffered.length - 1 - i,
        );
        return bufferedLength;
      }
    }
  }
};

function formatDurationDisplay(duration: number) {
  const min = Math.floor(duration / 60);
  const sec = Math.floor(duration - min * 60);
  const formatted = [min, sec].map((n) => (n < 10 ? "0" + n : n)).join(":"); // format - mm:ss
  if(formatted === 'NaN:NaN')
    return "00:00"
  return formatted;
}


interface AudioPlayerProps {
  toggleSideMenuRef: Ref<SVGSVGElement> 
  onToggleLyrics: () => void
  showSideMenu: boolean
  showLyricsMenu: boolean
}


const cn = classNames.bind(styles)
const AudioPlayer = (props: AudioPlayerProps) => {
  const {
    toggleSideMenuRef,
    onToggleLyrics,  
    showSideMenu, 
    showLyricsMenu, 
  } = props
  const dispatch = useAppDispatch()
  //references
  const audioRef:any = useRef(null)
  const volumeRef:any = useRef(null)
  const desktopRef: any =  useRef(null)
  const laptopRef: any =useRef(null)
  const mobileRef:any = useRef(null)
  const lyricsRef:any = useRef(null)

  const toggleMenuRef:any = useRef(null)
  const menuRef:any = useRef(null)
  const [showMenu, setShowMenu] = useClickOutside(menuRef, toggleMenuRef, 'mousedown')
  const [width] = useWindowSize()
  
  const [showMobPlaylist, setShowMobPlaylist] = useState<boolean>(false)
  const [showMobLyrics, setShowMobLyrics] = useState<boolean>(false)
  const [showBottomsheet, setShowBottomsheet] = useState<boolean>(false)
  const [prevSongUrl, setPrevSongUrl] = useState<string>("")
  const [addToQueueSong, setAddToQueueSong] = useState<Song>()


  const [timeProgress, setTimeProgress] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [buffered, setBuffered] = useState<number>(0);
  const [progressPlayed, setProgressPlayed] = useState<string>('0');
  const [progressBuffered, setProgressBuffered] = useState<string>('0');
  const [volume, setVolume] = useState<number>(50);
  const [showPlayer, setShowPlayer] = useState<boolean>(false)
  const [isLiked, setLiked] = useState<boolean>(false)
  const [isRepeat, setIsRepeat] = useState<boolean>(false)
  const [continueAfterAll, setContinueAfterAll] = useState<boolean>(true)
  
  //redux states 
  const isPlayerOpen = useAppSelector(state => state.mediaReducer.isAudioPlayerOpen)
  const songs = useAppSelector(state => state.mediaReducer.songData)
  const songIndex = useAppSelector(state => state.mediaReducer.songIndex)
  const isSongPlaying = useAppSelector(state => state.mediaReducer.isSongPlaying)
  const isShuffle = useAppSelector(state => state.mediaReducer.isShuffle)
  const song = useMemo(() => songs?.[songIndex],[songs, songIndex]) 

  useEffect(() => {
    if(HLS.isSupported() && !isUndefined(audioRef?.current)){
      const audio = audioRef.current;
      const hls = new HLS();
      console.log('song link', song?.link)
      if(song?.link !== prevSongUrl){       
        hls.attachMedia(audio);
        hls.on(HLS.Events.MEDIA_ATTACHED, () => {
          hls.loadSource(song?.link); 
          // hls.on(HLS.Events.ERROR, (event, err) => console.log(err));
        })
      }

      if(isSongPlaying) audio?.play();
      setPrevSongUrl(song?.link)
    }
  }, [audioRef, song])

  useEffect(() => {
    if (isSongPlaying) {
      audioRef?.current?.play();
    } else {
      audioRef?.current?.pause();
    }
  }, [isSongPlaying, audioRef])

  useEffect(() => {
    setProgressPlayed((timeProgress / duration).toString());
    setProgressBuffered(((isNaN(buffered / duration) ? 0 : buffered / duration)).toString());
  }, [duration, buffered, timeProgress])

  ///audio volume css
  useEffect(() => {
    if(volumeRef?.current){
      volumeRef.current?.style?.setProperty(
        '--volume-progress', 
        `${volume}%`
      );
    }
  }, [volume])
  
  ///audio volume
  useEffect(() => {
    if(audioRef && audioRef?.current) {
      audioRef.current.volume = volume / 100
    }
  },[audioRef, volume])

  useEffect(() => {
    if(showMobPlaylist && showMobLyrics) setShowMobLyrics(false)
  }, [showMobPlaylist])


  useEffect(() => {
    if(showMobLyrics && showMobPlaylist) setShowMobPlaylist(false)
  }, [showMobLyrics])

  useEffect(() => {
    if(isLiked) setLiked(false)
  }, [song])

  //hot keys
  useEffect(() => {
    const handleKeyDown = (event: any) => {

      if(!isUndefined(audioRef?.current))
        switch (event.key) {
          case ' ':
            event.preventDefault()
            dispatch(setIsSongPlaying(!isSongPlaying))
            break;
          case 'ArrowLeft': 
            audioRef.current.currentTime = Math.max(timeProgress - 5, 0);
            setTimeProgress(Math.max(timeProgress - 5, 0))
            break;
          case 'ArrowRight':
            audioRef.current.currentTime = Math.max(timeProgress + 5, 0);
            setTimeProgress(Math.max(timeProgress + 5, 0))
            break;
          case 'ArrowUp':
            event.preventDefault()
            setVolume(Math.min(volume + 5, 100))
            break;
          case 'ArrowDown':
            event.preventDefault()
            setVolume(Math.max(volume - 5, 0))
            break;
          case 's': 
            toggleShuffle()
            break;
          case 'r': 
            if(isRepeat) {
              setIsRepeat(false)
              setContinueAfterAll(false)
            }else if(continueAfterAll){
              setContinueAfterAll(false)
              setIsRepeat(true)
            }else {
              setIsRepeat(false)
              setContinueAfterAll(true)
            }
            break;
          default:
            break;
        }
    }
    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    audioRef, 
    isSongPlaying,
    timeProgress, 
    isShuffle, 
    isRepeat, 
    continueAfterAll, 
    songs, 
    volume
  ])

  useEffect(() => {
    if(showPlayer) dispatch(setIsBlockOverflow(true))
    else dispatch(setIsBlockOverflow(false))
  }, [showPlayer])

  const toggleShuffle = useCallback(() => dispatch(setIsShuffle(!isShuffle)),[isShuffle])

  const openMenu = useCallback((value: string) => {
    if(value === 'info') {
      setShowMenu(true)
    }else if(value === 'queue'){
      dispatch(addToQueue(addToQueueSong))
    }
    setShowBottomsheet(false)
  }, [addToQueueSong])

  const openBottomSheet = useCallback((song:Song) => {
    setAddToQueueSong(song)
    setShowBottomsheet(!showBottomsheet)
  }, [showBottomsheet])

  const handleNext = useCallback(() => {
    if(isUndefined(audioRef?.current)) return 
    if(isRepeat) audioRef?.current?.play()
    else if(isShuffle) {
      if(songIndex >= songs.length - 1) dispatch(setSongIndex(0))
      else dispatch(shuffle(randomize(songs?.length)))
    }else if(songIndex >= songs?.length - 1) dispatch(setSongIndex(0))
    else dispatch(setSongIndex(songIndex + 1))
  }, [
    songs, 
    songIndex, 
    isRepeat, 
    isShuffle,
    audioRef
  ])

  const handlePrevious = useCallback(() => {
    if(isUndefined(audioRef?.current)) return 
    if(isShuffle){
      if(songIndex >= songs.length - 1) dispatch(setSongIndex(0))
      else dispatch(shuffle(randomize(songs?.length)))
    }else if(songIndex === 0) dispatch(setSongIndex(songs?.length - 1))
    else dispatch(setSongIndex(songIndex - 1))
  }, [
    songs,
    songIndex,  
    audioRef, 
    isShuffle,
  ])

  const handleProgressChange = useCallback(() => {
    if (audioRef?.current){
      if(width <= 768 && showPlayer){
        audioRef.current.currentTime = mobileRef.current.value
        setTimeProgress(mobileRef.current.value);
      }else if(width <= 768 && !showPlayer){
        audioRef.current.currentTime = laptopRef.current.value
        setTimeProgress(laptopRef.current.value);
      }else {
        audioRef.current.currentTime = desktopRef.current.value
        setTimeProgress(desktopRef.current.value);
      }
    }
  }, [audioRef, desktopRef, laptopRef, mobileRef, width, showPlayer])

  const handleLoadedMetadata = useCallback(() => {
    if(!isUndefined(audioRef?.current))
      setDuration(audioRef?.current?.duration)

  }, [audioRef])

  const handleMuteUnmute = useCallback(() => {
    if(volume > 0){
      setVolume(0)
    }else 
      setVolume(50)
  },[audioRef, volume])

  const progressBar = useCallback((ref:any) => (
    <div className={cn({
      progressBar: true, 
      mobilePlayerProgress: showPlayer
    })}>
      {
        showPlayer ? (
          <div className={styles.mobPlayerProgressWrapper}>
              <div className={styles.progressField}>
                <Input 
                  type='range'
                  removeDefaultBg
                  removeDefaultWidth
                  className={styles.range}
                  ref={ref}
                  onChange={handleProgressChange}
                  onClick={e => e.stopPropagation()}
                  onMouseDown={e => e.stopPropagation()}
                  min={0}
                  max={duration}
                  value={timeProgress}
                />
                <progress className={styles.progressBuffered} value={progressBuffered}></progress>
                <progress className={styles.progressPlayed} value={progressPlayed}></progress>
              </div>

              <div className={styles.mobPlayerTimer}>
                <div>{formatDurationDisplay(timeProgress)}</div>
                <div>{formatDurationDisplay(duration)}</div>
              </div>
          </div>
        ) : (
          <>
            <div className={styles.timeProgress}>{formatDurationDisplay(timeProgress)}</div>
            <div className={styles.progressField}>
              <Input 
                type='range'
                removeDefaultBg
                removeDefaultWidth
                className={styles.range}
                ref={ref}
                onChange={handleProgressChange}
                onClick={e => e.stopPropagation()}
                onMouseDown={e => e.stopPropagation()}
                value={timeProgress}
                min={0}
                max={duration}
              />
              <progress className={styles.progressBuffered} value={progressBuffered}></progress>
              <progress className={styles.progressPlayed} value={progressPlayed}></progress>
            </div>
            <div className={styles.timeProgress}>{formatDurationDisplay(duration)}</div>
          </>
        )
      }
    </div>
  ), [
    timeProgress, 
    duration,
    desktopRef, 
    laptopRef, 
    mobileRef, 
    progressBuffered, 
    progressPlayed, 
    showPlayer
  ])
  const backForthI = (direction: 'back' | 'forward') => (
    <BackAndForth direction={direction} onClick={() => {
      if(direction === 'forward') {
        if(songIndex >= songs.length - 1) dispatch(setSongIndex(0))
        else dispatch(setSongIndex(songIndex + 1))
        handleNext()
      }
      else handlePrevious()
    }}
    className={cn({
      setOpacity: !continueAfterAll && !isRepeat && (songIndex === 0 && direction === 'back' || songIndex === songs.length - 1 && direction === 'forward') 
    })} 
    />
  )
  const handleLikeSong = useCallback(async () => {
    try {
      if(isUndefined(audioRef?.current)) return 
      if(!isAuthorized()) return dispatch(setShowAuthModal(true))
      
      const response = await likeSong(song?.id)
      if(response.success && response.statusCode === 200)
      setLiked(!isLiked)
      return {success: true}
    } catch (error) {
      console.log('like error',error)
      return {success: false}
    }
  }, [
    audioRef, 
    song, 
    isLiked, 
    isAuthorized
  ])
  const playPauseI = useMemo(() => (
    <SimplePlayI 
      onClick={() => dispatch(setIsSongPlaying(!isSongPlaying))} 
      mode={isSongPlaying ? 'pause' : 'play'}
    />
  ),[isSongPlaying])
  const heartI = useMemo(() => (
    <Heart active={isLiked} 
      onClick={async () => {
        const response = await handleLikeSong()
      }}
    />
  ), [isLiked, song, isAuthorized])
  const repeatI = useMemo(() => (
    <RepeatI 
      onRepeat={() => {
        setContinueAfterAll(false)
        setIsRepeat(true)
      }}
      onRelease={() => {
        setIsRepeat(false)
        setContinueAfterAll(false)
      }}
      onContinueAfterall={() => setContinueAfterAll(true)}
      repeat={isRepeat}
      repeatAfterall={continueAfterAll}
    />
  ),[
    isRepeat, 
    continueAfterAll, 
  ])
  const infoMenu = useMemo(() => (
    <InfoMenu 
      ref={menuRef}
      fetchMode='song'
      id={addToQueueSong?.id as string}
      show={showMenu}
      close={() => setShowMenu(false)}
    />
  ), [menuRef, addToQueueSong?.id, showMenu, setShowMenu])
  
  const actionsData = [
    {
        value: 'info', 
        label: {ru: 'Информация', tm: 'Maglumat'}, 
        icon: <InfoSmI />
    }, 
    {
        value: 'share', 
        label: {ru: 'Поделиться', tm: 'Paýlaşmak'}, 
        icon: <ShareSmI />
    }, 
    {
        value: 'queue', 
        label: {ru: 'Добавить в очередь', tm: 'Indiki aýdyma goş'}, 
        icon: <ReadMoreI />
    }, 
  ]

  return (
    <>
      {
        isPlayerOpen ? 
        <div>
          {infoMenu}
          <div className={styles.audioWrapper} >
            {
              !isUndefined(song?.link) ? (
                <audio 
                  ref={audioRef}
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={(e) => {
                    setTimeProgress(e.currentTarget.currentTime);
                    setBuffered(handleBufferProgress(e))
                  }}
                  onProgress={e => setBuffered(handleBufferProgress(e))}
                  onEnded={handleNext}
                />
              ) : ""
            }

            <div className={styles.content}>
              <div className={styles.musicInfo}>
                <div className={styles.artistInfo}>
                  <div className={styles.songImg} >
                    <Image 
                      src={song?.cover ?? ""} 
                      alt='artist' 
                      width='400' 
                      height='400' 
                    />
                  </div>
                  <div className={styles.songInfo}>
                    <div className={styles.song}>
                      <CustomLink href=''>
                        {song?.title}
                      </CustomLink>
                    </div>
                    <p>
                      <CustomLink href={`/artist/${song.artistId}`} onClick={e => e.stopPropagation()}>
                        {song?.description}
                      </CustomLink>
                    </p>
                  </div>
                </div>

                <div className={styles.actions}>
                  {heartI}
                </div>

              </div>

              <div className={styles.controls}>
                <div className={styles.actions}>
                  <ShuffleI active={isShuffle} onClick={toggleShuffle}/>
                  {backForthI('back')}
                  {playPauseI}
                  {backForthI('forward')}
                  {repeatI}
                </div>

                {progressBar(desktopRef)}
              </div>

              <div className={styles.otherControls}>
                <List active={showSideMenu} ref={toggleSideMenuRef}/>
                <TextI 
                  active={showLyricsMenu} 
                  noLyricFound={isEmpty(song?.lyrics)}
                  onClick={onToggleLyrics}
                />
                <Volume volume={
                  volume >= 70 ? 'up' : 
                  volume > 0 ? 'down' : 'mute'
                }
                onClick={handleMuteUnmute}
                />
                <Input 
                  type='range'
                  removeDefaultBg
                  removeDefaultWidth
                  className={styles.volume}
                  ref={volumeRef}
                  onChange={(e) => setVolume(parseInt(e.target.value))}
                  value={volume}
                />
              </div>
            </div>


            <div className={styles.mobileContent}  onClick={(e) => setShowPlayer(!showPlayer)}>
              {progressBar(laptopRef)}

              <div className={styles.mobileMusicInfo}>

                <div className={styles.artistInfo}> 
                  <div className={styles.songImg}>
                    <Image 
                      src={song?.cover ?? ""} 
                      alt='artist' 
                      width='400' 
                      height='400' 
                    />
                  </div>
                  <div className={styles.songInfo}>
                    <div className={styles.song}>
                      <CustomLink href=''>
                        {song?.title}
                      </CustomLink>
                    </div>
                    <p>
                      <CustomLink href={`/artist/${song.artistId}`} onClick={e => e.stopPropagation()}>
                        {song?.description}
                      </CustomLink>
                    </p>
                  </div>
                </div>

                <div className={styles.mobileActions}>
                 
                  <PlayPauseSm 
                    onClick={() => {
                      dispatch(setIsSongPlaying(!isSongPlaying))
                    }}
                    state={isSongPlaying ? 'pause' : 'play'}
                  />
                   {backForthI('forward')}
                </div>


              </div>
            </div>
          </div>
        
          
          <div className={cn({
            mobilePlayer: true, 
            open: showPlayer,
          })}>

            <div className={cn({topGradient: (showMobPlaylist || showMobLyrics)})}></div>
            
            <div className={styles.mobPlayerWrapper}>
              <Image src={song?.cover ?? artist} alt='artist' width='400' height='400' className={styles.bgGradient}/>

              <div className={styles.mobPlayerContent}>
                  <div className={styles.header}>
                    <ArrowBottomI onClick={() => {
                      setShowPlayer(false)
                      setShowMobPlaylist(false)
                      setShowMobLyrics(false)
                    }}/>
                  </div>

                <div className={cn({
                  mainImg: true, 
                  hide: showMobPlaylist || showMobLyrics
                })}>
                  <Image src={song?.cover ?? artist} alt='artist' width='250' height='250' />
                </div>

                <div className={cn({
                  mobPlaylist: true, 
                  show: showMobPlaylist
                })}>
                  {
                    songs?.map((item, i) => (
                      <div className={cn({
                        item: true, 
                        itemBgActive: song?.id === item.id
                      })} key={item.id} onClick={() => dispatch(setCurrentSong({ data: songs, id: item.id, index: i }))}>
                        <div className={styles.flex1}>
                          
                          <div className={styles.img_container}>
                            <Image src={item.cover ?? artist} alt='artist' width='400' height='400' className={cn({
                                imageActive: song?.id === item.id
                            })}/>
                          </div>

                          <div className={styles.listContent}>
                            <div className={styles.running}>
                                {
                                    isSongPlaying && song?.id === item.id ? 
                                    <LottieI 
                                        icon={Equalizer} 
                                        width={20} 
                                        height={20}
                                        className={styles.equalizer}
                                    /> : ""
                                }
                                <h4 className={cn({paddLeft: isSongPlaying && song?.id === item.id})}>{item.title}</h4>
                            </div>
                            <div>{item.description}</div>
                          </div>

                        </div>
                        <MoreSm 
                          onClick={() => openBottomSheet(item)}
                        />
                      </div>
                    ))
                  }
                </div>


                <div ref={lyricsRef} className={cn({
                  mobLyrics: true, 
                  show: showMobLyrics
                })}>
                    <p>
                    {
                      song?.lyrics?.split('\n').map(item => (
                        <p>{item}</p>
                      ))
                    }
                    </p>
                </div>

                <div className={styles.playerControls}>

                  <div className={styles.topControls}>
                    <div className={styles.songInfo}>
                      <div className={styles.song}>
                        <CustomLink href=''>
                          {song?.title}
                        </CustomLink>
                      </div>
                      <p>
                        <CustomLink href={`/artist/${song.artistId}`} onClick={e => e.stopPropagation()}>
                          {song?.description}
                        </CustomLink>
                      </p>
                    </div>
                    {heartI}
                  </div>


                  <div className={styles.mainController}>
                    {progressBar(mobileRef)}

                    <div className={styles.actions}>
                      <ShuffleI active={isShuffle} onClick={toggleShuffle}/>
                      {backForthI('back')}
                      {playPauseI}
                      {backForthI('forward')}
                      {repeatI}
                    </div>
                  </div>

                  <div className={styles.mobPlayerBottom}>
                    <List active={showMobPlaylist} onClick={() => setShowMobPlaylist(!showMobPlaylist)}/>
                    <TextI 
                      active={showMobLyrics} 
                      onClick={() => {
                        if(!isEmpty(song?.lyrics))
                        setShowMobLyrics(!showMobLyrics)
                      }}
                      noLyricFound={isEmpty(song?.lyrics)}
                    />
                  </div>
                </div>


              </div>

            </div>

            <div className={cn({bottomGradient: showMobPlaylist})}></div>

            <Bottomsheet
              actionsData={actionsData} 
              open={showBottomsheet}
              close={() => setShowBottomsheet(false)}
              onClick={openMenu}
            />

          </div>
        </div> : ""
      }
    </>
  )
}

export default AudioPlayer