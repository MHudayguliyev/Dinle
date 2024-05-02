import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image, { StaticImageData } from 'next/image'
import CustomLink from '@components/CustomLink/CustomLink';

//styles
import classNames from 'classnames/bind'
import styles from './StandardCard.module.scss'
//icons 
import More from '../icons/more/icon'
import PlayPause from '../icons/homePlay/icon'
import close from '@app/_assets/icons/close.svg'
import songFavicon from '@app/_assets/images/song_favicon.png'
import shimmerFavicon from '@app/_assets/images/shimmer-logo.png'
//comp
import SongActions from '../SongActions/SongActions'
//typed hooks
import useClickOutside from '@app/_hooks/useOutClick'
import useWindowSize from '@hooks/useWindowSize'
//redux
import { useAppSelector } from '@app/_hooks/redux_hooks'
//lottie
import LottieI from '@components/Lottie/LottieI';
import Equalizer from '@app/_assets/lottie/equalizer.json'
//icons
import InfoSmI from '../icons/infoSm/icon';
import ShareSmI from '../icons/shareSm/icon';
import ReadMoreI from '../icons/readMore/icon';
import { ActionsType } from '@app/_types';
import PlayExtraSm from '../icons/playExtraSm/icon';
import { isEmpty, isUndefined, secondsToMmSs } from '@app/_utils/helpers';

