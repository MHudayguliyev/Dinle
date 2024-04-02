import React from 'react'
//styles
import styles from './page.module.scss';
import ChevronRightI from '@app/_components/icons/chevronRight/icon';
import Input from '@app/_compLibrary/Input';

const Premium = () => {



  return (
    <div className={styles.wrapper}>
        <div className={styles.box}>

            <div className={styles.header}>
                <ChevronRightI />
                <h2>Profile</h2>
            </div>


            <form>
                <label htmlFor='phone'>Номер телефона</label>
                <div className={styles.field}>
                    <Input 
                    type='text'
                    name='phone'
                    inputMode='numeric'
                    maxLength={8}
                    roundedSm
                    showLoginMask
                    fontSize='medium' 
                    fontWeight='medium'
                    outline='light'
                    autoComplete='off'
                    className={styles.inputField}
                    /> 
                </div>
            </form>

        </div>
    </div>
  )
}

export default Premium
