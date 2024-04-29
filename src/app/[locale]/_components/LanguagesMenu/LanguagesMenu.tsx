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
    const changeLanguage = (value: string) => {
      if(value !== currentLocale){
        router.replace(pathname, {locale: value as string})
      }
    }

  return (
    <div onClick={() => close()} className={cn({
        language: true, 
        openLocale: show, 
        leftCut: leftCut
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
                  e.stopPropagation()
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