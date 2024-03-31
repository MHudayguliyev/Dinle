import React, { LegacyRef } from 'react'
interface SongListProps {
  onClick?: () => void
  active: boolean
} 

const List = React.forwardRef<SVGSVGElement, SongListProps>((props, ref): JSX.Element => {
    const {
        onClick, 
        active
    } = props

    const styles = {
      cursor: 'pointer'
    }

  return (
    <>
      {
        active ? (
        <svg ref={ref} style={styles} onClick={onClick}  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clip-path="url(#clip0_4995_13264)">
        <path d="M4 10H16V12H4V10ZM4 6H16V8H4V6ZM4 14H12V16H4V14ZM14 14V20L19 17L14 14Z" fill="#FF3740"/>
        </g>
        <defs>
        <clipPath id="clip0_4995_13264">
        <rect width="24" height="24" fill="white"/>
        </clipPath>
        </defs>
        </svg>
        ) : (
          <svg ref={ref} style={styles} onClick={onClick}  width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clip-path="url(#clip0_4995_13261)">
          <path d="M4 10H16V12H4V10ZM4 6H16V8H4V6ZM4 14H12V16H4V14ZM14 14V20L19 17L14 14Z" fill="white"/>
          </g>
          <defs>
          <clipPath id="clip0_4995_13261">
          <rect width="24" height="24" fill="white"/>
          </clipPath>
          </defs>
          </svg>

        )
      }
    </>
  )
})

export default List
