import React, {useCallback} from 'react'
import Image from 'next/image'
//styles
import classNames from 'classnames/bind'
import styles from './Bottomsheet.module.scss'
//images
import InfoSmI from '../icons/infoSm/icon';
import ShareSmI from '../icons/shareSm/icon';
import MobileRectI from '../icons/mobileRect/icon'
import ReadMoreI from '../icons/readMore/icon';

interface BottomsheetProps {
    open: boolean
    close: () => void
    onClick?: (value: string) => void
    contentStyle?: React.CSSProperties
}
const cn = classNames.bind(styles)
const Bottomsheet = React.forwardRef<HTMLDivElement, BottomsheetProps>((props, ref): JSX.Element => {
    const {
        open, 
        close, 
        onClick, 
        contentStyle, 
    } = props

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


    return (
        <>
            <div onClick={(e) => {
                e.stopPropagation()
                close()
            }} ref={ref} className={cn({
                bottomSheet: true, 
                open: open
            })}>

            <div className={styles.wrapper}>
                <div className={styles.box}>
                    <div className={styles.head}><MobileRectI /></div>
                    {actions.map((action, i) => (
                        <div className={styles.action} key={i} onClick={(e) => handleClick(e, action)}>
                        <div className={styles.title}>
                            {action.title}
                        </div>
                        <>{action.icon}</>
                        </div>
                    ))}
                </div>

            </div>

        </div>

        </>
    )
})

export default Bottomsheet