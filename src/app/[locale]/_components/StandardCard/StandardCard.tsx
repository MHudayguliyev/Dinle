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

interface StandardProps {
    id: string
    artistId?: string
    playlistId?: string 
    albomId?: string 
    genreId?: string
    image?: StaticImageData | string
    onPlay?: (id: string) => void
    onOpenBottomSheet?: () => void
    onOpenInfoMenu?: () => void
    onAddToQueue?: () => void
    title:string
    description?:string
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
    hideMoreI?: boolean
    /** @defaultValue false **/
    recentSearched?: boolean
    /** @defaultValue false **/
    genres?: boolean
    /** @defaultValue false **/
    shimmer?: boolean
}
const cn = classNames.bind(styles)
const StandardCard = (props: StandardProps) => {
    const {
        id,
        artistId = "",
        playlistId = "",  
        albomId = "", 
        genreId = "",
        image, 
        title, 
        description, 
        standard = false, 
        artists = false, 
        top10 = false, 
        hideMoreI = false, 
        recentSearched = false,
        genres = false, 
        playlists = false, 
        alboms = false, 
        videoCard = false, 
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

    const moreBtn = useMemo(() => (
        <More ref={toggleRef} onClick={() => {
            if(width <= 786 && onOpenBottomSheet) onOpenBottomSheet()
        }} className={cn({ more: !videoCard })}/>
    ), [width, videoCard, onOpenBottomSheet])

    const routeMem = useMemo(() => {
        const route = `
            ${artists ? `/artist/${artistId}` : playlists ? `/playlist/${playlistId}` : alboms ? `/album/${albomId}` : 
            genres ? `/genre/${genreId}` : ""}
        `
        return route
    }, [
        id, 
        artistId, 
        playlistId, 
        albomId, 
        genreId, 
        artists, 
        genres, 
        alboms, 
        playlists,
    ])

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
        <div onClick={playSong} className={cn({
                standard_card: !genres, 
                card_with_close: recentSearched,
                card_for_artist: artists,
                card_for_genres: genres, 
                card_for_video: videoCard,
                withActiveBg: (!artists && !genres && !playlists && !alboms && !standard && !videoCard) || (songData[songIndex]?.id === id), 
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
                                <div className={styles.actions}>
                                    {
                                        !artists && !playlists && !alboms &&  <PlayPause className={styles.play} state='play' onClick={playSong}/>
                                    }
                                    {
                                        !artists && !hideMoreI && moreBtn
                                    }
                                </div>
                            </CustomLink>
                        </div>
                        <div className={styles.footer}>
                            {
                            top10 ?
                                <div className={styles.top10Place}>
                                    {id}
                                </div> : ""
                            }
                            <div className={styles.main_content}>

                                <div className={styles.theTop}>
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
                                        <CustomLink onClick={stopPropagation} href={playlists ? `/playlist/${playlistId}` : artists ? `/artist/${artistId}` : alboms ? `/album/${albomId}` : `/song/${id}`}>
                                            {title}
                                        </CustomLink>
                                    </div>

                                    {videoCard && moreBtn}
                                </div>

                                
                                <div className={styles.description}>
                                    <CustomLink onClick={stopPropagation} href={`/artist/${artistId}`}>{description}</CustomLink>
                                </div>
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
}

export default StandardCard