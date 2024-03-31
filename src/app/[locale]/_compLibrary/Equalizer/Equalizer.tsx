import React from 'react';
// styles
import styles from './Equalizer.module.scss';

const Equalizer = () => {
  return (
    <div className={styles.container}>
      <div className={`${styles.bar} ${styles.barOne}`}></div>
      <div className={`${styles.bar} ${styles.barTwo}`}></div>
      <div className={`${styles.bar} ${styles.barThree}`}></div>
      <div className={`${styles.bar} ${styles.barFour}`}></div>
    </div>
  )
}

export default Equalizer