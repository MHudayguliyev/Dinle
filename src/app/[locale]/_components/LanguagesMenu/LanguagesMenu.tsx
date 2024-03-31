import React, { useState } from 'react'
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

  const [selectedLang, setSelectedLang] = useState<string>("tm")

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
                  active: selectedLang === locale.value
                })} key={locale.value} onClick={(e) => {
                  e.stopPropagation()
                  setSelectedLang(locale.value)
                }}>
                  <span>{locale.label}</span>
                  <span className={cn({
                    hideCheckI: selectedLang !== locale.value
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