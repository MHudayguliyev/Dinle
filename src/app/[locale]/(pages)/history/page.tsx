'use client';
import React from 'react'
//styles
import classNames from 'classnames/bind';
import styles from './page.module.scss';
import ChevronLeft from '@app/_components/icons/chevronLeft/icon';

const cn = classNames.bind(styles)
const History = () => {
    const lists = [
        {
            active: true, 
            startDate: '11.10.2023', 
            endDate: '11.10.2023'
        },
        {
            active: true, 
            startDate: '11.10.2023', 
            endDate: '11.10.2023'
        },
        {
            active: false, 
            startDate: '11.10.2023', 
            endDate: '11.10.2023'
        },
        {
            active: false, 
            startDate: '11.10.2023', 
            endDate: '11.10.2023'
        },
        {
            active: false, 
            startDate: '11.10.2023', 
            endDate: '11.10.2023'
        },
        {
            active: false, 
            startDate: '11.10.2023', 
            endDate: '11.10.2023'
        },
        {
            active: false, 
            startDate: '11.10.2023', 
            endDate: '11.10.2023'
        },
        {
            active: false, 
            startDate: '11.10.2023', 
            endDate: '11.10.2023'
        },
        {
            active: false, 
            startDate: '11.10.2023', 
            endDate: '11.10.2023'
        },
        {
            active: false, 
            startDate: '11.10.2023', 
            endDate: '11.10.2023'
        },
        {
            active: false, 
            startDate: '11.10.2023', 
            endDate: '11.10.2023'
        },
    ]


  return (
    <div className={styles.wrapper}>
        <div className={styles.box}>

            <div className={styles.header}>
                <ChevronLeft />
                <div className={styles.topTitle}>Profile</div>
            </div>

            <div className={styles.lists}>
                {
                    lists.map((list, i) => (
                        <div className={cn({
                            list: true, 
                            currentSubscription: i === 0
                        })} key={i}>
                            <span className={cn({
                                status: true, 
                                active: list.active
                            })}>
                                {list.active ? 'Active' : "Inactive"}
                            </span>

                            <div className={styles.date}>
                                Baslanan senesi:
                                {list.startDate}
                            </div>
                            <div className={styles.date}>
                                Gutaryan senesi:
                                {list.endDate}
                            </div>
                        </div>
                    ))
                }
            </div>

        </div>
    </div>
  )
}

export default History
