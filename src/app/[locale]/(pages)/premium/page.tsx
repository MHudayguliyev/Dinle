'use client';
import React, {useState} from 'react'
//styles
import classNames from 'classnames/bind';
import styles from './page.module.scss';
import ChevronLeft from '@app/_components/icons/chevronLeft/icon';
import Input from '@compLibrary/NewInput';
import ProfileHelp from '@components/icons/profileHelp/icon';
import Button from '@app/_compLibrary/Button';
import RadioI from '@app/_components/icons/radio/icon';
import Dropdown from '@app/_compLibrary/Dropdown';

const cn = classNames.bind(styles)
const Premium = () => {
    const paymentTypes = [
        {
            value: '20', label: '1 мес. / 20 man'
        },
        {
            value: '55', label: '1 мес. / 20 man'
        },
        {
            value: '110', label: '1 мес. / 20 man'
        },
        {
            value: '220', label: '1 мес. / 20 man'
        },
    ]
    const banks = [
        {label: "Рысгал банк", value: 'rysgal'}, 
        {label: "Senagat банк", value: 'senagat'}, 
        {label: "Altyn asyr банк", value: 'altyn-asyr'}, 
    ]

    const [paymentIndex, setPaymentIndex] = useState<number>(0)
    const [selectedBank, setSelectedBank] = useState<string>(banks[0].label ?? "")

  return (
    <div className={styles.wrapper}>
        <div className={styles.box}>

            <div className={styles.header}>
                <ChevronLeft />
                <div className={styles.topTitle}>Profile</div>
            </div>


            <form>
                <div className={styles.label}>Номер телефона</div>
                <div className={styles.field}>
                    <Input 
                        type='text'
                        name='phone'
                        inputMode='numeric'
                        fontSize='big'
                        maxLength={8}
                        roundedSm
                        autoComplete='off'
                        className={styles.inputField}
                        startIcon={
                            <div className={styles.mask}>
                                <span>+993</span>
                            </div>
                        }
                    /> 
                </div>

                <div className={styles.dropdownWrapper}>
                    <Dropdown 
                        data={banks}
                        value={selectedBank}
                        onChange={(item) => setSelectedBank(item.label)}
                    />
                </div>


            <div className={styles.payment}>
                <div className={styles.label}>Виды оплаты</div>

                <div className={styles.paymentTypes}>
                    {
                        paymentTypes.map((type, i) => (
                            <div className={cn({
                                type: true, 
                                active: paymentIndex === i
                            })} key={type.value} onClick={() => setPaymentIndex(i)}>
                                <div className={styles.title}>{type.label}</div>
                                <RadioI active={paymentIndex === i}/>
                            </div>
                        ))
                    }
                </div>
            </div>

            <div className={styles.actions}>
                <div className={styles.cartType}>
                    <ProfileHelp />
                    <p>Типы карт поддерживаемые услугой: Алтын асыр карта (остальные банки),Рысгал банк, Сенагат банк</p>
                </div>

                <Button color='red' roundedSm className={styles.actionBtn}>
                    Next
                </Button>
            </div>

            </form>

        </div>
    </div>
  )
}

export default Premium
