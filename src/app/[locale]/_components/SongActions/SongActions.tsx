import React, {useState, useEffect, CSSProperties, useMemo, useCallback}from 'react'
//images

//styles 
import styles from './SongActions.module.scss';
import classNames from 'classnames/bind';
import Image from 'next/image';
import { capitalize } from '@app/_utils/helpers';
import InfoSmI from '../icons/infoSm/icon';
import ShareSmI from '../icons/shareSm/icon';
import ReadMoreI from '../icons/readMore/icon';

interface SongActionsProps {
    open: boolean
    close?: () => void
    onClick?: (value: string) => void
    contentStyle?: CSSProperties
    /** @defaultValue bottomRight  **/
    transformOrigin?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft'
    className?: string
}
const cn = classNames.bind(styles)
const SongActions = React.forwardRef<HTMLDivElement, SongActionsProps>((props, ref): JSX.Element => {
    const {
        open, 
        transformOrigin = 'bottomRight',
        contentStyle, 
        close, 
        onClick, 
        className = "", 
    } = props

    const [active, setActive] = useState<number>(-1)

    useEffect(() => {
        if(!open && active !== -1)
            setActive(-1)
    }, [open])

    const actions = [
        {
            value: 'info', 
            title: 'Maglumat', 
            icon: <InfoSmI />
        }, 
        {
            value: 'share', 
            title: 'Paylasmak', 
            icon: <ShareSmI />
        }, 
        {
            value: 'queue', 
            title: 'Add to queue', 
            icon: <ReadMoreI />
        }
    ]

    const handleClick = useCallback((event: any, action:any) => {
        event.stopPropagation()
        if(onClick) onClick(action.value)
    }, [onClick])

    const content = useMemo(() => {
        return (
            actions.map((action, i) => (
                <div className={styles.action} key={i} onClick={(e) => handleClick(e, action)}>
                    <div className={cn({
                        title: true,
                    })}>
                        {action.title}
                    </div>
                    <>{action.icon}</>
                </div>
            ))
        )
    }, [actions, active])

  return (
    <>
        <div ref={ref} style={contentStyle} className={`${
            cn({
                actions: true, 
                show: open, 
                [`transformOrigin${capitalize(transformOrigin)}`]: true,
                })
        } ${className}`} onClick={close}
        >
            {content}
        </div>
    </>
  )
}) 

export default SongActions