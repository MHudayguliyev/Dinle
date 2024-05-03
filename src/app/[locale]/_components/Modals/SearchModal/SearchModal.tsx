import React, {useEffect, useRef, useState} from 'react'
import { useRouter } from 'next/navigation';
import CommonModalI from '../CommonModali'
//lib
import Modal from '@app/_compLibrary/Modal'
//styles
import styles from './SearchModal.module.scss';
//lottie
import LottieI from '@components/Lottie/LottieI';
import ShazamI from '@app/_assets/lottie/shazam.json'
import axios, { isAxiosError } from 'axios';
import authToken, { refreshAccessToken } from '@app/_api/Services/auth_token';
import SongList from '@app/_components/SongList/SongList';
import Songs from '@app/_api/types/queryReturnTypes/Songs';
import { useAppDispatch } from '@app/_hooks/redux_hooks';
import { setCurrentSong } from '@app/_redux/reducers/MediaReducer';

interface SearchModalProps extends CommonModalI {}
const SearchModal = (props: SearchModalProps) => {
    const {
        show, 
        close
    } = props

    const router = useRouter()
    const dispatch = useAppDispatch()
    const recorderRef:any = useRef(null)
    const [hasTimedOut, setHasTimedOut] = useState<boolean>(false);
    const [found, setFound] = useState<boolean>(false)
    const [isGathering, setIsGathering] = useState<boolean>(false)
    const [songs, setSongs] = useState<Songs['rows']>([])

    const refreshToken = (cb: Function) => {
      refreshAccessToken().then(isError => {
          if(isError) router.replace('/login')
          else cb()
      })
    }

    const shazamify = async (chunks: any[]) => {
      const blob = new Blob(chunks, { type: 'audio/mp3' })
      const formData = new FormData()
      formData.append('fileUrl', blob)

      try {
        setIsGathering(true)
        const base = 'http://95.85.125.44:4033/test/'
        const response = await axios.post(`${base}artists/shazam`, formData,  {
          headers: {
            'Content-type': 'multipart/form-data', 
            'Authorization': 'Bearer ' + authToken()
          }, 
        })

        if(response.data.statusCode === 200 && response.data && response.data.data){
          setSongs(response.data.data)
          setFound(true)
          return {success: true}
        }
        setIsGathering(false)
        console.log('response from shazam', response.data.data)
        return {success: false}
      } catch (error) {
        if(isAxiosError(error)){
          if(error.response?.status === 401){
            refreshToken(() =>  shazamify(chunks))
          }
        }
        setFound(false)
        setIsGathering(false)
        console.log('send audio file error', error)
      }
    }
  
      useEffect(() => {
        if (show && !hasTimedOut) { // Ensure timeout happens only once
          let chunks:any = []
          if(navigator.mediaDevices){
            // console.log("navigator.mediaDevices", navigator.mediaDevices)
            navigator.mediaDevices.getUserMedia({ audio: true })
            .then(async (stream) => {
              recorderRef.current = new MediaRecorder(stream)
              recorderRef.current.start();
              recorderRef.current.ondataavailable = (e: any) => {
                chunks.push(e.data)
              }
              recorderRef.current.onstop = async (e: any) => {
                const response = await shazamify(chunks)
                if(response?.success)
                chunks = []
              }
            })
          }
          const timer = setTimeout(async() => {
            // console.log('hello stoping shazam')
            recorderRef?.current?.stop()
          
            setHasTimedOut(true); 
          }, 15000);
          return () => clearTimeout(timer);
        }else if(!show && hasTimedOut){
          setHasTimedOut(false)
          setFound(false)
          setIsGathering(false)
        }
      }, [hasTimedOut, show]);

  return (
    <>
        <Modal
            isOpen={show}
            close={close}
            className={styles.searchModal}
            notEntireScreen
            removeOutClick
        >
            {/* <audio ref={audioRef} controls/> */}

            <div className={styles.content}>
                <div className={styles.header}>
                  {found ? 'Gozlegin netijesi' : isGathering ? 'Summing up...' : 'Dinle'}
                </div>
                {
                  !found ? 
                  <>
                    <LottieI 
                      height={126}
                      width={126}
                      icon={ShazamI}
                    />
                  <p className={styles.text}>
                  “Dinle” ses arkaly aydym-sazyn gozlegini dowam et...
                  </p>
                  </> : 
                  <SongList
                    className={styles.songsList}
                    isResponsive
                    hideLike 
                    data={songs ?? []}
                    onPlay={(index) => dispatch(setCurrentSong({ data: songs, id: songs?.[index]?.id, index }))}
                    fetchStatuses={{
                      isLoading: false, isError: false
                    }}
                  />
                }
            </div>
        </Modal>
    </>
  ) 
}

export default SearchModal