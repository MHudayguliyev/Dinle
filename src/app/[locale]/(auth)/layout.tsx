"use client"
//styles
import styles from './layout.module.scss'

export default function AuthLayout({
  children
}: {
  children: React.ReactNode, 
}) {

  return ( 
    <div className={styles.auth__layout}>
      {children}
    </div>
  )
}