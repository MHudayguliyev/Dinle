'use client';
import React, {ChangeEvent, useState} from 'react';
import Image from 'next/image';
import {useFormik} from 'formik'
import * as Yup from 'yup'
import {useRouter} from 'next/navigation'
//styles
import styles from './page.module.scss';
import classNames from 'classnames/bind';
//libs
import Input from '@app/_compLibrary/NewInput';
import Button from '@app/_compLibrary/Button';
import Otp from '@app/_compLibrary/Otp';
//images
import logo from '@app/_assets/images/logo.png'
//api
import { checkOtp, sendOtp, signUp } from '@app/_api/Queries/Post';
//icons
import GlobusI from '@app/_components/icons/globus/icon';
//comps
import LanguagesMenu from '@app/_components/LanguagesMenu/LanguagesMenu';
//utils
import {getUserDevice, stringify} from '@utils/helpers'
import { setToStorage } from '@app/_utils/storage';
import moment from 'moment';

interface Fields<T> {
  input1: T
  input2: T
  input3: T
  input4: T
}

const cn = classNames.bind(styles)
const Login = () => {
  const router = useRouter()
  //lang states
  const [isLangOpen, setIsLangOpen] = useState<boolean>(false)

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
      console.log('value', values)
      try {
        const phone = '+993' + values.phone
        const response = await signUp({phone: phone})  
        console.log('response', response)
        if(response.statusCode === 200){
          try {
            const response = await sendOtp({phone: phone})      
            console.log('otps resiult', response)      
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
    if(!isError) {
      try {
        const otp = parseInt(Object.values(inputValues).join(''))
        const response = await checkOtp({
          phone,otp, 
          device: getUserDevice()
        })
        console.log("response", response)

        if(response.statusCode === 200 && response.success){
          setToStorage('authUser', stringify({
            access_token: response.data?.token, 
            refresh_token: response?.data?.refreshToken, 
            username: response.data?.phone,
            userId: response.data?.userId,
            expiresAt: moment(response.data?.worksUntil).format('YYYY-MM-DD HH:mm:ss')
          }))
          router.replace('/')
        }
      } catch (error) {
        console.log('SEND OTP error', error)
      }

    } 
  };

  return (
    <>

      <LanguagesMenu 
        show={isLangOpen}
        close={() => setIsLangOpen(false)}
      />

      {
        mode === 'login' ? (
          <div className={styles.login__container}>
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

              <div className={styles.btnGroup}>
                <Button
                  htmlType='submit' 
                  color='red'
                  roundedSm 
                >
                  Продолжить
                </Button>
                <Button
                  color='lightDark'
                  roundedSm 
                  onClick={() => setIsLangOpen(true)}
                  startIcon={<GlobusI />}
                >
                  Выбрать язык
                </Button>
              </div>

            </form>
          </div>
        ) : (
          <div className={styles.otp__container}>
            <div className={styles.header}>
                <h4>Введите код из смс</h4>
                <p>Oтправили код на номер +99363 XX XX XX</p>
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
            <p className={styles.timer}>Новый код (0:13)</p>
            {/* <p className={styles.resend__code}>Отправить код сначала</p> */}
        </div>
        )
      }
    </>
  )
}

export default Login