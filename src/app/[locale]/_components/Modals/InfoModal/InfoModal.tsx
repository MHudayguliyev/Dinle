import React from 'react'
import Image from 'next/image';
//react-query
import { useQuery } from 'react-query';
import CommonModalI from '../CommonModali'
import Modal from '@app/_compLibrary/Modal'
//styles
import styles from './InfoModal.module.scss';
//images
import dummy5 from '@app/_assets/images/dummy_image5.png';
//icons 
import music from '@app/_assets/icons/music.svg'
import genre from '@app/_assets/icons/genre.svg'
import dateRange from '@app/_assets/icons/date_range.svg'
import listeners from '@app/_assets/icons/listener.svg';
import user from '@app/_assets/icons/user.svg'
import musicHeart from '@app/_assets/icons/music_heart.svg'
import { GetArtistInfo } from '@app/_api/Queries/Getters';
//utils
import {formatDate} from '@utils/helpers'

interface InfoModal extends CommonModalI {}
const InfoModal = (props: CommonModalI) => {
    const {
        show, 
        close
    } = props

    const {
        data, 
        isLoading, 
        isError
    } = useQuery(['GetArtistInfo', show], () => GetArtistInfo(''), {
        refetchOnWindowFocus: false, enabled: show
    })

    console.log("data", data)

  return (
    <>
        <Modal 
            isOpen={show}
            close={close}
            className={styles.infoModal}
        >
            <div className={styles.content}>
                <div className={styles.artistInfo}>
                    <Image className={styles.backgroundImg} src={dummy5} alt='artist'/>
                    <Image className={styles.frontImg} alt='artist' src={dummy5} />

                    <div className={styles.details}>
                        <div className={styles.header}>
                            <h3>Aydymcy</h3>
                            <h1>Yhlas Dadayew</h1>
                        </div>

                        <p className={styles.paragraph}>
                        It is a long established fact that a reader will be distracted by the when looking at its layoutIt is a long established fact that a reader will be distracted by the when looking at its layoutIt is a long established fact that a reader will be distracted by the when looking at its layoutIt is a long established fact that a reader will be distracted by the when looking at its layout.
                        </p>
                    </div>
                </div>

                <div>
                <div className={styles.statistics}>
                    <h3>Ýerine ýetiriji barada</h3>
                    <div className={styles.statDetails}>

                        <div className={styles.detail}>
                            <div className={styles.theLeft}>
                                <Image src={music} alt='music'/>
                                <div className={styles.header}>Aýdym:</div>
                            </div>
                            <div className={styles.theRight}>
                                {data?.count?.songs}
                            </div>
                        </div>
                        <div className={styles.detail}>
                            <div className={styles.theLeft}>
                                <Image src={music} alt='album'/>
                                <div className={styles.header}>Albom:</div>
                            </div>
                            <div className={styles.theRight}>
                                {data?.count?.alboms}
                            </div>
                        </div>
                        <div className={styles.detail}>
                            <div className={styles.theLeft}>
                                <Image src={dateRange} alt='dateRange'/>
                                <div className={styles.header}>Goşulan wagty:</div>
                            </div>
                            <div className={styles.theRight}>
                                {formatDate(data?.createdAt!)}
                            </div>
                        </div>

                    </div>
                </div>
                <div className={styles.statistics}>
                    <h3>Gorkezijiler</h3>
                    <div className={styles.statDetails}>

                        <div className={styles.detail}>
                            <div className={styles.theLeft}>
                                <Image src={listeners} alt='listeners'/>
                                <div className={styles.header}>Diňleýjiler</div>
                            </div>
                            <div className={styles.theRight}>
                                {data?.count?.songListeners}
                            </div>
                        </div>
                        <div className={styles.detail}>
                            <div className={styles.theLeft}>
                                <Image src={user} alt='followers'/>
                                <div className={styles.header}>Follow edenler</div>
                            </div>
                            <div className={styles.theRight}>
                                {data?.count?.followers}
                            </div>
                        </div>
                        <div className={styles.detail}>
                            <div className={styles.theLeft}>
                                <Image src={musicHeart} alt='musicHeart'/>
                                <div className={styles.header}>Like Любимые треки</div>
                            </div>
                            <div className={styles.theRight}>
                                {data?.count?.songLikers}
                            </div>
                        </div>

                    </div>
                </div>

                </div>


            </div>
        </Modal>
    </>
  )
}

export default InfoModal