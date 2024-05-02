import React from 'react'
import CommonIProps from '../CommonIProps'
interface VolumeIconProps extends CommonIProps {
    /** @defaultValue 0 */
    volume?: 'up' | 'down' | 'mute'
    className?:string
}

const Volume = (props: VolumeIconProps) => {
    const {
        volume = 'down', 
        className = "", 
        onClick
    } = props

  return (
    <>
      {
        volume === 'up' ? (
          <svg onClick={onClick} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_4055_15448)">
          <path d="M2.5 7.49974L2.5 12.4997H5.83333L10 16.6664L10 3.33307L5.83333 7.49974H2.5ZM13.75 9.99974C13.75 8.52474 12.9 7.25807 11.6667 6.64141L11.6667 13.3497C12.9 12.7414 13.75 11.4747 13.75 9.99974ZM11.6667 2.69141V4.40807C14.075 5.12474 15.8333 7.35807 15.8333 9.99974C15.8333 12.6414 14.075 14.8747 11.6667 15.5914V17.3081C15.0083 16.5497 17.5 13.5664 17.5 9.99974C17.5 6.43307 15.0083 3.44974 11.6667 2.69141Z" fill="#A61918"/>
          </g>
          <defs>
          <clipPath id="clip0_4055_15448">
          <rect width="20" height="20" fill="white"/>
          </clipPath>
          </defs>
          </svg>
        ) : volume === 'down' ? (
          <svg onClick={onClick} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_4055_15437)">
          <path d="M15.4167 10.0007C15.4167 8.52565 14.5667 7.25898 13.3334 6.64232V13.3507C14.5667 12.7423 15.4167 11.4757 15.4167 10.0007ZM4.16675 7.50065V12.5007H7.50008L11.6667 16.6673V3.33398L7.50008 7.50065H4.16675Z" fill="#B3B3B3"/>
          </g>
          <defs>
          <clipPath id="clip0_4055_15437">
          <rect width="20" height="20" fill="white"/>
          </clipPath>
          </defs>
          </svg>
        ) : (
          <svg onClick={onClick} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_4055_15449)">
          <path d="M13.75 10C13.75 8.525 12.9 7.25833 11.6667 6.64167V8.48333L13.7083 10.525C13.7333 10.3583 13.75 10.1833 13.75 10ZM15.8333 10C15.8333 10.7833 15.6667 11.5167 15.3833 12.2L16.6417 13.4583C17.1917 12.425 17.5 11.25 17.5 10C17.5 6.43333 15.0083 3.45 11.6667 2.69167V4.40833C14.075 5.125 15.8333 7.35833 15.8333 10ZM3.55833 2.5L2.5 3.55833L6.44167 7.5L2.5 7.5L2.5 12.5H5.83333L10 16.6667L10 11.0583L13.5417 14.6C12.9833 15.0333 12.3583 15.375 11.6667 15.5833V17.3C12.8167 17.0417 13.8583 16.5083 14.7417 15.7917L16.4417 17.5L17.5 16.4417L10 8.94167L3.55833 2.5ZM10 3.33333L8.25833 5.075L10 6.81667V3.33333Z" fill="#B3B3B3"/>
          </g>
          <defs>
          <clipPath id="clip0_4055_15449">
          <rect width="20" height="20" fill="white"/>
          </clipPath>
          </defs>
          </svg>
        )
      }
    </>
  )
}

export default Volume