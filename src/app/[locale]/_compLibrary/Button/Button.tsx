'use-client'
import React, {CSSProperties, ReactNode, useMemo} from 'react'
import Link, {LinkProps} from 'next/link'
//styles
import classNames from 'classnames/bind'
import styles from './Button.module.scss'
//utils
import { capitalize } from '@app/_utils/helpers'


type ButtonProps = {
    children: ReactNode 
    /** @defaultValue purple  */
    color: 'light' | 'dark' | 'red'  | 'darkRed' | 'purple' | 'lightDark' | 'lightDarkSecond' | 'lightDarkThird' | 'lightDarkFourth' | 'orange' | 'transparent' | 'linearGradient' | 'linearGradientSecond'
    /** @defaultValue none **/ 
    border?: 'light' | 'dark' | 'none'
    onClick?: (e: any) => void
    /** @defaultValue false  */
    disabled?: boolean
    /** @defaultValue false  */
    rounded?: boolean
    /** @defaultValue false  */
    roundedSm?: boolean
    /** @defaultValue false  */
    noPadding?: boolean
    startIcon?: JSX.Element
    endIcon?: JSX.Element
    linkProps?: LinkProps
    htmlType?: "button" | "submit" | "reset",
    style?: CSSProperties
    className?: string 
}
const cn = classNames.bind(styles)
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>((props, ref): JSX.Element => {
    const {
        children,
        style, 
        className = "",
        color = 'purple', 
        htmlType = 'button',
        border = 'none',
        onClick, 
        disabled = false,
        noPadding = false, 
        rounded = false, 
        roundedSm = false, 
        linkProps, 
        startIcon, 
        endIcon
    } = props

    const content = useMemo(() => {
        return (
            <div className={cn({
                baseChildStyle: true,
            })}>
                {startIcon && <span>{startIcon}</span>}
                {children}
                {endIcon && <span>{endIcon}</span>}
            </div>
        )
    }, [startIcon, endIcon, children])

  return (
    <button ref={ref} type={htmlType} style={style} onClick={onClick} disabled={disabled}  className={`${
        cn({
            baseStyle: true, 
            rounded: rounded, 
            roundedSm: roundedSm, 
            noPadding: noPadding,
            [`color${capitalize(color)}`]: true, 
            [`border${capitalize(border)}`]: true
        })
    } ${className}`}>
        {
            linkProps?.href ? 
            <Link {...linkProps} className={styles.link}>
                {content}
            </Link> : 
            content
        }
    </button>
  )
})

Button.displayName = 'Button'

export default Button
