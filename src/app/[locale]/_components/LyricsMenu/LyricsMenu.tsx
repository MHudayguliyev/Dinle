import React, { LegacyRef } from 'react'
//styles
import styles from './LyricsMenu.module.scss'
import classNames from 'classnames/bind'
//hooks
import { useAppSelector } from '@app/_hooks/redux_hooks'

interface LyricsMenuProps {
  show: boolean
  contentRef?: LegacyRef<HTMLDivElement>
}
const cn = classNames.bind(styles)
const LyricsMenu = (props: LyricsMenuProps) => {
    const {
      show, 
      contentRef
    } = props
    const lyrics = useAppSelector(state => state.mediaReducer.song)?.lyrics
    const sidebarFolded = useAppSelector(state => state.sidebarReducer.sidebarFolded)

  return (
    <div className={cn({
        wrapper: true, 
        showLyrics: show, 
        sidebarFolded: sidebarFolded
      })} ref={contentRef}>
          {
            lyrics.split('\n').map(item => (
              <p>{item}</p>
            ))
          }
    </div>
  )
}

export default LyricsMenu