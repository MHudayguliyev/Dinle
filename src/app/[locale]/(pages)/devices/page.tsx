
'use client';
import React, {useEffect, useMemo, useState} from 'react'
import { useRouter } from 'next/navigation'
import {useQuery} from 'react-query'
//styles
import styles from './page.module.scss'
import classNames from 'classnames/bind'
//moment
import moment from 'moment'
//icons
import PhoneI from '@app/_components/icons/phone/icon'
import List from '@app/_components/icons/device/icon'
import GlobusI from '@app/_components/icons/globus/icon'
import TrashI from '@app/_components/icons/trash/icon'
import PrevNext from '@components/icons/prevNext/icon'
//api
import { GetDevices } from '@app/_api/Queries/Getters';
//comps
import DeviceModal from '@app/_components/Modals/DeviceModal/DeviceModal';
//utils
import {getUserDevice} from '@utils/helpers'

const cn = classNames.bind(styles)
const ConnectedDevices = () => {
    const router = useRouter()

    const {
        data, 
        isLoading, 
        isError, 
        refetch: onSuccess
    } = useQuery('GetDevices', () => GetDevices(),  {
        refetchOnWindowFocus: false
    })

    const [deviceId, setDeviceId] = useState<string>("")
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [currentDevice, setCurrentDevice] = useState<{
        id: string 
        os: string
        name: string
        version: string 
    } | any>()

    useEffect(() => {
        setCurrentDevice(getUserDevice())
    }, [])

    console.log("currentDevice",currentDevice)

  return (
    <>
        <DeviceModal 
            show={openModal}
            close={() => setOpenModal(false)}
            deviceId={deviceId}
            onSuccess={() => onSuccess()}
        />

        <div className={styles.wrapper}>
            <div className={styles.top}>
                <PrevNext  mode='prev'/>
            </div>

            <div className={styles.box}>
                <div className={styles.topHeader}>Birikdirlen enjamlar</div>

                {
                    currentDevice?.id && (
                        <div className={styles.currentDevice}>
                            <div className={styles.title}>BU ENJAM</div>

                            <div className={styles.item}>
                                <List active={false}/>
                                <div className={styles.deviceInfo}>
                                    <div className={styles.name}>{currentDevice?.name}</div>
                                    <div className={styles.version}>
                                        {currentDevice?.name + " | " + "v" + currentDevice?.version + " | " + moment()?.format('DD/MM/YYYY')}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                }


                <div className={styles.otherDevices}>
                <div className={styles.title}>Beyleki ENJAMLAR</div>
                    {
                        data?.map((device, i) => (
                            <div className={cn({
                                item: true, 
                                spaceBetween: true,
                            })} key={i}>
                                <div className={styles.theLeft}>
                                    {
                                        device.os === ('Windows' || 'Win32' || 'Win64' || 'Win86') ? 
                                        <List active={false}/> : 
                                        <PhoneI />
                                        // (
                                        //     device.name?.toLowercase().includes('chrome') ||
                                        //     device.name?.toLowercase().includes('safari') || 
                                        //     device.name?.toLowercase().includes('mozilla') || 
                                        //     device.name?.toLowercase().includes('edge')
                                        // ) ? 
                                        // <List active={false}/> : <PhoneI />
                                    }
                                    <div className={styles.deviceInfo}>
                                        <div className={styles.name}>{device.name}</div>
                                        <div className={styles.version}>
                                            {device.name + " | " + "v" + device.version + " | " + moment(device.lastActivity)?.format('DD/MM/YYYY')}
                                        </div>
                                    </div>
                                </div>

                                <TrashI onClick={() => {
                                    setDeviceId(device.id)
                                    setOpenModal(true)
                                }}/>
                            </div>
                        ))
                    }
                </div>

            </div>
        </div> 
    </>
  )
}

export default ConnectedDevices
