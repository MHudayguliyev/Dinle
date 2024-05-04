'use client'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import CustomLink from '../CustomLink/CustomLink'
// styles
import classNames from 'classnames/bind'
import styles from  './Sidebar.module.scss'
//images
import logo from '@app/_assets/images/logo.png'
import playlist from '@app/_assets/icons/playlist.svg';
import gotoLib from '@app/_assets/icons/go_to_library.svg';
import like_image from '@app/_assets/images/liked-sm.png';
import user from '@app/_assets/icons/accountI.svg'
import ArrowLeftI from '../icons/arrowLeft/icon'
//json data
import sidebar_routes from '@app/_assets/json_data/sidebar_routes'
//components
import SidebarItem from './SidebarItem/SidebarItem'
//lib
import Button from '@app/_compLibrary/Button'
//icons
import Android from '@app/_components/icons/android/icon'
import Apple from '@app/_components/icons/apple/icon'
//redux 
import { useAppSelector, useAppDispatch } from '@app/_hooks/redux_hooks'

import { useQuery } from 'react-query'
import { GetPlaylists } from '@app/_api/Queries/Getters'
import { setToggleSidebar } from '@app/_redux/reducers/SidebarReducer'

//locale 
import { useLocale, useTranslations } from 'next-intl'
import { Localization } from '@app/_types'

interface SidebarProps {
    hideSidebar: boolean
    setHideSidebar: Function
}

const cn = classNames.bind(styles)
const Sidebar = (props: SidebarProps) => {
    const locale = useLocale()
    const t = useTranslations()
    const pathname = usePathname()
    const dispatch = useAppDispatch()
    //redux states
    const isAudioPlayerOpen = useAppSelector(state => state.mediaReducer.isAudioPlayerOpen)
    const sidebarFolded = useAppSelector(state => state.sidebarReducer.sidebarFolded)
    const activeItem = sidebar_routes.findIndex((item) => {
        if(pathname === '/search') return item.route === pathname.concat("?tab=genre")
        return item.route === pathname
    });

    const {data} = useQuery('GetPlaylists', () => GetPlaylists(4), {
        refetchOnWindowFocus: false
    })

  return (
    <>
        <div className={cn({
            sidebar__container: true,
            playerIsOpen: isAudioPlayerOpen, 
            sidebarFolded: sidebarFolded
        })}>

                <div className={styles.theTop}>
                    <div className={styles.header}>
                        <div className={styles.leftHead}>
                            <Image src={logo} alt='dinle logo'/>
                            <div className={styles.dineTM}>Diňle</div>
                        </div>
                        {
                            !sidebarFolded && 
                            <Button color='lightDark' roundedSm style={{ padding: '5px' }} onClick={() => dispatch(setToggleSidebar(!sidebarFolded))}>
                                <ArrowLeftI />
                            </Button>
                        }
                    </div>


                    <div className={styles.routes}>
                        {
                            sidebar_routes.map((route, i) => {
                                return (
                                    <CustomLink href={route.route} key={i}>
                                    <SidebarItem 
                                        active={i === activeItem}
                                        icon={route.icon}
                                        title={route.display_name[locale as keyof Localization]}
                                        sidebarFolded={sidebarFolded}
                                    />
                                    </CustomLink>
                                )
                            })
                        }
                    </div>
                </div>

                <div className={styles.theBottom}>
                    <CustomLink href='/liked' className={styles.header}>
                        <div className={styles.subHeader}>
                            <Image src={playlist} alt='playlist' />
                            <div>{t('myPlaylist')}</div>
                        </div>
                        <Image src={gotoLib} alt='gotoLib'/>
                    </CustomLink>


                    <div className={styles.lists}>
                        <CustomLink href='/liked' className={cn({ list: true, active: pathname === '/liked' })}>
                            <div className={styles.playlistImage}>
                                <Image src={like_image} alt='cover' width='400' height='400'/>
                            </div>
                            <div className={styles.content}>
                                <div>{t('myFavorite')}</div>
                            </div>
                        </CustomLink>
                        {
                            data?.data?.rows.map((row) => {
                                const url = `/playlist/${row.id}`
                                return (
                                    <CustomLink href={url} className={cn({ list: true, active: url == pathname })}>
                                        <div className={styles.playlistImage}>
                                            <Image src={row.cover} alt='cover' width='400' height='400'/>
                                        </div>
                                        <div className={styles.content}>
                                            {row.title}
                                        </div>
                                    </CustomLink>
                                )
                            })
                        }
                    </div>

                    <CustomLink href='/settings' className={cn({settings: true, active: !sidebarFolded && pathname === '/settings'})}>
                        <Image src={user} alt='profile'/>
                        <span>{t('settings')}</span>
                    </CustomLink>

                </div>

                <div className={styles.download}>
                    <div className={styles.header}>
                        {t('download')}
                    </div>
                    <div className={styles.btnGroup}>
                        {
                            sidebarFolded ? 
                            <>
                                <Button color='lightDark' roundedSm style={{background: 'rgba(20, 20, 20, 1)'}}>
                                    <Android />
                                </Button>
                                <Button color='lightDark' roundedSm style={{background: 'rgba(20, 20, 20, 1)'}}>
                                    <Apple />
                                </Button>
                            </>
                            : 
                            <>
                                <Button className={styles.downloadBtn} color='lightDarkSecond' roundedSm border='light' noPadding startIcon={<Android />}>
                                    <div className={styles.btnContent}>
                                        <div className={styles.getItOn}>GET IT ON</div>
                                        <div className={styles.platformName}>Google Play</div>
                                    </div>  
                                </Button>
                                <Button className={styles.downloadBtn} color='lightDarkSecond' roundedSm border='light' noPadding startIcon={<Apple />}> 
                                    <div className={styles.btnContent}>
                                        <div className={styles.getItOn}>Download on the</div>
                                        <div className={styles.platformName}>App Store</div>
                                    </div>
                                </Button>
                            </>
                        }

                    </div>
                </div>


            {/* <div className={styles.premium}>
                <div className={styles.header}>
                    <Image src={premiumIcon} alt='premium'/>
                    <div>Premium</div>
                </div>
                <Button color='linearGradient' roundedSm className={styles.buyPremium}>
                    Satyn almak
                </Button>
            </div> */}




        </div>
    </>
  )
}

export default Sidebar