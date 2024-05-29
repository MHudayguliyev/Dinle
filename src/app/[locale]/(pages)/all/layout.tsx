'use client';
import React from 'react'
import { useSearchParams } from 'next/navigation';
//styles
import styles from './layout.module.scss'

import TopNavbar from '@app/_components/TopNavbar/TopNavbar'
import PrevNextI from '@app/_components/icons/prevNext/icon'
import { isEmpty, isUndefined } from '@app/_utils/helpers';
//for translation
import { useTranslations } from 'next-intl';

const Layout = ({children}: {children: React.ReactNode}) => {
  const t = useTranslations('tabs')
  const title = useSearchParams().get('title')

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
            {!isUndefined(title) && !isEmpty(title) ? title : t('clip')}
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