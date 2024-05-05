import React, { InputHTMLAttributes, useMemo } from 'react'
import styles from './Input.module.scss'
import classNames from 'classnames/bind'
import { capitalize } from '@app/_utils/helpers'
import NewInput from '.'

type IconType = 'start' | 'end'
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    /** @defaultValue medium */
    fontSize?: 'small' | 'medium' | 'big'
    /** @defaultValue medium */
    fontWeight?: 'normal' | 'medium' | 'bold'
    /** @defaultValue false **/
    rounded?: boolean
    /** @defaultValue false **/
    roundedSm?: boolean
    startIcon?: React.ReactNode
    endIcon?: React.ReactNode
    className?: string 
    onIClick?: (iType: IconType) => void
}
const cn = classNames.bind(styles)
const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref): JSX.Element => {
    const {
        fontSize = 'medium', 
        fontWeight = 'medium', 
        rounded = false,
        roundedSm = false, 
        startIcon, 
        endIcon, 
        className, 
        onIClick, 
    } = props
        
    const handleIClick = (type: IconType) => {
        if(onIClick) onIClick(type)
    }
    const content = useMemo(() => {
        return (
            <div className={cn({
                baseStyles: true, 
                iconedStyles: startIcon || endIcon, 
                rounded: rounded, 
                roundedSm: roundedSm
            })}>
                {startIcon && <span onClick={() => handleIClick('start')}>{startIcon}</span>}
                <input 
                    ref={ref} 
                    {...props} 
                    className={`${cn({
                        input: true, 
                        [`fontSize${capitalize(fontSize)}`]: true,
                        [`fontWeight${capitalize(fontWeight)}`]: true,
                    })} ${className}`} 
                    
                />
                {endIcon && <span onClick={() => handleIClick('end')}>{endIcon}</span>}
            </div>
        )
    }, [startIcon, endIcon])

    return (
        <>{content}</>
    )
})

export default Input
