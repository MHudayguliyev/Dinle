'use client';
import React, { useMemo } from 'react'
import { usePathname, useSearchParams } from 'next/navigation';
//styles
import styles from './layout.module.scss'

import TopNavbar from '@app/_components/TopNavbar/TopNavbar'
import PrevNextI from '@app/_components/icons/prevNext/icon'
import { useLocale } from 'next-intl';
import { Localization } from '@app/_types';
import { isEmpty, isUndefined } from '@app/_utils/helpers';

const Layout = ({children}: {children: React.ReactNode}) => {
  const locale = useLocale()
  const search = useSearchParams().get('title')
  const pathname = usePathname()
  const title = useMemo(() => {
    const routes = [
      {
        value: 'song', 
        label: {ru: "Песни", tm: "Aýdymlar"}
      },
      {
        value: 'news', 
        label: {ru: "Новости", tm: "News"}
      },
      {
        value: 'clip', 
        label: {ru: "Клипы", tm: "Klipler"}
      },
      {
        value: 'show', 
        label: {ru: "Шоу", tm: "Showlar"}
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
            {!isUndefined(search) && !isEmpty(search) ? search : title}
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