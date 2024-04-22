import React, { useMemo, useEffect } from 'react'
import Image from 'next/image'
import { useQuery } from 'react-query';
//api 
import { GetArtistInfo, GetSongInfo } from '@app/_api/Queries/Getters';
//utils
import {CheckObjOrArrForNull, formatDate} from '@utils/helpers'
//styles
import classNames from 'classnames/bind'
import styles from './InfoMenu.module.scss'
//icons 
import music from '@app/_assets/icons/music.svg'
import genre from '@app/_assets/icons/genre.svg'
import dateRange from '@app/_assets/icons/date_range.svg'
import listeners from '@app/_assets/icons/listener.svg';
import user from '@app/_assets/icons/user.svg'
import musicHeart from '@app/_assets/icons/music_heart.svg'
import download from '@app/_assets/icons/download.svg'
import ArrowI from '../icons/arrow/icon'
import PrevNext from '@components/icons/prevNext/icon'
//types
import CommonModalI from '../Modals/CommonModali';
import CustomLink from '../CustomLink/CustomLink';
// import Swiper JS
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
//breakpoints
import { sliderBreakpoints } from '@app/_assets/json_data/swiper_breakpoints';


interface InfoMenuProps extends CommonModalI {
  id: string
  /** @defaultValue song **/
  fetchMode?: 'artist' | 'song'
}

