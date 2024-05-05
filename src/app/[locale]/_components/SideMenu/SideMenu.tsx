import React, {useState, LegacyRef, useRef, useEffect, useCallback} from 'react'
import Image from 'next/image';
//styles
import styles from './SideMenu.module.scss'
import classNames from 'classnames/bind';
//icons 
import artist from '@app/_assets/images/player_artist.png'
import MoreSm from '../icons/moreSm/icon';
import Equalizer from '@app/_assets/lottie/equalizer.json';
//comps 
import SongActions from '../SongActions/SongActions';
import useClickOutside from '@app/_hooks/useOutClick';
import Bottomsheet from '../Bottomsheet/Bottomsheet'
import LottieI from '../Lottie/LottieI';
//redux
import { useAppSelector, useAppDispatch } from '@app/_hooks/redux_hooks';
import { setCurrentSong } from '@app/_redux/reducers/MediaReducer';
import useWindowSize from '@app/_hooks/useWindowSize';
import InfoMenu from '../InfoMenu/InfoMenu';
import InfoSmI from '../icons/infoSm/icon';
import ShareSmI from '../icons/shareSm/icon';
import ReadMoreI from '../icons/readMore/icon';
import PrevNextI from '../icons/prevNext/icon';

interface SideMenuProps<T> {
    show: boolean
    setShow: Function
    contentRef: LegacyRef<T> 
}
const cn = classNames.bind(styles)
const SideMenu = (props: SideMenuProps<HTMLDivElement>) => {
    const dispatch = useAppDispatch()
    const toggleActionsRef: any = useRef(null)
    const actionsContentRef:any = useRef(null)
    const [showActions, setShowActions] = useClickOutside(actionsContentRef, toggleActionsRef, 'click')
    const [width] = useWindowSize()

    const [toggleI, setToggleI] = useState<string>("")
    const [songId, setSongId] = useState<string>("")
    const [showBottomsheet, setShowBottomsheet] = useState<boolean>(false)
    const [showMenu, setShowMenu] = useState<boolean>(false)
    
    const songs = useAppSelector(state => state.mediaReducer.songData)
    const songIndex = useAppSelector(state=> state.mediaReducer.songIndex)
    const isSongPlaying = useAppSelector(state => state.mediaReducer.isSongPlaying)

    const {
        show, 
        setShow, 
        contentRef
    } = props

    const openMenu = useCallback((value:string, songId: string) => {
        if(value === 'info'){
            setSongId(songId)
            setShowMenu(true)    
        }
        setShowActions(false)
        setShow(false)
    }, [setShowActions, setShow])

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
    ]

  return (
    <>
        <InfoMenu 
            id={songId}
            show={showMenu}
            close={() => setShowMenu(false)}
        />

        <div className={cn({
            sidemenu__container: true, 
            showMenu: show
        })} ref={contentRef}>
            <div className={styles.list}>
                <div className={styles.head}>
                    <PrevNextI mode='prev' onClick={() => setShow(false)}/>
                </div>
                {
                    songs?.map((item, index) => (
                        <div key={item.id} className={cn({
                            item: true, 
                            activeItem: songs[songIndex]?.id === item.id
                        })} onClick={() => dispatch(setCurrentSong({ data: songs, id: songs[index]?.id, index }))}>
                            <div className={styles.flex1}>
                                <div className={styles.image__container}>
                                    <Image src={item.cover ?? artist} alt='artist' width='400' height='400' className={cn({
                                        imageActive: songIndex === index
                                    })}/>
                                </div>
                                <div className={styles.content}>
                                    <div className={styles.running}>
                                        {
                                            isSongPlaying && songs[songIndex]?.id === item.id ? 
                                            <LottieI 
                                                icon={Equalizer} 
                                                width={20} 
                                                height={20}
                                                className={styles.equalizer}
                                            /> : ""
                                        }
                                        <h4 className={cn({paddLeft: isSongPlaying && songs[songIndex]?.id === item.id})}>{item.title}</h4>
                                    </div>
                                    <div>{item.description}</div>
                                </div>
                            </div>
                            <MoreSm 
                                ref={toggleActionsRef}
                                onClick={() => {
                                    if(width <= 768) {
                                        setShowBottomsheet(!showBottomsheet)
                                    }else {
                                        setToggleI(item.id)
                                        if(toggleI === item.id) setShowActions(!showActions)
                                        else setShowActions(true)
                                    }
                                }}
                            />

                            <SongActions 
                                open={showActions && toggleI === item.id}
                                ref={actionsContentRef}
                                contentStyle={{
                                    bottom: '-100%'
                                }}
                                onClick={(value) => openMenu(value, item.id)}
                                actionsData={actionsData}
                            />

                            <Bottomsheet 
                                actionsData={actionsData}
                                open={showBottomsheet}
                                close={() => setShowBottomsheet(false)}
                            />
                        </div>
                    ))
                }
            </div>
        </div>
    </>
  )
}

export default SideMenu