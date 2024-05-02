import React, {useCallback, useMemo, useRef, useState} from 'react'
import Image from 'next/image'
import CustomLink from '@components/CustomLink/CustomLink';
//icons 
import PlaySm from '../icons/playExtraSm/icon'
import EqualizerI from '@app/_assets/lottie/equalizer.json'
//styles
import styles from './SongList.module.scss'
import classNames from 'classnames/bind'
//types
import Songs from '@app/_api/types/queryReturnTypes/Songs'
import HeartIcon from '../icons/heart/icon'
import More from '../icons/moreSm/icon'
import useClickOutside from '@app/_hooks/useOutClick'
import SongActions from '../SongActions/SongActions'
//redux 
import { useAppSelector } from '@app/_hooks/redux_hooks'
//comp
import LottieI from '../Lottie/LottieI'
import Bottomsheet from '../Bottomsheet/Bottomsheet'
import useWindowSize from '@app/_hooks/useWindowSize'
import Preloader from '@app/_compLibrary/Preloader'

import { CheckObjOrArrForNull } from '@app/_utils/helpers'
import InfoSmI from '../icons/infoSm/icon';
import ShareSmI from '../icons/shareSm/icon';
import ReadMoreI from '../icons/readMore/icon';

interface SongListProps {
    data: Songs['rows'] | any
    artistId?: string 
    className?: string
    onPlay: (index: number) => void
    onLike?: (id: string) => void 
    onShowInfo?: (id: string) => void
    onShare?: () => void
    fetchStatuses:{
        isLoading: boolean, isError: boolean
    }
    hideHeader?: boolean
    hideLike?: boolean
    isResponsive?: boolean
}
const cn = classNames.bind(styles)
const SongList = React.forwardRef<HTMLDivElement, SongListProps>((props, ref): JSX.Element => {
    const {
        data, 
        artistId = "", 
        className = "",
        onPlay, 
        onLike, 
        onShowInfo, 
        fetchStatuses,
        hideHeader = false, 
        hideLike = false, 
        isResponsive = false
    } = props

    const toggleActionsRef:any = useRef(null)
    const actionsContentRef: any = useRef(null)
    const [showActions, setShowActions] = useClickOutside(actionsContentRef, toggleActionsRef, 'click')
    const [width] = useWindowSize()
    const [showBottomsheet, setShowBottomsheet] = useState<boolean>(false)
    const [hoveredIndex, setHoveredIndex] = useState<string>("")
    const [toggleI, setToggleI] = useState<string>("")

    //redux states
    const songData = useAppSelector(state => state.mediaReducer.songData)
    const songIndex = useAppSelector(state => state.mediaReducer.songIndex)
    const isSongPlaying = useAppSelector(state => state.mediaReducer.isSongPlaying)
    const runningSongId = useMemo(() => songData[songIndex]?.id,[songData, songIndex])
    const renderEqualizer = useCallback((song: any, responsive = false) => {
        const styles = cn({responsive: responsive})
        const isEqual = isSongPlaying && runningSongId === song.id

        return <>
        {
            isEqual ? (
                <div className={styles}>
                    <LottieI width={20} height={20} icon={EqualizerI} />
                </div>
            ) : ""
        }
        </>
    }, [runningSongId, isSongPlaying, EqualizerI])



    const header = [
        '#', 'Ady', 'Albom', "Hereketler", 
    ]
    const actionsData = [
        {
            value: 'info', 
            label: {ru: 'Maglumat', tk: 'Maglumat'}, 
            icon: <InfoSmI />
        }, 
        {
            value: 'share', 
            label: {ru: 'Paylasmak', tk: 'Paylasmak'}, 
            icon: <ShareSmI />
        }, 
        {
            value: 'queue', 
            label: {ru: 'Indiki aydyma gos', tk: 'Indiki aydyma gos'}, 
            icon: <ReadMoreI />
        }, 
    ]

    const stopPropagation = (e: any) => e.stopPropagation();
    

  return (
    <div className={`${styles.songs} ${className}`}>
        {
            !hideHeader && !isResponsive && CheckObjOrArrForNull(data) ? (
                <div className={styles.songsHeader}>
                    {header.map((col, index) => (
                        <div className={styles.col} key={index}>
                            {col}
                        </div>
                    ))}
                </div>
            ) : ""
        }

        <div className={styles.songsBody}>
            {
                data?.map((song: any, index: number) => (
                    <div ref={ref} className={styles.box} key={song.id} onClick={() => onPlay && onPlay(index)} onMouseEnter={() => setHoveredIndex(song.id)} onMouseLeave={() => setHoveredIndex("")}>

                        <div className={cn({
                            row: index > 0, 
                        })}>
                            <div className={cn({
                                listRow: true, 
                                activeBg: runningSongId === song.id, 
                                isResponsive: isResponsive
                            })}>

                                <div className={styles.colNumber}>
                                    {renderEqualizer(song)}
                                    <div className={cn({
                                        notVisible: true, 
                                        visible: (runningSongId !== song.id && hoveredIndex !== song.id)
                                    })}>{index + 1}</div>
                                    <PlaySm 
                                        className={cn({
                                            notVisible: true, 
                                            visible: ((runningSongId !== song.id || runningSongId == song.id && !isSongPlaying)  && hoveredIndex === song.id), 
                                            stayActive: !isSongPlaying && runningSongId === song.id
                                        })}
                                        mode='play'
                                    />
                                </div>
                                <div className={styles.colMusic}>
                                    <div className={styles.music}>
                                        <div className={styles.musicImage}>
                                            <Image src={song.cover} alt='cover' width='400' height='400'/>
                                        </div>
                                        <div className={styles.musicContent}>
                                            <div className={styles.musicTitleWrapper}>
                                                {renderEqualizer(song, true)}
                                                <div className={cn({ title: true, paddLeft: isSongPlaying && songData[songIndex]?.id === song.id })}>
                                                    <CustomLink  href={``}>{song.title}</CustomLink>
                                                </div>
                                            </div>
                                            <div className={styles.description}>
                                                <CustomLink onClick={stopPropagation} href={`/artist/${song.artistId ?? artistId}`}>{song.description}</CustomLink>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className={styles.colAlbum}>
                                    <div className={styles.album}>
                                        <CustomLink href={``}>{song.title}</CustomLink>
                                    </div>
                                </div>

                                <div className={styles.colActions}>
                                    <div className={styles.actions}>

                                        {
                                            !hideLike && 
                                            <HeartIcon active={song?.isLiked ?? false} onClick={(e) => {
                                                e.stopPropagation()
                                                if(onLike) onLike(song.id)
                                            }} className={styles.heart}/>
                                        }
                                        <div className={styles.duration}>{song?.duration}</div>
                                        <More 
                                            ref={toggleActionsRef}
                                            onClick={() => {
                                                if(width <= 768) {
                                                    setToggleI(song.id)
                                                    if(toggleI === song.id) setShowBottomsheet(!showBottomsheet)
                                                    else setShowBottomsheet(true)

                                                }else {
                                                    setToggleI(song.id)
                                                    if(toggleI === song.id) setShowActions(!showActions)
                                                    else setShowActions(true)
                                                }
                                            }}
                                        />
                                    </div>

                                    <SongActions 
                                        ref={actionsContentRef}
                                        actionsData={actionsData}
                                        open={showActions && toggleI === song.id}
                                        close={() => setShowActions(false)}
                                        onClick={(value) => {
                                            if(value === 'info' && onShowInfo) onShowInfo(song?.id)
                                            setShowActions(false)
                                        }}
                                    />

                                    <Bottomsheet 
                                        actionsData={actionsData}
                                        open={showBottomsheet && toggleI === song.id}
                                        close={() => setShowBottomsheet(false)}
                                        onClick={(value) => {
                                            if(value === 'info' && onShowInfo) onShowInfo(song?.id)
                                            setShowBottomsheet(false)
                                        }}
                                    />
                                </div>
                            
                            </div>
                        </div>
                    </div>
                ))
            }
        </div>
    </div>
  )
})

