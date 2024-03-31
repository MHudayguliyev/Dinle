'use client'
import React, {useState} from "react"
import { useRouter } from 'next/navigation'

import Image from "next/image"
//styles
import styles from './page.module.scss'
//icons
import PrevNext from '@components/icons/prevNext/icon'
//images
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
import Link from "next/link"
import { logOut } from "@app/_api/Queries/Post"
import { getUserDevice, isAuthorized } from "@app/_utils/helpers"
//utils
import { removeFromStorage } from '@utils/storage'
import toast from "react-hot-toast"


const Settings = () => {
    const router = useRouter()

    const [checked, setChecked] = useState<boolean>(false)
    const [openLangMenu, setOpenLangMenu] = useState<boolean>(false)

    const logout = async () => {
        if(!isAuthorized()) return toast.error('You already logged out.')

        const device = getUserDevice()
        try {
            const response = await logOut(device!?.id)
            console.log("res", response)
            if(response.success && response.statusCode === 200 && response.data.logout){
                console.log('response', response)
                router.replace('/login')
                removeFromStorage('authUser')
            }
        } catch (error) {
            console.log("logut error", error)
        }
    }

    return (
        <>
            <LanguagesMenu 
                show={openLangMenu}
                close={() => setOpenLangMenu(false)}
                leftCut
            />

            <div className={styles.wrapper}>

            <div className={styles.top}>
                <PrevNext  mode='prev'/>
            </div>

            <div className={styles.box}>
                <div className={styles.topHeader}>Sazlamalar</div>

                <div>
                    <div className={styles.item}>
                        <div className={styles.theLeft}>
                            <Image  src={account} alt="account" />
                            <div className={styles.leftContent}>
                                <div className={styles.header}>Menin Dinle ID</div>
                                <div className={styles.phone}>+993 63 509004</div>
                            </div>
                        </div>
                        <MoreSm />
                    </div>

                    <div className={styles.item}>
                        <div className={styles.thePaymentLeft}>
                            <div className={styles.header}>Toleg podpiskasy</div>
                            <div className={styles.phone}>Tolenen wagty:12.12.2023</div>
                        </div>

                        <ArrowI />
                    </div>
                </div>


                <div>
                    <div className={styles.item}>
                        <div className={styles.theLeft}>
                            <NotifyI />
                            <div className={styles.header}>Notification</div>
                        </div>
                        <Switch 
                            checked={checked}
                            onClick={() => setChecked(!checked)}
                        />
                    </div>
                    
                    <div className={styles.item}>
                        <div className={styles.theLeft}>
                            <GlobusI />
                            <div className={styles.header}>Language</div>
                        </div>
                        
                        <div className={styles.theRight}>
                            <div className={styles.phone}>English</div>
                            <ArrowI onClick={() => setOpenLangMenu(true)}/>
                        </div>
                    </div>
                </div>

                <div>
                    <Link href='/devices' className={styles.item}>
                        <div className={styles.theLeft}>
                            <List active={false}/>
                            <div className={styles.header}>Birikdirlen enjamlar</div>
                        </div>
                        <ArrowI />
                    </Link>
                </div>

                <div>
                    <Link href='' className={styles.item}>
                        <div className={styles.theLeft}>
                            <HelpI/>
                            <div className={styles.header}>Salgylanma</div>
                        </div>
                        <ArrowI />
                    </Link>
                </div>


                <Button onClick={logout} color="transparent" startIcon={<LogoutI />} roundedSm style={{display: 'flex', background: 'rgba(255, 55, 64, 0.2)'}}> 
                    Logout
                </Button>
            </div>
            </div>

        </>
       
    )
}

export default Settings