const cn = classNames.bind(styles)
const InfoMenu = React.forwardRef<HTMLDivElement, InfoMenuProps>((props, ref):JSX.Element => {
  const {
    show, 
    close, 
    id, 
    fetchMode = 'song'
  } = props

  const fetchArtistInfo = useMemo(() => show && fetchMode === 'artist' && !!id ,[id, show, fetchMode])
  const fetchSongInfo = useMemo(() => show && fetchMode === 'song' && !!id ,[id, show, fetchMode])

  const {
    data
  } = useQuery(['GetArtistInfo', fetchArtistInfo], () => GetArtistInfo(id), {
      refetchOnWindowFocus: false, enabled: fetchArtistInfo
  })
  const {
    data: song, 
  } = useQuery(['GetSongInfo', fetchSongInfo], () => GetSongInfo(id), {
    refetchOnWindowFocus: false, enabled: fetchSongInfo
  })

  useEffect(() => {
    console.log("data", data)
  }, [data])

  return (
    <>
      <div className={cn({backdropBlur: show})} onClick={() => close()}></div>
      

      <div ref={ref} className={cn({
        menu: true,
        open: show
      })}>

      
        <div className={styles.wrapper}>
          <div className={styles.bgGradient}></div>
          
          <div className={styles.header}>
            <PrevNext  mode='prev' onClick={() => close()}/>
          </div>

          <div className={styles.theTop}>

            <div className={styles.bgImg}>
              <Image src={fetchSongInfo ? song?.artist?.cover! : data?.cover!} alt='artist'  width='400' height='400'/>
            </div>

            <div className={styles.topContent}>
              <div className={cn({
                frontImg: true, 
                artistImg: fetchArtistInfo
              })}>
                <Image src={fetchSongInfo ? song?.artist?.cover! : data?.cover!} alt='artist' width='400' height='400'/>
              </div>

              <div className={styles.content}>
                <div className={styles.about}>
                  <div className={styles.title}>Aydymcy</div>
                  <div className={styles.artist}>{fetchSongInfo ? song?.artist?.title :  data?.title}</div>
                </div>

                <div className={styles.description}>
                  {fetchSongInfo ? song?.about : data?.about}
                </div>
              </div>
            </div>

          </div>



          <div className={styles.menuBottom}>
              
            <div className={styles.statistics}>
              <h3>Ýerine ýetiriji barada</h3>

              <div className={styles.statDetails}>

                {
                  fetchArtistInfo && 
                  <div className={styles.detail}>
                    <div className={styles.theLeft}>
                        <Image src={music} alt='music'/>
                        <div className={styles.head}>Aýdym:</div>
                    </div>
                    <div className={styles.theRight}>
                      {data?.count?.songs}
                    </div>
                  </div>
                }
                <div className={styles.detail}>
                    <div className={styles.theLeft}>
                        <Image src={music} alt='album'/>
                        <div className={styles.head}>Albom:</div>
                    </div>
                    <div className={styles.theRight}>
                        {
                          fetchSongInfo ? (
                            song?.albom?.title
                          ) : (
                            data?.count?.alboms
                          )
                        }
                    </div>
                </div>
                
                <div className={styles.detail}>
                  <div className={styles.theLeft}>
                      <Image src={genre} alt='album'/>
                      <div className={styles.head}>Zanry:</div>
                  </div>
                  <div className={styles.theRight}>
                      <div className={styles.genres}>
                      {fetchSongInfo && song?.genres?.map(genre => <span key={genre.genreId}>{genre.name + ', '}</span>)}
                      {fetchArtistInfo && song?.genres?.map(genre => <span key={genre.genreId}>{genre.name + ', '}</span>)}
                      </div>
                      <ArrowI />
                  </div>
                </div>
                

                <div className={styles.detail}>
                    <div className={styles.theLeft}>
                        <Image src={dateRange} alt='dateRange'/>
                        <div className={styles.head}>Goşulan wagty:</div>
                    </div>
                    <div className={styles.theRight}>
                        {formatDate(fetchSongInfo ? song?.createdAt! : data?.createdAt!) }
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
                        <div className={styles.head}>Diňleýjiler</div>
                      </div>
                      <div className={styles.theRight}>
                        {
                          fetchSongInfo ? (
                            song?.count?.listeners
                          ) : (
                            data?.count?.songListeners
                          )
                        }
                      </div>
                  </div>
                  <div className={styles.detail}>
                      <div className={styles.theLeft}>
                        <Image src={user} alt='followers'/>
                        <div className={styles.head}>Follow edenler</div>
                      </div>
                      <div className={styles.theRight}>
                        {
                          fetchSongInfo ? song?.count?.followers : data?.count?.followers
                        }
                      </div>
                  </div>
                  <div className={styles.detail}>
                      <div className={styles.theLeft}>
                        <Image src={musicHeart} alt='musicHeart'/>
                        <div className={styles.head}>Like Любимые треки</div>
                      </div>
                      <div className={styles.theRight}>
                        {fetchSongInfo ? song?.count?.likers : data?.count.songListeners}
                      </div>
                  </div>

                  {
                    fetchSongInfo && 
                    <div className={styles.detail}>
                      <div className={styles.theLeft}>
                        <Image src={download} alt='download'/>
                        <div className={styles.head}>Jemi ýüklenen</div>
                      </div>
                      <div className={styles.theRight}>
                        {song?.count?.downloads}
                      </div>
                    </div>
                  }

                </div>
              </div>

              {
                fetchSongInfo &&  CheckObjOrArrForNull(song?.duets) && (
                  <div className={styles.duets}>
                    <h3>Esasy rollarda</h3>

                    <Swiper
                      navigation
                      modules={[ Navigation ]}
                      slidesPerView={3}
                      spaceBetween={5}
                      breakpoints={{
                        0: {
                          slidesPerView: 3
                        }, 
                      }}
                    >
                      {
                        song?.duets?.map((artist, index) => (
                          <SwiperSlide key={index}>
                            <CustomLink href={`/artist/${artist.artist.id}`} className={styles.artist}>
                              <Image src={artist.artist.cover} width='400' height='400' alt='artist'/>
                              <div className={styles.name}>
                                  {artist.artist.title}
                              </div>
                              <div className={styles.artistType}>
                                {artist.type}
                              </div>
                            </CustomLink>
                          </SwiperSlide>
                        ))
                      }
                    </Swiper>

                  </div>
                )
              }

          </div>

        </div>            


      </div>
    </>
  )
})

export default InfoMenu