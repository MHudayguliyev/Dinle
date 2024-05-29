import React, { useMemo, useEffect, useState } from 'react'
import Image from 'next/image'
import { useQuery } from 'react-query';
//api 
import { GetArtistInfo, GetSongInfo } from '@app/_api/Queries/Getters';
//utils
import {CheckObjOrArrForNull, formatDate, isEmpty} from '@utils/helpers'
//styles
import classNames from 'classnames/bind'
import styles from './InfoMenu.module.scss'
//icons 
import MusicI from '../icons/music/icon';
import GenreI from '../icons/genre/icon';
import DateI from '../icons/date/icon';
import ListenersI from '../icons/listener/icon';
import MusicLikeI from '../icons/musicLike/icon';
import DownloadI from '../icons/download/icon';
import ArrowI from '../icons/arrow/icon'
import PrevNext from '@components/icons/prevNext/icon'
import Follower from '@app/_components/icons/follower/icon'
import AlbomI from '../icons/albom/icon';
//types
import CommonModalI from '../Modals/CommonModali';
import CustomLink from '../CustomLink/CustomLink';
// import Swiper JS
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
//redux
import { useAppDispatch } from '@app/_hooks/redux_hooks';
import { setIsBlockOverflow } from '@app/_redux/reducers/OverflowReducer';

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

  const dispatch = useAppDispatch()
  const fetchArtistInfo = useMemo(() => show && fetchMode === 'artist' && !!id ,[id, show, fetchMode])
  const fetchSongInfo = useMemo(() => show && fetchMode === 'song' && !!id ,[id, show, fetchMode])
  const [seeAll, setSeeAll] = useState<boolean>(false)

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
    if(show) dispatch(setIsBlockOverflow(true))
    else dispatch(setIsBlockOverflow(false))
  }, [show])

  const cover = useMemo(() => (
    <Image src={fetchSongInfo ? song?.cover as string : data?.cover as string} alt='cover'  width='400' height='400'/>
  ), [song, data])

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
              {cover}
            </div>

            <div className={styles.topContent}>
              <div className={cn({
                frontImg: true, 
                artistImg: fetchArtistInfo
              })}>
                {cover}
              </div>
            </div>

            <div className={styles.content}>
              <div className={styles.about}>
                <div className={cn({
                  title: true, 
                  songInfoTitle: fetchSongInfo
                })}>
                  {fetchSongInfo ? song?.title : 'Aydymcy'}
                </div>
                <div className={cn({
                  artist: true, 
                  songInfoArtist: fetchSongInfo
                })}>{fetchSongInfo ? song?.artist?.title :  data?.title}</div>
              </div>
              <div >
                <div className={cn({
                  description: true, 
                  foldDesc: !seeAll
                })}>
                  {fetchSongInfo ? song?.about : data?.about}
                </div>
                {
                  (fetchSongInfo && !isEmpty(song?.about)) || (fetchArtistInfo && !isEmpty(data?.about)) ? 
                  <div onClick={() => setSeeAll(!seeAll)} className={styles.continue}>
                    {
                      seeAll ? 'gizle' : 'yzy'
                    }
                  </div> : ""
                }
              </div>
            </div>

          </div>



          <div className={styles.menuBottom}>
              
            <div className={styles.statistics}>
              <h3>
                {fetchArtistInfo ? 'Ýerine ýetiriji barada' : 'Aýdym barada'}
              </h3>

              <div className={styles.statDetails}>

                {
                  fetchArtistInfo && 
                  <div className={styles.detail}>
                    <div className={styles.theLeft}>
                        <MusicI />
                        <div className={styles.head}>Aýdym:</div>
                    </div>
                    <div className={styles.theRight}>
                      {data?.count?.songs}
                    </div>
                  </div>
                }
                <div className={styles.detail}>
                    <div className={styles.theLeft}>
                        <AlbomI />
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
                      <GenreI />
                      <div className={styles.head}>Zanry:</div>
                  </div>
                  <div className={cn({
                    theRight: true, 
                    baseGenreWrapper: true
                  })}>
                      <div className={styles.genres}>
                        {
                          fetchSongInfo ?
                          song?.genres?.map((genre, index) => 
                            <CustomLink key={genre.genreId} scroll href={`/genre/${genre.genreId}`}>
                              {genre.name + ` ${index === song?.genres?.length - 1 ? "" : ", "}`}
                            </CustomLink>
                          ) : 
                          data?.genres?.map((genre, index) => 
                            <CustomLink key={genre.genreId} scroll href={`/genre/${genre.genreId}`}>
                              {genre.name + ` ${index === data?.genres?.length - 1 ? "" : ", "}`}
                            </CustomLink>
                          )
                        }
                      </div>
                      <CustomLink 
                        onClick={() => {
                          if(CheckObjOrArrForNull(song?.genres)) close()
                        }} 
                        scroll 
                        href={CheckObjOrArrForNull(fetchArtistInfo ? data?.genres : song?.genres) ? `/search?tab=genre&${fetchArtistInfo ? `artistId=${data?.id}` : `songId=${song?.id}`}` : ""}
                      >
                        <ArrowI />
                      </CustomLink>
                  </div>
                </div>
                

                <div className={styles.detail}>
                    <div className={styles.theLeft}>
                        <DateI />
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
                        <ListenersI/>
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
                        <Follower/>
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
                        <MusicLikeI/>
                        <div className={styles.head}>Like Любимые треки</div>
                      </div>
                      <div className={styles.theRight}>
                        {fetchSongInfo ? song?.count?.likers : data?.count?.songListeners}
                      </div>
                  </div>


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