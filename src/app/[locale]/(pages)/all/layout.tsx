'use client';
import React, { useMemo } from 'react'
import { usePathname } from 'next/navigation';
//styles
import styles from './layout.module.scss'

import TopNavbar from '@app/_components/TopNavbar/TopNavbar'
import PrevNextI from '@app/_components/icons/prevNext/icon'
import { useLocale } from 'next-intl';
import { Localization } from '@app/_types';

const Layout = ({children}: {children: React.ReactNode}) => {
  const locale = useLocale()
  const pathname = usePathname()
  const title = useMemo(() => {
    console.log("locale", locale)
    const routes = [
      {
        value: 'song', 
        label: {ru: "Songs", tk: "Aydymlar"}
      },
      {
        value: 'news', 
        label: {ru: "News", tk: "News"}
      },
      {
        value: 'clip', 
        label: {ru: "Clips", tk: "Klipler"}
      },
      {
        value: 'show', 
        label: {ru: "Shows", tk: "Showlar"}
      },
    ]
    for(let i = 0; i < routes.length; i++){
      const route = routes[i]
      const value = route.value
      if(pathname.toLowerCase().includes(value)){
        return route.label[locale as keyof Localization]
      }
    }
  }, [pathname, locale])


  return (
    <>
      <TopNavbar 
        className={styles.topHeader}
        renderOptions={() => (
            <div className={styles.opts}>
                <PrevNextI  mode='prev'/>
                <PrevNextI  mode='next'/>
            </div>
        )}
        renderActions={() => (
          <div className={styles.title}>
              {title}
          </div>
        )}
      />
      <div className={styles.layout}>
        {children}
      </div>
    </>
  )
}

export default Layout