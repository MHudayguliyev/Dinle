"use client"
import React, {useEffect, useRef, useState} from 'react'
import { usePathname } from 'next/navigation'
// sidebar
import Sidebar from "@components/Sidebar/Sidebar"
//styles
import styles from './layout.module.scss'
import classNames from 'classnames/bind'
//
import AudioPlayer from '@app/_components/Players/Audio/audio'
import SideMenu from '@app/_components/SideMenu/SideMenu'
import useClickOutside from '@app/_hooks/useOutClick'
import AuthModal from '@app/_components/Modals/AuthModal/AuthModal'
//redux
import { useAppSelector, useAppDispatch } from '@app/_hooks/redux_hooks'
import { closeModal } from '@app/_redux/reducers/AuthReducer'
import { setIsBlockOverflow } from '@redux/reducers/OverflowReducer'
//comps
import LyricsMenu from '@app/_components/LyricsMenu/LyricsMenu'

const cn = classNames.bind(styles)
export default function PagesLayout({
  children
}: {
  children: React.ReactNode, 
}) {
  const dispatch = useAppDispatch()
  const toggleSideMenuRef:any = useRef(null)
  const listContentRef:any = useRef(null)
  const toggleLyricsRef:any = useRef(null)
  const lyricsContentRef:any = useRef(null)

  const [show, setShow] = useClickOutside(listContentRef, toggleSideMenuRef, 'mousedown')
  const [showLyrics] = useClickOutside(lyricsContentRef, toggleLyricsRef, 'mousedown')
  const [hideSidebar, setHideSidebar] = useState<boolean>(false)

  const showAuthModal = useAppSelector(state => state.authReducer.showAuthModal)
  const isAudioPlayerOpen = useAppSelector(state => state.mediaReducer.isAudioPlayerOpen)

  useEffect(() => {
    if(lyricsContentRef){
      if(showLyrics)
      dispatch(setIsBlockOverflow(true))
      else dispatch(setIsBlockOverflow(false))
    }
  }, [lyricsContentRef, showLyrics])

  return (
    <div className={styles.layout__container}  tabIndex={1}>
      <Sidebar 
        hideSidebar={hideSidebar}
        setHideSidebar={setHideSidebar}
      />  
      <div className={cn({
        layoutContent: true, 
        marginBottom: isAudioPlayerOpen
      })}>
        <div className={cn({
          layoutChildren: true, 
        })}>
          {children}
        </div>
        
        <AuthModal 
          show={showAuthModal}
          close={() => dispatch(closeModal())}
        />
        <LyricsMenu 
          show={showLyrics}
          contentRef={lyricsContentRef}
        />
        <SideMenu show={show} setShow={setShow} contentRef={listContentRef}/>
      </div>

      <AudioPlayer 
        toggleSideMenuRef={toggleSideMenuRef}
        toggleLyricsRef={toggleLyricsRef}
        showSideMenu={show}
        showLyricsMenu={showLyrics}
      />

    </div>
  )
}

