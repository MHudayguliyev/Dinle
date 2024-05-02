import React from 'react'
//styles
import styles from './Badge.module.scss';

type BagdeProps<T> = {
    data: T[] | any
}
function Badge <T>(props: BagdeProps<T>) {
    const { data } = props
  return (
    <div className={styles.badge__container}>
        {
            data.map((item:any, index:number) => (
                <div className={styles.badge} key={index}>
                    <span>{item.count}</span>
                    <p>{item.title}</p>
                </div>
            ))
        }
    </div>
  )
}

export default Badge