import React, {ChangeEvent, useState} from 'react'
//styles
import classNames from 'classnames/bind'
import styles from './DeviceModal.module.scss'
//types
import CommonModalI from '../CommonModali'
//lib
import Modal from '@app/_compLibrary/Modal'
import Button from '@app/_compLibrary/Button'
import Otp from '@app/_compLibrary/Otp'
import { removeDevice } from '@app/_api/Queries/Post'

interface DeviceModalProps extends CommonModalI {
    deviceId: string
    onSuccess: () => void
}

interface Fields<T> {
    input1: T
    input2: T
    input3: T
    input4: T
}

const cn = classNames.bind(styles)
const DeviceModal = (props: DeviceModalProps) => {
    const {
        show, 
        close, 
        deviceId, 
        onSuccess
    } = props

    const [focusOn, setFocusOn] = useState<string>('input1'); //defaults set to input1
    const [error, setError] = useState<boolean>(false)
    const [inputValues, setInputValues] = useState<Fields<string>>({
      input1: '',
      input2: '',
      input3: '',
      input4: '',
    });

    const dummyData = '1234'
    const handleInputChange = (inputId:string, event:ChangeEvent<HTMLInputElement>) => {
      setInputValues((prevInputValues) => ({
          ...prevInputValues,
          [inputId]: event.target.value,
      }));
    };

    const handleSubmit = async() => {
        const keys = Object.keys(inputValues)
        console.log("keys",keys)
        let isError = false;
        for(let i = 0; i < keys.length; i++){
          const field = inputValues[keys[i] as keyof Fields<string>]
          if(field as string !== dummyData[i]){
            isError = true
          }
        }
        setError(isError)
        console.log('int vals', inputValues)

        if(!isError){
            console.log("deviceId", deviceId)
            try {
                const response = await removeDevice(deviceId);
                console.log('resois', response)
                if(response.success && response.statusCode === 200){
                    close()
                    onSuccess()
                    setInputValues({
                        input1: '',
                        input2: '',
                        input3: '',
                        input4: '',
                    })
                }
                
            } catch (error) {
                console.log('remove device error', error)
            }


        }
    }
  

  return (
    <>
        <Modal
            isOpen={show}
            close={close}
            className={styles.deviceModal}
        >

            <div className={styles.wrapper}>
                <div className={styles.content}>

                    <div className={`${styles.header} ${styles.otpHeader}`}>
                        <h4>Введите код из смс</h4>
                        <p>Oтправили код на номер +99363 XX XX XX</p>
                    </div>

                    <div className={styles.changeNumber}>
                        Изменить номер
                    </div>

                    <div className={styles.otp}>
                        <div className={styles.otp__fields} id='OTP' data-autosubmit="true">
                            <Otp 
                            autoFocus
                            id='input1'
                            value={inputValues.input1} 
                            focus={focusOn}
                            error={error}
                            resetError={() => setError(false)}
                            onFocus={(index) => setFocusOn(index)}
                            onValueChange={handleInputChange}
                            prevId={null}
                            nextId='input2'
                            handleSubmit={handleSubmit}
                            />
                            <Otp 
                            id='input2'
                            value={inputValues.input2} 
                            focus={focusOn}
                            error={error}
                            onFocus={(index) => setFocusOn(index)}
                            onValueChange={handleInputChange}
                            prevId='input1'
                            nextId='input3'
                            handleSubmit={handleSubmit}
                            />
                            <Otp 
                            id='input3'
                            value={inputValues.input3} 
                            focus={focusOn}
                            error={error}
                            onFocus={(index) => setFocusOn(index)}
                            onValueChange={handleInputChange}
                            prevId='input2'
                            nextId='input4'
                            handleSubmit={handleSubmit}
                            />
                            <Otp 
                            id='input4'
                            value={inputValues.input4} 
                            focus={focusOn}
                            error={error}
                            onFocus={(index) => setFocusOn(index)}
                            onValueChange={handleInputChange}
                            prevId='input3'
                            handleSubmit={handleSubmit}
                            />

                        </div>
                        <p className={cn({
                            error__text: true, 
                            showErrorTxt: error
                        })}>Введен неверный код. Попробуйте отправить код заново.</p>
                    </div>
                    <Button onClick={e => {
                        e.stopPropagation()
                        close()
                    }} color='lightDark' roundedSm  className={styles.resend}>
                        Cancel
                    </Button>

                </div>

            </div>
        </Modal>
    </>
  )
}

export default DeviceModal