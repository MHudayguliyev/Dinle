import React from 'react'
import Image from 'next/image'
import classNames from 'classnames/bind'
import styles from './SidebarItem.module.scss'
// images
import ellipse from '@app/_assets/icons/ellipse_icon.svg';
import SidebarIcons from '@app/_components/icons/sidebar/icon';
//types
import { IconTypes } from '@app/_types';

type SidebarItemProps = {
    title: string
    icon: IconTypes
    active: boolean
}
const cn = classNames.bind(styles)
const SidebarItem = (props: SidebarItemProps) => {
    const {
        title, 
        icon, 
        active, 
    } = props

  return (
    <div className={cn({
        sidebar__item: true, 
        hideElement: icon === 'playlist' || icon === 'settings'
    })}>
        <div className={cn({
            sidebar__item_inner: true, 
            active: active,
        })}>
            <div className={styles.icon}>
                <SidebarIcons type={icon} color={active ? 'rgba(255, 255, 255, 1)' : 'rgba(179, 179, 179, 1)'}/>
                <Image src={ellipse} alt='ellipse'/>
            </div>
            <span className={cn({
                title: true, 
            })}>{title}</span>
        </div>
    </div>
  )
}

export default SidebarItem