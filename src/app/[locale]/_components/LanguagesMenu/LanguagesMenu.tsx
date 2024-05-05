'use client';
import React from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from '../../../../navigation'
//styles
import classNames from 'classnames/bind'
import styles from './LanguagesMenu.module.scss'
//types
import CommonModalI from '../Modals/CommonModali'
//icons
import CloseI from '../icons/close/icon'
import MobileRectI from '../icons/mobileRect/icon'
import CheckI from '../icons/check/icon'
//lang json
import lang_json from '@app/_assets/json_data/lang_json'
import CustomLink from '../CustomLink/CustomLink';
import { useAppSelector } from '@app/_hooks/redux_hooks';

interface LanguagesMenuProps extends CommonModalI {
  leftCut?: boolean
}

const cn = classNames.bind(styles)
const LanguagesMenu = (props: LanguagesMenuProps) => {
    const {
        show, 
        close, 
        leftCut
    } = props

    const router = useRouter()
    const pathname = usePathname()
    const currentLocale = useLocale()
    const sidebarFolded = useAppSelector(state => state.sidebarReducer.sidebarFolded)

    const changeLanguage = (value: string) => {
      console.log("value", value)
      if(value !== currentLocale){
        router.replace(pathname, {locale: value as string})
        window.location.reload()
      }
    }

  return (
    <div onClick={() => close()} className={cn({
        language: true, 
        openLocale: show, 
        leftCut: !sidebarFolded && leftCut
      })}>
        <CloseI onClick={() => close()} className={styles.closeI}/>
        <div className={styles.language_wrapper}>
          <span className={styles.mobile_rect}>
            <MobileRectI />
          </span>
          <h1>Language</h1>

          <div className={styles.locales}>
            {
              lang_json.map(locale => (
                <div className={cn({
                  locale: true, 
                  active: locale.value === currentLocale
                })} key={locale.value} onClick={(e) => {
                  changeLanguage(locale.value)
                }}>
                  <span>{locale.label}</span>
                  <span className={cn({
                    hideCheckI: currentLocale !== locale.value
                  })}><CheckI /></span>
                </div>
              ))
            }
          </div>
        </div>
    </div>
  )
}

export default LanguagesMenu