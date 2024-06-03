"use client"
import { useEffect } from 'react'
//styles
import styles from './layout.module.scss'

export default function AuthLayout({
  children
}: {
  children: React.ReactNode, 
}) {

  useEffect(() => {
    const handleContextMenu = (e:any) => {
      e.preventDefault()
    }
    document.addEventListener('contextmenu',handleContextMenu)
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
    }
  }, [])

  return ( 
    <div className={styles.auth__layout}>
      {children}
    </div>
  )
}