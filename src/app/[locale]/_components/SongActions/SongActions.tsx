import React, {CSSProperties, useMemo, useCallback}from 'react'
//styles 
import styles from './SongActions.module.scss';
import classNames from 'classnames/bind';
import { capitalize } from '@app/_utils/helpers';
import { Localization } from '@app/_types';
import { useLocale } from 'next-intl';

type ActionsType = {
    value: string 
    label: Localization
    icon: React.ReactNode
}

interface SongActionsProps {
    open: boolean
    close?: () => void
    onClick?: (value: string) => void
    contentStyle?: CSSProperties
    /** @defaultValue bottomRight  **/
    transformOrigin?: 'bottomRight' | 'bottomLeft' | 'topRight' | 'topLeft'
    className?: string
    actionsData: ActionsType[]

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
        actionsData
    } = props

    const locale = useLocale()
    const handleClick = useCallback((event: any, action:any) => {
        event.stopPropagation()
        if(onClick) onClick(action.value)
    }, [onClick])

    const content = useMemo(() => {
        return (
            actionsData?.map((action, i) => (
                <div className={styles.action} key={i} onClick={(e) => handleClick(e, action)}>
                    <div className={cn({
                        title: true,
                    })}>
                        {action.label[locale as keyof Localization]}
                    </div>
                    <>{action.icon}</>
                </div>
            ))
        )
    }, [actionsData, handleClick, locale])

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

SongActions.displayName = 'SongActions'

export default SongActions