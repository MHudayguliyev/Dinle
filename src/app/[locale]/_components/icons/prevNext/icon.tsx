import React, { useCallback } from 'react'
import { useRouter } from 'next/navigation'
import CommonIProps from '../CommonIProps'
//styles 
import styles from './icon.module.scss'

interface PrevNextIProps extends CommonIProps {
    mode: 'prev' | 'next'
}
const PrevNextI = (props: PrevNextIProps) => {
    const {
        mode, 
        className = "", 
        onClick
    } = props
    const router = useRouter()

    const goBack = useCallback(() => {
      if(onClick) return onClick()
      return router.back()
    },[router, onClick])

  return (
    <>
      {
        mode === 'prev' ? (
          <>
            <svg onClick={goBack} className={`${className} ${styles.prev}`} width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_b_7091_23851)">
            <rect width="44" height="44" rx="22" fill="white" fill-opacity="0.05"/>
            <g clip-path="url(#clip0_7091_23851)">
            <path d="M25.41 17.41L24 16L18 22L24 28L25.41 26.59L20.83 22L25.41 17.41Z" fill="white"/>
            </g>
            </g>
            <defs>
            <filter id="filter0_b_7091_23851" x="-33" y="-33" width="110" height="110" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="16.5"/>
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_7091_23851"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_7091_23851" result="shape"/>
            </filter>
            <clipPath id="clip0_7091_23851">
            <rect width="24" height="24" fill="white" transform="translate(10 10)"/>
            </clipPath>
            </defs>
            </svg>


            <svg onClick={goBack} className={`${className} ${styles.mobilePrev}`} width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g filter="url(#filter0_b_4964_14772)">
            <rect width="44" height="44" rx="22" fill="white" fill-opacity="0.05"/>
            <g clip-path="url(#clip0_4964_14772)">
            <path d="M30.0002 21H17.8302L23.4202 15.41L22.0002 14L14.0002 22L22.0002 30L23.4102 28.59L17.8302 23H30.0002V21Z" fill="white"/>
            </g>
            </g>
            <defs>
            <filter id="filter0_b_4964_14772" x="-33" y="-33" width="110" height="110" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feGaussianBlur in="BackgroundImageFix" stdDeviation="16.5"/>
            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_4964_14772"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_4964_14772" result="shape"/>
            </filter>
            <clipPath id="clip0_4964_14772">
            <rect width="24" height="24" fill="white" transform="translate(10 10)"/>
            </clipPath>
            </defs>
            </svg>
          </>
        )

         : 

        <svg onClick={() => router.forward()} className={`${className} ${styles.hide}`} width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_b_7091_23853)">
        <rect width="44" height="44" rx="22" transform="matrix(-1 0 0 1 44 0)" fill="black" fill-opacity="0.5"/>
        <g clip-path="url(#clip0_7091_23853)">
        <path d="M18.59 17.41L20 16L26 22L20 28L18.59 26.59L23.17 22L18.59 17.41Z" fill="white"/>
        </g>
        </g>
        <defs>
        <filter id="filter0_b_7091_23853" x="-33" y="-33" width="110" height="110" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix"/>
        <feGaussianBlur in="BackgroundImageFix" stdDeviation="16.5"/>
        <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_7091_23853"/>
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_7091_23853" result="shape"/>
        </filter>
        <clipPath id="clip0_7091_23853">
        <rect width="24" height="24" fill="white" transform="matrix(-1 0 0 1 34 10)"/>
        </clipPath>
        </defs>
        </svg>

      }
    </>
  )
}

export default PrevNextI
