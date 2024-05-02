'use client';
import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useRouter} from 'next/navigation'
import { useQuery } from 'react-query';
import Image from 'next/image';
//styles
import styles from './page.module.scss';
//icons 
import Play from '@components/icons/simplePlay/icon';
import PlaySm from '@components/icons/playExtraSm/icon';
import ShuffleI from '@app/_components/icons/shuffle/icon';
import ShuffleSmI from '@app/_components/icons/shuffleSm/icon';
import Share from '@components/icons/share/icon';
//images 
import likedSongs from '@app/_assets/images/liked-songs.png'
//libs
// import PrevNext from '@app/_compLibrary/PrevNext';
import Button from '@app/_compLibrary/Button';
import { getSongs } from '@app/_api/Queries/Getters';
import SongList from '@app/_components/SongList/SongList';
import useClickOutside from '@app/_hooks/useOutClick';
import InfoMenu from '@app/_components/InfoMenu/InfoMenu';
//redux
import { useAppDispatch } from '@app/_hooks/redux_hooks';
import { setCurrentSong } from '@app/_redux/reducers/MediaReducer';
//types
import SongsType from '@app/_api/types/queryReturnTypes/Songs';
//api
import { likeSong } from '@app/_api/Queries/Post';
//hooks
import { useWindowScrollPositions } from '@hooks/useWindowOffset'


const Songs = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const headerRef:any = useRef(null)
    const toggleRef:any = useRef(null)
    const contentRef:any = useRef(null)
    const [showInfoMenu, setShowInfoMenu] = useClickOutside(contentRef, toggleRef, 'mousedown')
    const { scrolly } = useWindowScrollPositions()


    const [fetchInfoId, setFetchInfoId] = useState<string>("")
    const [rows, setRows] = useState<SongsType['rows']>()

    const {
        data: songsData, 
        isLoading, 
        isError
    } = useQuery("GetSongs", () => getSongs({}), {
        refetchOnWindowFocus: false
    })


    useEffect(() => {
        if(!showInfoMenu) setFetchInfoId("")
    },[showInfoMenu])

    useEffect(() => {
        if(!isLoading && !isError) setRows(songsData?.rows)
    }, [songsData])

    useEffect(() => {
        const opacity = Math.min(1, scrolly / window.innerHeight)
        if(headerRef && headerRef.current)
        headerRef.current?.style?.setProperty(
            '--opacity', opacity
        )
      }, [scrolly, headerRef])

    const infoMenu = useMemo(() => {
        return (
            <InfoMenu 
            ref={contentRef}
            close={() => setShowInfoMenu(false)}
            id={fetchInfoId}
            show={showInfoMenu}
            fetchMode='song'
            />
        )
    }, [
        contentRef, 
        showInfoMenu, 
        fetchInfoId
    ])

    const handleLike = useCallback(async(songId: string) => {
        try {
            const response = await likeSong(songId)
            // console.log('response', response)
            if(response.success && response.statusCode === 200)
            setRows(prev => prev?.map(row => row.id === songId ? {...row, isLiked: !row.isLiked} : row))
          } catch (error) {
            console.log('like song error', error)
          }
    }, [])
  return (
    <>
        {infoMenu}

        <div className={styles.header} ref={headerRef}>
            <div className={styles.share}>
            <Share />
            </div>
        </div>

        <div className={styles.presentation}>
            <div className={styles.background_gradient}></div>
            <div className={styles.wrapper}>

            <div className={styles.content_box}>
                <Image src={likedSongs} alt='liked'/>

                <div className={styles.my_favorite}>
                <div className={styles.title}>Songs</div>
                <p>Songs 500</p>
                </div>
            </div>

            <div className={styles.actions}>
                <Play />
                <ShuffleI active={false}/>
                <Share />
            </div>

            </div>

        </div>


        <div className={styles.presentation_mobile}>
            <div className={styles.background_gradient}></div>

            <div className={styles.mobile_presentation_wrapper}>

            <div className={styles.content_box}>
                <Image src={likedSongs} alt='liked'/>
            </div>

            <div className={styles.the_bottom}>
                <div className={styles.title}>
                    Songs
                </div>

                <div className={styles.actions}>
                <Button color='lightDarkThird' roundedSm className={styles.actionBtn}>
                    <ShuffleSmI />
                </Button>
                </div>
            </div>

            </div>

        </div>

        <SongList
            data={rows}
            fetchStatuses={{isLoading, isError}}
            onShowInfo={(id) => {
                setFetchInfoId(id)
                setShowInfoMenu(true)
            }}
            onLike={handleLike}
            onPlay={(index) => dispatch(setCurrentSong({data: rows, index, id: rows![index]?.id}))}
            className={styles.songsList}
        />

    </>
  )
}

export default Songs