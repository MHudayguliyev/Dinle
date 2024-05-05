import React from 'react'

interface MoreIProps {
    onClick?: (e: any) => void
    className?: string
    /** @defaultValue horizontal **/
    direction?: 'horizontal' | 'vertical'
}

const More = React.forwardRef<SVGSVGElement, MoreIProps>((props, ref): JSX.Element => {
  const {
    className = "",
    direction = 'horizontal', 
    onClick
  } = props

  const handleClick = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    if(onClick) onClick(e)
  }

  return (
    <>
      {
        direction === 'vertical' ? (
          <svg ref={ref} onClick={handleClick} width="34" height="35" viewBox="0 0 34 35" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect y="0.5" width="34" height="34" rx="4" fill="black" fill-opacity="0.2"/>
          <circle cx="17" cy="23.9608" r="1.61538" transform="rotate(-180 17 23.9608)" fill="white"/>
          <circle cx="17" cy="17.4998" r="1.61538" transform="rotate(-180 17 17.4998)" fill="white"/>
          <circle cx="17" cy="11.037" r="1.61538" transform="rotate(-180 17 11.037)" fill="white"/>
          </svg>
        ) : (
          <svg ref={ref} onClick={handleClick} className={className} width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_b_5414_13157)">
          <g clip-path="url(#clip0_5414_13157)">
          <rect width="40" height="40" rx="20" fill="black" fill-opacity="0.5"/>
          </g>
          <path d="M12.5 18C11.125 18 10 19.125 10 20.5C10 21.875 11.125 23 12.5 23C13.875 23 15 21.875 15 20.5C15 19.125 13.875 18 12.5 18ZM27.5 18C26.125 18 25 19.125 25 20.5C25 21.875 26.125 23 27.5 23C28.875 23 30 21.875 30 20.5C30 19.125 28.875 18 27.5 18ZM20 18C18.625 18 17.5 19.125 17.5 20.5C17.5 21.875 18.625 23 20 23C21.375 23 22.5 21.875 22.5 20.5C22.5 19.125 21.375 18 20 18Z" fill="white"/>
          </g>
          <defs>
          <filter id="filter0_b_5414_13157" x="-28" y="-28" width="96" height="96" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
          <feFlood flood-opacity="0" result="BackgroundImageFix"/>
          <feGaussianBlur in="BackgroundImageFix" stdDeviation="14"/>
          <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_5414_13157"/>
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_5414_13157" result="shape"/>
          </filter>
          <clipPath id="clip0_5414_13157">
          <rect width="40" height="40" rx="20" fill="white"/>
          </clipPath>
          </defs>
          </svg>
        )
      }
    </>

  )
})
More.displayName = 'More'
export default More