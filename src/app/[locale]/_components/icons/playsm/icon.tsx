import React from 'react'
import CommonIProps from '../CommonIProps'

interface PlayPauseIProps extends CommonIProps {
  state?: 'play' | 'pause'
}
const PlayPauseSm = (props: PlayPauseIProps) => {
  const {
    state = 'play', 
    onClick,
    className = ""
  } = props

  const handleClick = (e:any) => {
    e.stopPropagation()
    if(onClick) onClick()
  }
  return (
    <>
      {
        state === 'play' ? (
          <svg onClick={handleClick} width="34" height="35" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_3882_20454)">
          <path d="M11.3335 7.83301V27.6663L26.9168 17.7497L11.3335 7.83301Z" fill="white"/>
          </g>
          <defs>
          <clipPath id="clip0_3882_20454">
          <rect width="34" height="34" fill="white" transform="translate(0 0.75)"/>
          </clipPath>
          </defs>
          </svg>
        ) : (
          <svg onClick={handleClick} width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_3882_20610)">
          <path d="M8.5 26.9163H14.1667V7.08301H8.5V26.9163ZM19.8333 7.08301V26.9163H25.5V7.08301H19.8333Z" fill="white"/>
          </g>
          <defs>
          <clipPath id="clip0_3882_20610">
          <rect width="34" height="34" fill="white"/>
          </clipPath>
          </defs>
          </svg>
        )
      }
    </>
  )
}

export default PlayPauseSm
