import React from 'react'
import CommonModalI from '../CommonModali'
//lib
import Modal from '@app/_compLibrary/Modal'
//styles
import styles from './SearchModal.module.scss';
//lottie
import LottieI from '@components/Lottie/LottieI';
import ShazamI from '@app/_assets/lottie/shazam.json'

interface SearchModalProps extends CommonModalI {}
const SearchModal = (props: SearchModalProps) => {
    const {
        show, 
        close
    } = props


  return (
    <>
        <Modal
            isOpen={show}
            close={close}
            className={styles.searchModal}
            notEntireScreen
        >
            <div className={styles.content}>
                <div className={styles.header}>Dinle</div>
                <LottieI 
                    height={126}
                    width={126}
                    icon={ShazamI}
                />
                <p className={styles.text}>
                “Dinle” ses arkaly aydym-sazyn gozlegini dowam et...
                </p>
            </div>
        </Modal>
    </>
  ) 
}

export default SearchModal