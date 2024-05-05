import React from 'react'
import CommonIProps from '../CommonIProps'

interface PlayPauseIconProps extends CommonIProps {
    mode?: 'play' | 'pause'
}

const PlayPause = React.forwardRef<SVGSVGElement, PlayPauseIconProps>((props, ref): JSX.Element => {
    const {
        className = "", 
        onClick, 
        mode = 'play', 
        disable = false, 
    } = props

    const handleClick = (e: any) => {
        e.stopPropagation()
        if(onClick) onClick()
    }

    return (
        <>
            {
                mode === 'play' ? 
                <svg className={className} onClick={handleClick} width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="34" height="34" rx="17" fill="white"/>
                <path d="M13.8549 10.9172C13.0058 10.382 11.8999 10.9921 11.8999 11.9958V22.0098C11.8999 23.0134 13.0058 23.6236 13.8549 23.0883L21.797 18.0813C22.5904 17.5812 22.5904 16.4244 21.797 15.9242L13.8549 10.9172Z" fill="#101828"/>
                </svg>
                : 
                <svg style={{pointerEvents: `${disable ? 'none': 'auto'}`}} className={className} onClick={handleClick} width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M34.1667 17.0833C34.1667 26.5182 26.5182 34.1667 17.0833 34.1667C7.64847 34.1667 0 26.5182 0 17.0833C0 7.64847 7.64847 0 17.0833 0C26.5182 0 34.1667 7.64847 34.1667 17.0833ZM11.1042 10.25C11.1042 9.77826 11.4866 9.39583 11.9583 9.39583H14.5208C14.9926 9.39583 15.375 9.77826 15.375 10.25V23.9167C15.375 24.3884 14.9926 24.7708 14.5208 24.7708H11.9583C11.4866 24.7708 11.1042 24.3884 11.1042 23.9167V10.25ZM19.6458 9.39583C19.1741 9.39583 18.7917 9.77826 18.7917 10.25V23.9167C18.7917 24.3884 19.1741 24.7708 19.6458 24.7708H22.2083C22.6801 24.7708 23.0625 24.3884 23.0625 23.9167V10.25C23.0625 9.77826 22.6801 9.39583 22.2083 9.39583H19.6458Z" fill="white"/>
                </svg>
            }
        </>
    )
})
PlayPause.displayName = 'PlayPause'

export default PlayPause