import React, { useEffect, useRef, useState } from 'react'
//styles
import classNames from 'classnames/bind'
import styles from './Dropdown.module.scss'
import useClickOutside from '@app/_hooks/useOutClick'
import ChevronBottomSmI from '@app/_components/icons/chevronBottomSm/icon'
import RadioI from '@app/_components/icons/radio/icon'
import { isEmpty } from '@app/_utils/helpers'

interface DropdownDataType {
  label: string 
  value: string
}

interface DropdownProps {
  data: DropdownDataType[]
  value: string
  onChange: (data: DropdownDataType) => void
}

const cn = classNames.bind(styles)
const Dropdown = (props: DropdownProps) => {
    const {
      data, 
      value, 
      onChange
    } = props

    const contentRef:any = useRef(null)
    const toggleRef:any = useRef(null)
    const [show] = useClickOutside(contentRef, toggleRef, 'mousedown')
    const [mainTitle, setMainTitle] = useState<string>(value ?? "")

    useEffect(() => {
      if(!isEmpty(value)) setMainTitle(value)
    }, [value])

  return (
    <div className={styles.dropdown}>
      <div className={styles.head} ref={toggleRef}>
        <span>{mainTitle}</span>
        <ChevronBottomSmI className={styles.chevron}/>
      </div>

      <div ref={contentRef} className={cn({
        dropdown__content: true, 
        show: show
      })}>
        <div className={styles.dropdown__body}>

          {
            data?.map(item => (
              <div className={cn({
                item: true, 
                active: mainTitle === item.label
              })} key={item.value} onClick={() => onChange(item)}>
                <span>{item.label}</span>
                <RadioI active={mainTitle === item.label}/>
              </div>
            ))
          }

        </div>
      </div>
    </div>
  )
}

export default Dropdown