export default SongList




        {/* {
            fetchStatuses?.isLoading ? <span className={styles.loader}><Preloader /></span>
             : fetchStatuses.isError ? "Not found" : 
            
            data?.map((song: any, index: number) => (
                <div key={song.id} className={cn({
                    song: true, 
                    active: runningSongId === song.id
                })} onClick={() => onPlay && onPlay(index)} onMouseEnter={() => setHoveredIndex(song.id)} onMouseLeave={() => setHoveredIndex("")}>
                    <div className={styles.the_left}>
                        <div className={styles.indexation}>
                            {isSongPlaying && runningSongId === song.id && <LottieI width={20} height={20} icon={EqualizerI} />}
                            <span className={cn({
                                index: true, 
                                notVisible: true, 
                                visible: (runningSongId !== song.id && hoveredIndex !== song.id)
                            })}>{index + 1}</span>
                          
                        </div>
                        <div className={styles.initial_content}>
                            <Image src={song?.cover} alt='artist' width='400' height='400'/>
                            <div className={styles.song_content}>
                                <Link href={`/artist/12`} className={styles.artist}>
                                    {song.title}
                                </Link>
                                <Link href={'/song/12'} className={styles.songName}>
                                    {song.description}
                                </Link>
                            </div>
                        </div>
                    </div>

                    <Link href={'/artist/12'} className={styles.the_center}>
                        <div>{song.description}</div>
                    </Link>

                    <div className={styles.the_right}>
                        <HeartIcon active={song?.isLiked ?? false} onClick={(e) => {
                            e.stopPropagation()
                            if(onLike) onLike(song.id)
                        }} className={styles.heart}/>
                        <div className={styles.duration}>{song?.duration}</div>
                        <More 
                            ref={toggleActionsRef}
                            onClick={() => {
                                if(width <= 768) {
                                    setShowBottomsheet(!showBottomsheet)
                                }else {
                                    setToggleI(song.id)
                                    if(toggleI === song.id) setShowActions(!showActions)
                                    else setShowActions(true)
                                }
                            }}
                        />
                    </div>

                    <SongActions 
                        ref={actionsContentRef}
                        open={showActions && toggleI === song.id}
                        close={() => setShowActions(false)}
                        onClick={(value) => {
                            if(value === 'info' && onShowInfo) onShowInfo(song?.id)
                            setShowActions(false)
                        }}
                    />

                    <Bottomsheet 
                        open={showBottomsheet}
                        close={() => setShowBottomsheet(false)}
                        onClick={(value) => {
                            if(value === 'info' && onShowInfo) onShowInfo(song?.id)
                            setShowBottomsheet(false)
                        }}
                    />
                </div>
            ))
        } */}