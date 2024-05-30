'use client'
import React, {useEffect, useState} from "react"
import Image from "next/image"
import { useLocale, useTranslations } from 'next-intl'

//styles
import classNames from "classnames/bind"
import styles from './page.module.scss'
//icons
import PrevNext from '@components/icons/prevNext/icon'
import account from '@app/_assets/images/account.png'
import MoreSm from "@app/_components/icons/moreSm/icon"
import ArrowI from "@app/_components/icons/arrow/icon"
import NotifyI from "@app/_components/icons/notify/icon"
import HelpI from "@app/_components/icons/help/icon"
import GlobusI from "@app/_components/icons/globus/icon"
import List from "@app/_components/icons/device/icon"
import LogoutI from "@app/_components/icons/logout/icon"
//libs
import Button from "@app/_compLibrary/Button"
import Switch from "@app/_compLibrary/Switch"
//comps
import LanguagesMenu from '@components/LanguagesMenu/LanguagesMenu'
import CustomLink from "@app/_components/CustomLink/CustomLink"
//utils
import LogoutModal from "@app/_components/Modals/LogoutModal/LogoutModal"
import { isAuthorized, parse } from "@app/_utils/helpers"
//hot toast
import toast from "react-hot-toast"
//redux
import { useAppSelector } from "@app/_hooks/redux_hooks"
import { getFromStorage } from "@app/_utils/storage"

const cn = classNames.bind(styles)
const Settings = () => {
    const t = useTranslations('settings')
    const currentLocale = useLocale()

    const [checked, setChecked] = useState<boolean>(false)
    const [openLangMenu, setOpenLangMenu] = useState<boolean>(false)
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [user, setUser] = useState<string>("")

    const isPlayerOpen = useAppSelector(state => state.mediaReducer.isAudioPlayerOpen)
    // console.log("navigator", navigator?.serviceWorker)
    // console.log("navigator", Notification.requestPermission())

    // const send = () => {
    //     if('Notification' in window && Notification.permission === 'granted'){
    //         new Notification('Hi there', {
    //             body: "This is my notification", 
    //             icon: "/logo.png", 
    //             badge: "/logo.png"
    //         })
    //     }
    // }

    // const reqPermission = () => {
    //     if('Notification' in window){
    //         Notification.requestPermission().then(permission => {
    //             if(permission === 'granted'){
    //                 send()
    //             }
    //         })
    //     }
    // }

    // useEffect(() => {
    //     if(checked) reqPermission()
    // }, [checked])
    useEffect(() => {
        const authData = parse(getFromStorage('authUser')!)
        const username = authData?.username 
        setUser(username) 
    }, [])

    return (
        <>
            <LanguagesMenu 
                show={openLangMenu}
                close={() => setOpenLangMenu(false)}
                leftCut
            />

            <LogoutModal 
                show={openModal}
                close={() => setOpenModal(false)}
                translation={t}
            />

            <div className={cn({
                wrapper: true, 
                truncateHeight: isPlayerOpen
            })}>

            <div className={styles.top}>
                <PrevNext  mode='prev'/>
            </div>

            <div className={styles.box}>
                <div className={styles.topHeader}>{t('title')}</div>

                <div>
                    <div className={styles.item}>
                        <div className={styles.theLeft}>
                            <Image  src={account} alt="account" />
                            <div className={styles.leftContent}>
                                <div className={styles.header}>Menin Dinle ID</div>
                                <div className={styles.phone}>{user ?? ""}</div>
                            </div>
                        </div>
                        <MoreSm />
                    </div>

                    {/* <CustomLink href='/history' className={styles.item}>
                        <div className={styles.thePaymentLeft}>
                            <div className={styles.header}>Toleg podpiskasy</div>
                            <div className={styles.phone}>Tolenen wagty:12.12.2023</div>
                        </div>

                        <ArrowI />
                    </CustomLink>

                    <CustomLink href='/premium' className={styles.item}>
                        <div className={styles.thePaymentLeft}>
                            <div className={styles.header}>Купить подписку</div>
                        </div>

                        <ArrowI />
                    </CustomLink> */}
                </div>


                <div>
                    <div className={styles.item}>
                        <div className={styles.theLeft}>
                            <NotifyI />
                            <div className={styles.header}>{t('notification')}</div>
                        </div>
                        <Switch 
                            checked={checked}
                            onClick={() => setChecked(!checked)}
                        />
                    </div>
                    
                    <div className={`${styles.item} ${styles.addCursor}`} onClick={() => setOpenLangMenu(true)}>
                        <div className={styles.theLeft}>
                            <GlobusI />
                            <div className={styles.header}>{t('language')}</div>
                        </div>
                        
                        <div className={styles.theRight}>
                            <div className={styles.phone}>
                                {
                                    currentLocale === 'tm' ? "Turkmen" : "Русский"
                                }
                            </div>
                            <ArrowI/>
                        </div>
                    </div>
                </div>

                {/* <div>
                    <CustomLink href='/devices' className={styles.item}>
                        <div className={styles.theLeft}>
                            <List active={false}/>
                            <div className={styles.header}>Birikdirlen enjamlar</div>
                        </div>
                        <ArrowI />
                    </CustomLink>
                </div> */}

                <div>
                    <CustomLink href='https://dinle.com.tm/api/privacy' className={styles.item}>
                        <div className={styles.theLeft}>
                            <HelpI/>
                            <div className={styles.header}>{t('privacyPolicy')}</div>
                        </div>
                        <ArrowI />
                    </CustomLink>
                </div>


                <Button onClick={() => {
                    if(!isAuthorized()) return toast.error('You already logged out.')
                    setOpenModal(true)
                }} 
                color="transparent" 
                startIcon={<LogoutI />} 
                roundedSm 
                style={{display: 'flex', background: 'rgba(255, 55, 64, 0.2)'}}> 
                    {t('logout')}
                </Button>
            </div>
            </div>

        </>
       
    )
}

export default Settings