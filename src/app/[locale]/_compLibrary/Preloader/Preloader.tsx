import React from 'react'
// custom styles
import styles from './Preloader.module.scss';

export default function Preloader() {
    return (
        <div className={styles.status}>
            <div className={styles.spinner_chase}>
                <div className={styles.chase_dot} />
                <div className={styles.chase_dot} />
                <div className={styles.chase_dot} />
                <div className={styles.chase_dot} />
                <div className={styles.chase_dot} />
                <div className={styles.chase_dot} />
            </div>
        </div>
    )
}
