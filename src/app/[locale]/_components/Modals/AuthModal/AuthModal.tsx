import React, {ChangeEvent, useEffect, useState} from 'react'
import Image from 'next/image'
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {useRouter} from 'next/navigation'
//types
import CommonModalI from '../CommonModali'
//lib
import Modal from '@app/_compLibrary/Modal'
//styles
import styles from './AuthModal.module.scss'
import classNames from 'classnames/bind'
//logo
import logo from '@app/_assets/images/logo.png'
//libs
import Button from '@app/_compLibrary/Button'
import Input from '@app/_compLibrary/NewInput'
import Otp from '@compLibrary/Otp/Otp';
//api
import { checkOtp, sendOtp, signUp } from '@app/_api/Queries/Post'
//utils
import { getUserDevice, stringify } from '@app/_utils/helpers'
import { setToStorage } from '@app/_utils/storage'
//react toast 
import toast from 'react-hot-toast'
import moment from 'moment'


interface Fields<T> {
    input1: T
    input2: T
    input3: T
    input4: T
}

interface AuthModalProps extends CommonModalI {}

const cn = classNames.bind(styles)
const AuthModal = (props: AuthModalProps) => {
    const {
        show, 
        close, 
    } = props

  const router = useRouter()
  const [mode, setMode] = useState<'login' | 'otp'>('login')
  const [phone, setPhone] = useState<string>("")
  const [focusOn, setFocusOn] = useState<string>('input1'); //defaults set to input1
  const [error, setError] = useState<boolean>(false)
  const [inputValues, setInputValues] = useState<Fields<string>>({
    input1: '',
    input2: '',
    input3: '',
    input4: '',
  });

  const formik = useFormik({
    initialValues: {
      phone: ''
    }, 
    validationSchema: Yup.object({
        phone: Yup.string().required().matches(/(?:(61|62|63|64|65|71)[0-9]{6})$/, 'Phone must start with 6[1-5]/71')
    }), 
    onSubmit: async (values, {resetForm}) => {
      try {
        const phone = '+993' + values.phone
        const response = await signUp({phone: phone})  
        if(response.statusCode === 200){
          try {
            const response = await sendOtp({phone: phone})      
            if(response.statusCode === 200){
              setPhone(phone)
              setMode('otp')
              resetForm()
            }
          } catch (error) {
            console.log('OTP SENDING error', error)
          }
        }
        
      } catch (error) {
        console.log('LOGIN error', error)
      }
    }
  })


  const handleInputChange = (inputId:string, event:ChangeEvent<HTMLInputElement>) => {
    setInputValues((prevInputValues) => ({
        ...prevInputValues,
        [inputId]: event.target.value,
    }));
  };
  const handleSubmit = async() => {
    try {
      const otp = parseInt(Object.values(inputValues).join(''))
      console.log('otp.....', otp)
      const response = await checkOtp({
        phone,otp, 
        device: getUserDevice()
      })
      // console.log("otp response",response)
      if(response.statusCode === 200 && response.success){
        setToStorage('authUser', stringify({
          access_token: response.data?.token, 
          refresh_token: response?.data?.refreshToken, 
          username: response.data?.phone,
          userId: response.data?.userId,
          expiresAt: moment(response.data?.worksUntil).format('YYYY-MM-DD HH:mm:ss')
        }))
        router.replace('/')
      }else {
        setError(true)
      }
    } catch (error) {
      console.log('SEND OTP error', error)
    }
  };

  useEffect(() => {
    if(!show) setMode('login')
  }, [show])

  return (
    <>
        <Modal 
            isOpen={show}
            close={close}
            className={styles.authModal}
        >
           {
            mode === 'login' ? (
                <div className={styles.content}>
                    <div className={styles.logo}>
                        <Image src={logo} alt='logo'/>
                        <div className={styles.logoTxt}>
                            Dinle
                        </div>
                    </div>

                    <div className={styles.header}>
                        <h4>Номер телефона</h4>
                        <p>Пожалуйста, уточните код страны и введите свой номер телефона.</p>
                    </div>


                    <form className={styles.formik} onSubmit={formik.handleSubmit}>
                      <div>
                        <div className={styles.field}>
                          <Input 
                            type='search'
                            name='phone'
                            inputMode='numeric'
                            maxLength={8}
                            roundedSm
                            fontSize='medium' 
                            fontWeight='medium'
                            autoComplete='off'
                            className={styles.inputField}
                            value={formik.values.phone}
                            onChange={e => {
                              formik.handleChange(e)
                              formik.setFieldTouched('phone', false, false)
                            }}
                            startIcon={
                              <div className={styles.mask}>
                                  <span>+993</span>
                              </div>
                          }
                          /> 
                        </div>

                        <div className={styles.error}>
                          {
                            formik.errors.phone && formik.touched.phone ? 
                            formik.errors.phone : null
                          }
                        </div>
                      </div>
                        <Button
                            htmlType='submit' 
                            color='red'
                            roundedSm 
                        >
                            Продолжить
                        </Button>
                    </form>
                </div>
            ) : (
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

                    <Button color='lightDark' roundedSm  className={styles.resend}>
                        Tazeden ugratmak
                    </Button>
                </div>
            )
           }
        </Modal>
    </>
  )
}

export default AuthModal