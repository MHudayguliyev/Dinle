import React from 'react'
import { useRouter } from 'next/navigation';
//types
import CommonModalI from '../CommonModali'
//lib
import Modal from '@app/_compLibrary/Modal'
//styles
import styles from './Logout.module.scss'
//icons 
import logoutIcon from '@app/_assets/images/logout-lg.png'
import Image from 'next/image'
import Button from '@app/_compLibrary/Button'


import { getUserDevice } from '@app/_utils/helpers';
import { logOut } from '@app/_api/Queries/Post';
import { removeFromStorage } from '@app/_utils/storage';

interface LogoutModalProps extends CommonModalI {}
const LogoutModal = (props: LogoutModalProps) => {
    const {
        show, 
        close
    } = props

    const router = useRouter()
    const logout = async () => {
        const device = getUserDevice()
        try {
            const response = await logOut(device!?.id)
            console.log("res", response)
            if(response.success && response.statusCode === 200 && response.data.logout){
                console.log('response', response)
                router.replace('/login')
                removeFromStorage('authUser')
            }
        } catch (error) {
            console.log("logut error", error)
        }
    }

  return (
    <>
      <Modal 
        isOpen={show}
        close={close}
        className={styles.logoutModal}
        hideClose
        styleOfModalBody={{
            display: 'flex', 
            flexDirection: "column", 
            justifyContent: "center"
        }}
      >
        <div className={styles.content}>
            <div className={styles.logout}>
                <Image src={logoutIcon} alt='logoutIcon'/>
            </div>

            <div className={styles.theCenter}>
                <div className={styles.deleteAccountTxt}>
                    Удалить аккаунт?
                </div>
                <div className={styles.sureTxt}>
                    Уверены, что хотите удалить аккаунт? Все ваши данные будут удалены!
                </div>
            </div>

            <div className={styles.btnGroup}>
                <Button color="lightDarkFourth" roundedSm className={styles.action} onClick={() => close()}>
                    Cancel
                </Button>
                <Button color="darkRed" roundedSm className={styles.action} onClick={logout}>
                    Yes
                </Button>
            </div>
        </div>
      </Modal>
    </>
  )
}

export default LogoutModal
