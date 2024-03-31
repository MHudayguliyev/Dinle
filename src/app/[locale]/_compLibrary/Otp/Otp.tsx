import React, { ChangeEvent } from 'react'

//styles 
import styles from './Opt.module.scss'
import classNames from 'classnames/bind'
import Input from '../Input'
import { isEmpty } from '@app/_utils/helpers'

type OtpTypes = {
    id: string
    prevId:string | any
    nextId?: string
    value:string | undefined
    onValueChange: (id: string, e:ChangeEvent<HTMLInputElement>) => void
    handleSubmit: () => void
    onFocus: (id: string) => void
    resetError?: () => void // enough to provide just in 1st pin, no need to provide in each pin
    autoFocus?: boolean
    focus: string
    error?: boolean
}

const cn = classNames.bind(styles)
const Otp = (props: OtpTypes) => {
    const {
        id, 
        prevId, 
        nextId, 
        value = '', 
        focus = '', 
        autoFocus = false,
        error = false,
        onValueChange, 
        handleSubmit, 
        onFocus, 
        resetError, 
    } = props


    const handleKeyUp = (e:any) => {
        if (e.keyCode === 8 || e.keyCode === 37) {
            const prev:any = document.getElementById(prevId);
            if (prev) prev.select()
            else if(error && resetError) resetError()
           
        } else if (
            (
                (e.keyCode >= 48 && e.keyCode <= 57) || //check if key is numeric keys 0 to 9
                (e.keyCode >= 65 && e.keyCode <= 90) || //check if key is alphabetical keys A to Z
                (e.keyCode >= 96 && e.keyCode <= 105) || //check if key is numeric keypad keys 0 to 9
                e.keyCode === 39 //check if key is right arrow key
            ) && !isEmpty(value) // value should not be empty to go to next field
        ) {
            const next:any = document.getElementById(nextId??"");
            if (next) 
                next.select();
             else {
                const inputGroup = document.getElementById('OTP');
                if (inputGroup && inputGroup.dataset['autosubmit']) handleSubmit();
                
            }
        }
    }

    const handleKeyDown = (e: any) => {
        const keyCode = e.keyCode || e.which;
        if (keyCode === 32 || !/[0-9\b]/.test(String.fromCharCode(keyCode))) {
            e.preventDefault();
        }
    }


  return (
    <div className={cn({
        otp__base_style: true, 
        focused: (!error && focus === id), 
        filled: (!error && !isEmpty(value)), 
        error: (error && isEmpty(value)), 
        errorFilled: (error && !isEmpty(value))
    })}>
        <input 
            {...props}
            autoFocus={autoFocus}
            id={id}
            name={id}
            type='text'
            inputMode='numeric'
            value={value}
            maxLength={1}
            onChange={(e) => onValueChange(id, e)}
            onKeyUp={handleKeyUp}
            onKeyDown={handleKeyDown}
            onFocus={() => onFocus(id)}
            className={cn({
                otp__field: true,
            })}
        />
    </div>
  )
}

export default Otp