interface StandardProps {
    id: string
    top10Id?: number
    artistId?: string
    playlistId?: string 
    albomId?: string 
    genreId?: string
    videoId?: string
    newsId?: string
    image?: StaticImageData | string
    onPlay?: (id: string) => void
    onOpenBottomSheet?: () => void
    onOpenInfoMenu?: () => void
    onAddToQueue?: () => void
    title:string
    description?:string
    videoDuration?: number 
    /** @defaultValue false **/
    standard?: boolean
    /** @defaultValue false **/
    artists?: boolean
    /** @defaultValue false **/
    top10?: boolean
    /** @defaultValue false **/
    playlists?: boolean
    /** @defaultValue false **/
    alboms?: boolean
    /** @defaultValue false **/
    videoCard?: boolean
    /** @defaultValue false **/
    newsCard?: boolean
    /** @defaultValue false **/
    showCard?: boolean
    /** @defaultValue false **/
    hideMoreI?: boolean
    /** @defaultValue false **/
    recentSearched?: boolean
    /** @defaultValue false **/
    genres?: boolean
    /** @defaultValue false **/
    shimmer?: boolean
}
const cn = classNames.bind(styles)
const StandardCard = React.forwardRef<HTMLDivElement, StandardProps>((props, ref): JSX.Element => {
    const {
        id,
        top10Id,
        artistId = "",
        playlistId = "",  
        albomId = "", 
        genreId = "",
        videoId = "",
        newsId = "",  
        image, 
        title, 
        description, 
        videoDuration, 
        standard = false, 
        artists = false, 
        top10 = false, 
        hideMoreI = false, 
        recentSearched = false,
        genres = false, 
        playlists = false, 
        alboms = false, 
        videoCard = false, 
        newsCard = false, 
        showCard = false, 
        shimmer = false, 
        onPlay, 
        onOpenBottomSheet, 
        onOpenInfoMenu, 
        onAddToQueue, 
    } = props

    const songData = useAppSelector(state => state.mediaReducer.songData)
    const songIndex = useAppSelector(state => state.mediaReducer.songIndex)
    const isSongPlaying = useAppSelector(state => state.mediaReducer.isSongPlaying)

    const toggleRef:any = useRef(null);
    const contentRef:any = useRef(null)
    const [show, setShow] = useClickOutside(contentRef, toggleRef, 'click')
    const [width] = useWindowSize()

    const stopPropagation = useCallback((e:any) => {
        e.stopPropagation();
    }, [])

    const playSong = useCallback(() => {
        if(onPlay) onPlay(id)
    }, [onPlay])

    const openBottomSheet = useCallback(() => {
        if(width <= 786 && onOpenBottomSheet) onOpenBottomSheet()
    }, [width, onOpenBottomSheet])

    const moreBtn = useMemo(() => (
        <More ref={toggleRef} onClick={openBottomSheet}/>
    ), [width, openBottomSheet])

    const routeMem = useMemo(() => {
        const route = `
            ${artists ? `/artist/${artistId}` : playlists ? `/playlist/${playlistId}` : alboms ? `/album/${albomId}` : 
            genres ? `/genre/${genreId}` : newsCard ? `/news/${newsId}` : videoCard ? `/clips/${videoId}${showCard ? "?type=show" : ""}` : ""}
        `
        return route
    }, [
        id, 
        artistId, 
        playlistId, 
        albomId, 
        genreId, 
        newsId, 
        newsCard,
        artists, 
        genres, 
        alboms, 
        playlists,
        videoCard
    ])

    const actionsData = useMemo(() => {
        const data = [
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

        if(videoCard){
            for(let i = 0; i < data.length; i++){
                const item = data[i]
                if(item.value === 'info' || item.value === 'queue')
                data.splice(i, 1)
            }
        }
        return data
    }, [videoCard])

  return (
   <>
    {
        shimmer ? (
            <div className={styles.shimmer}>
                <div className={cn({
                    the_top: true, 
                    artist_shimmer: artists, 
                    genre_shimmer: genres
                })}>
                    <Image src={shimmerFavicon} alt='shimmerFavicon'/>
                </div>

                <div className={cn({
                    the_bottom: true, 
                    artist_shimmer_bottom: artists, 
                    genre_shimmer_bottom: genres, 
                    playlist_shimmer_bottom: playlists || alboms
                })}>
                    <span></span>
                    <span></span>
                </div>
            </div>
        ) : (
        <div ref={ref} onClick={playSong} className={cn({
                standard_card: !genres, 
                card_with_close: recentSearched,
                card_for_artist: artists,
                card_for_genres: genres, 
                card_for_video: videoCard,
                withActiveBg: (!artists && !genres && !playlists && !alboms && !standard && !videoCard && !top10) || 
                (songData[songIndex]?.id === id), 
                hoverable: !artists && !genres && !videoCard
            })}>
            {
                genres ? (
                    <CustomLink href={`/genre/${id}`}>
                        <div className={styles.genre_image}>
                            <Image src={image!} alt='genre' width='400' height='400'/>
                        </div>
                        <h1>{title}</h1>
                    </CustomLink>
                ) : (
                    <>
                        {
                            !artists && (
                                <>
                                    <SongActions 
                                        ref={contentRef}
                                        open={show}
                                        actionsData={actionsData}
                                        onClick={(value) => {
                                        if(value === 'info' && onOpenInfoMenu) {
                                            onOpenInfoMenu()
                                        }else if(value === 'queue' && onAddToQueue){
                                            onAddToQueue()
                                        }
                                        setShow(false)
                                    }}
                                    />
                                </>
                            )
                        }
        
                        {recentSearched && <Image src={close} alt='close-recent-found' className={styles.closeFound}/>}
        
                        <div className={styles.image_container}>
                            <CustomLink href={routeMem}>
                                {
                                    !artists && (
                                        <Image src={songFavicon} alt='songFavicon' className={styles.song_favicon}/>
                                    )
                                }
                                <div className={cn({bg_gradient: true, borderCircled: artists})} />
                                <Image width='400' height='400' src={image as StaticImageData} alt='main image' className={cn({
                                    main_image: true, 
                                    artistI: artists
                                })}/>
                                {videoCard && !isUndefined(videoDuration) && 
                                    <div className={styles.videoDuration}>
                                        <PlayExtraSm mode='play'/>
                                        <span>{secondsToMmSs(videoDuration)}</span>
                                    </div>
                                }
                                <div className={styles.actions}>
                                    {
                                        !artists && !playlists && !alboms &&  <PlayPause className={styles.play} state='play' onClick={playSong}/>
                                    }
                                    {
                                        !artists && !hideMoreI && <div className={styles.more}>{moreBtn}</div>
                                    }
                                </div>
                            </CustomLink>
                        </div>
                        <div className={styles.footer}>
                            {
                            top10 ?
                                <div className={styles.top10Place}>
                                    {top10Id}
                                </div> : ""
                            }
                            <div className={styles.main_content}>

                                <div className={cn({
                                    theTop: true, 
                                    topFlex: videoCard
                                })}>
                                    {
                                        (!artists && !playlists && !alboms) && (isSongPlaying && songData[songIndex]?.id === id) &&
                                        <LottieI 
                                            width={20}
                                            height={20}
                                            icon={Equalizer}
                                            className={styles.equalizer}
                                        />
                                    }
                                    <div className={cn({
                                        title: true, 
                                        paddLeft: isSongPlaying && songData[songIndex]?.id === id
                                    })}>
                                        <CustomLink onClick={stopPropagation} href={routeMem}>
                                            {title}
                                        </CustomLink>
                                    </div>

                                    {videoCard && moreBtn}
                                </div>

                                
                                {!videoCard && 
                                    <div className={styles.description}>
                                        <CustomLink onClick={stopPropagation} href={`/artist/${artistId}`}>{description}</CustomLink>
                                    </div>
                                }
                            </div>
                        </div>
                    </>
                )
            }
        
            </div>
        )
    }
   </>
  )
})

export default StandardCard