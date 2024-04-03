import React, { useRef } from 'react'
//styles
import styles from './Dropdown.module.scss'
import useClickOutside from '@app/_hooks/useOutClick'
import ChevronBottomSmI from '@app/_components/icons/chevronBottomSm/icon'

interface DropdownDataType {
  label: string 
  value: string
}

interface DropdownProps {
  data: DropdownDataType[]
  value: string
  onChange: () => void
}

const Dropdown = (props: DropdownProps) => {
    const {
      data, 
      value, 
      onChange
    } = props

    const contentRef:any = useRef(null)
    const toggleRef:any = useRef(null)
    const [show] = useClickOutside(contentRef, toggleRef, 'mousedown')
    console.log('show', show)

  return (
    <div className={styles.dropdown}>
      <div className={styles.head}>
        <span>Рысгал банк</span>
        <ChevronBottomSmI className={styles.chevron}/>
      </div>
    </div>
  )
}

export default Dropdown
