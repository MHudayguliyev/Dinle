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
import ArrowRightI from '@app/_components/icons/arrowRight/icon'
import { setToggleSidebar } from '@app/_redux/reducers/SidebarReducer'
import Button from '@app/_compLibrary/Button'

const cn = classNames.bind(styles)
export default function PagesLayout({
  children
}: {
  children: React.ReactNode, 
}) {
  const basePath = usePathname()
  const dispatch = useAppDispatch()
  const toggleSideMenuRef:any = useRef(null)
  const listContentRef:any = useRef(null)

  const [show, setShow] = useClickOutside(listContentRef, toggleSideMenuRef, 'mousedown')
  const [showLyrics, setShowLyrics] = useState<boolean>(false)
  const [hideSidebar, setHideSidebar] = useState<boolean>(false)

  const showAuthModal = useAppSelector(state => state.authReducer.showAuthModal)
  const isAudioPlayerOpen = useAppSelector(state => state.mediaReducer.isAudioPlayerOpen)
  const sidebarFolded = useAppSelector(state => state.sidebarReducer.sidebarFolded)

  useEffect(() => {
    const handleContextMenu = (e:any) => {
      e.preventDefault()
    }
    document.addEventListener('contextmenu',handleContextMenu)
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  useEffect(() => {
    if(showLyrics) setShowLyrics(false)
  }, [basePath])

  useEffect(() => {
    if(showLyrics)
    dispatch(setIsBlockOverflow(true))
    else dispatch(setIsBlockOverflow(false))
  }, [showLyrics, dispatch])

  return (
    <div className={styles.layout__container}>
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
          sidebarFolded: sidebarFolded
        })}>
          {
            sidebarFolded && 
            <Button color='lightDark' roundedSm className={styles.openSidebar} onClick={() => dispatch(setToggleSidebar(false))}>
              <ArrowRightI /> 
            </Button>
          }
          {children}
        </div>
        
        <AuthModal 
          show={showAuthModal}
          close={() => dispatch(closeModal())}
        />
        <LyricsMenu show={showLyrics}/>
        <SideMenu show={show} setShow={setShow} contentRef={listContentRef}/>
      </div>

      <AudioPlayer 
        toggleSideMenuRef={toggleSideMenuRef}
        showSideMenu={show}
        showLyricsMenu={showLyrics}
        onToggleLyrics={() => setShowLyrics(!showLyrics)}
      />

    </div>
  )
}

