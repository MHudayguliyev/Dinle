import React from 'react'
//styles
import styles from './page.module.scss';
// import music from '@app/_assets/mp3/'

const Shows = () => {
  // console.log("music", music)
  return (
    <div>
        <audio controls>
            <source src="/horse.mp3" />
        </audio>
    </div>
  )
}

export default Shows