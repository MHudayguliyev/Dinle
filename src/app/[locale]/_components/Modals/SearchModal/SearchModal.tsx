import React, {useEffect, useState} from 'react'
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

    const [isPlaying, setIsPlaying] = useState<boolean>(true)

    function setupAudio(){
        if(typeof navigator !== 'undefined' && navigator.mediaDevices){
          navigator.mediaDevices.getUserMedia({audio: true})
          .then(async stream => {
            const chunks: BlobPart[] | undefined = []
            console.log('strre', stream)
            const recorder = new MediaRecorder(stream)
            recorder.ondataavailable = e => {
              chunks.push(e.data)
            }
            // console.log("chunks", chunks)
            recorder.onstop = e => {
                const blob = new Blob(chunks, { type: 'audio/ogg; codecs=ospus' })
                const blob1 = new Blob(chunks, { type: 'audio/wav; codecs=ospus' })
                // const audioUrl = URL.createObjectURL(blob)
                console.log('blob', blob)
                console.log('blob1', blob1)
            }

            

            // console.log('audioUrl', audioUrl)
    
          })
        }
      }

      useEffect(() => {
        if(show){
            if(isPlaying){
                console.log('p')
                setupAudio()
            }

        }
      }, [show, isPlaying])


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
                <div onClick={() => setIsPlaying(!isPlaying)} >
                    <LottieI 
                        height={126}
                        width={126}
                        icon={ShazamI}
                    />
                </div>
                <p className={styles.text}>
                “Dinle” ses arkaly aydym-sazyn gozlegini dowam et...
                </p>
            </div>
        </Modal>
    </>
  ) 
}

export default SearchModal