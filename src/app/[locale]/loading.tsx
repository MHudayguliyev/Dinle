import React from 'react'
import Preloader from './_compLibrary/Preloader';
//styles
import styles from './loading.module.scss';

const Loading = () => {
  return (
    <div className={styles.loading__container}>
        <Preloader />
    </div>
  )
}

export default Loading;