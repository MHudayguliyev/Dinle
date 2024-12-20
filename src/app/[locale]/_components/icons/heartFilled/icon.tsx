import React, { useMemo } from 'react'
import CommonIProps from '../CommonIProps'
import styles from './icon.module.scss'

interface HeartFilledIProps extends CommonIProps {
  active?: boolean
}

const HeartFilledI = (props: HeartFilledIProps) => {
  const {
    onClick, 
    active
  } = props

  return (
    <button type='button' className={styles.baseStyle} onClick={onClick}>
      <span className={styles.icon}>
        {
          active ? (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_7476_17325)">
          <path d="M9.99984 17.7917L8.7915 16.6917C4.49984 12.8 1.6665 10.2333 1.6665 7.08333C1.6665 4.51667 3.68317 2.5 6.24984 2.5C7.69984 2.5 9.0915 3.175 9.99984 4.24167C10.9082 3.175 12.2998 2.5 13.7498 2.5C16.3165 2.5 18.3332 4.51667 18.3332 7.08333C18.3332 10.2333 15.4998 12.8 11.2082 16.7L9.99984 17.7917Z" fill="white"/>
          </g>
          <defs>
          <clipPath id="clip0_7476_17325">
          <rect width="20" height="20" fill="white"/>
          </clipPath>
          </defs>
          </svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_7476_17328)">
            <path d="M13.7498 2.5C12.2998 2.5 10.9082 3.175 9.99984 4.24167C9.0915 3.175 7.69984 2.5 6.24984 2.5C3.68317 2.5 1.6665 4.51667 1.6665 7.08333C1.6665 10.2333 4.49984 12.8 8.7915 16.7L9.99984 17.7917L11.2082 16.6917C15.4998 12.8 18.3332 10.2333 18.3332 7.08333C18.3332 4.51667 16.3165 2.5 13.7498 2.5ZM10.0832 15.4583L9.99984 15.5417L9.9165 15.4583C5.94984 11.8667 3.33317 9.49167 3.33317 7.08333C3.33317 5.41667 4.58317 4.16667 6.24984 4.16667C7.53317 4.16667 8.78317 4.99167 9.22484 6.13333H10.7832C11.2165 4.99167 12.4665 4.16667 13.7498 4.16667C15.4165 4.16667 16.6665 5.41667 16.6665 7.08333C16.6665 9.49167 14.0498 11.8667 10.0832 15.4583Z" fill="white"/>
            </g>
            <defs>
            <clipPath id="clip0_7476_17328">
            <rect width="20" height="20" fill="white"/>
            </clipPath>
            </defs>
            </svg>
          )
        }
      </span>
    </button>
  )
}



export default HeartFilledI
