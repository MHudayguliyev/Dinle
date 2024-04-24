import React, {useEffect, useRef, useState} from 'react'
import CommonModalI from '../CommonModali'
//lib
import Modal from '@app/_compLibrary/Modal'
//styles
import styles from './SearchModal.module.scss';
//lottie
import LottieI from '@components/Lottie/LottieI';
import ShazamI from '@app/_assets/lottie/shazam.json'
import UseTimeoutOnce from '@app/_hooks/useTimeoutOnce';
import axios from 'axios';
import { headers } from 'next/headers';
import authToken from '@app/_api/Services/auth_token';

interface SearchModalProps extends CommonModalI {}
const SearchModal = (props: SearchModalProps) => {
    const {
        show, 
        close
    } = props

    const audioRef:any = useRef(null)
    const recorderRef:any = useRef(null)
    const [hasTimedOut, setHasTimedOut] = useState<boolean>(false);
  
      useEffect(() => {
        if (show && !hasTimedOut) { // Ensure timeout happens only once
          let chunks:any = []
          if(navigator.mediaDevices){
            navigator.mediaDevices.getUserMedia({ audio: true })
            .then(async (stream) => {
              console.log('stream', stream)

              recorderRef.current = new MediaRecorder(stream)
              recorderRef.current.start();

              console.log("rce", recorderRef)
              recorderRef.current.ondataavailable = (e: any) => {
                chunks.push(e.data)
              }

              recorderRef.current.onstop = async (e: any) => {
                const blob = new Blob(chunks, { type: 'audio/webm' })
                console.log("blob", blob)
                const formData = new FormData()
                formData.append('fileUrl', blob)

                try {
                  const base = 'http://95.85.125.44:4033/test/'
                  const response = await axios.post(`${base}artists/shazam`, formData,  {
                    headers: {
                      'Content-type': 'multipart/form-data', 
                      'Authorization': 'Bearer ' + authToken()
                    }, 
                  })


                  console.log('response from shazam', response)
                } catch (error) {
                  console.log('send audio file error', error)
                }

                chunks = []
              }
            })
          }
          const timer = setTimeout(async() => {
            console.log('hello stoping shazam')
            recorderRef.current.stop()
          
            setHasTimedOut(true); 
          }, 15000);
          return () => clearTimeout(timer);
        }else if(!show && hasTimedOut){
          setHasTimedOut(false)
        }
      }, [hasTimedOut, show]);

  return (
    <>
        <Modal
            isOpen={show}
            close={close}
            className={styles.searchModal}
            notEntireScreen
        >
            {/* <audio ref={audioRef} controls/> */}

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