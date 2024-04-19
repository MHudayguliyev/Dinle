
'use client';
import React, {useRef, useMemo, useState, useEffect} from 'react'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useQuery } from 'react-query'
//styles
import classNames from 'classnames/bind'
import styles from './page.module.scss';
//icons/images
import firstBanner from '@app/_assets/images/1stbanner.png'
import secondBanner from '@app/_assets/images/2ndbanner.png'
import thirdBanner from '@app/_assets/images/3rdbanner.png'
import ChevronRightI from '@app/_components/icons/chevronRight/icon';
import UserI from '@app/_components/icons/user/icon';
//breakpoints
import { standardCardBreaksPoints, sliderBreakpoints } from '@app/_assets/json_data/swiper_breakpoints';
// import Swiper JS
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
//cards
import StandardCard from '@components/StandardCard/StandardCard';
//api 
import { getHomeItems, GetBanners } from '@app/_api/Queries/Getters';
import Button from '@app/_compLibrary/Button';
//redux 
import { useAppDispatch } from '@hooks/redux_hooks';
import { setCurrentSong, addToQueue } from '@redux/reducers/MediaReducer';
//comps
import BottomSheet from '@components/Bottomsheet/Bottomsheet'
import InfoMenu from '@components/InfoMenu/InfoMenu';
//link
import CustomLink from '@components/CustomLink/CustomLink';
//hooks
import useClickOutside from '@hooks/useOutClick';
import { getFromStorage } from '@app/_utils/storage';
import { isAuthorized, parse } from '@app/_utils/helpers';

const cn = classNames.bind(styles)
export default function Home() {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const dropdownContentRef:any = useRef(null)
  const dropdownToggleRef:any = useRef(null)
  const [openDropdown] = useClickOutside(dropdownContentRef, dropdownToggleRef, 'mousedown')
  const [songId, setSongId] = useState<string>("")
  const [showBottomSheet, setShowBottomSheet] = useState<boolean>(false)
  const [showInfo, setShowInfo] = useState<boolean>(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  //queries
  const {
    data: banners
  } = useQuery('GetBanners', () => GetBanners(), {
    refetchOnWindowFocus: false
  })
  console.log("banners", banners)
  const {
    data: homeItems, 
    isLoading, 
    isError
  } = useQuery('GetHomeItems', () => getHomeItems(), {
    refetchOnWindowFocus: false
  })

  const data = useMemo(() => {
    return homeItems?.data
  },[homeItems])

  console.log(homeItems)

  useEffect(() => {
    if(isAuthorized()) setIsAuthenticated(true)
    else setIsAuthenticated(false)
  }, [isAuthorized])

  const infoMenu = useMemo(() => (
    <InfoMenu 
      id={songId}
      show={showInfo}
      fetchMode='song'
      close={() => setShowInfo(false)}
    />
  ), [songId, showInfo])

  const authContent = useMemo(() => {
    const user = parse(getFromStorage('authUser')!)
    const userId = user?.userId 
    return (
      <div className={styles.authContent}>
        {
          isAuthenticated ?
          <div className={styles.wrapper}>
            <Button color='lightDark' roundedSm ref={dropdownToggleRef}>
              <UserI />
            </Button> 

            <div ref={dropdownContentRef} className={cn({ dropdown: true, open: openDropdown })}>
              <div className={styles.dropdownContent}>
                <span className={styles.title}>Menin Dinle ID</span>
                <span className={styles.userId}>{userId ?? "no id"}</span>
              </div>
            </div>
          </div>
          :
          <Button linkProps={{href: '/login'}} color='linearGradientSecond' className={styles.sign_inBtn} roundedSm>
            Sign in
          </Button>
        }
      </div>
    )
  }, [isAuthenticated, openDropdown, dropdownContentRef, dropdownToggleRef])

  return (
    <>
        {infoMenu}
        <div className={styles.fixed_top}>
          <h3>Täzelikler</h3>
          {authContent}
        </div>


        <div className={styles.sliders}>
            <div className={styles.banners}>
              <Swiper
                navigation
                // loop
                modules={[ Navigation, Autoplay ]}
                slidesPerView={2}
                spaceBetween={15}
                speed={1000}
                autoplay={{delay: 5000}}
                breakpoints={sliderBreakpoints}
              >
                {
                  banners?.map(banner => (
                    <SwiperSlide key={banner.id}>
                      <div className={styles.banner}>
                        <Image src={banner.cover} alt='banner' width='400' height='400'/>
                      </div>
                    </SwiperSlide>
                  ))
                }
              </Swiper>
            </div>

            {
              data?.map((homeItem) => {
                if(Array.isArray(homeItem)) return null
                const artist = homeItem.id === 'artists'
                const top10 = homeItem.id === 'top-10-songs'
                const playlist = homeItem.id === 'playlists'
                const albom = homeItem.id === 'alboms'
                const clip = homeItem.id === 'clips' || homeItem.id === 'karaoke' || homeItem.id === 'concerts' || homeItem.id === 'shows' || homeItem.id === 'videos' || homeItem.id === 'news'

                return (
                  <div key={homeItem.id}>
                    <div className={styles.song__header}>
                      <h3>{homeItem.name}</h3>
                      <CustomLink   
                        href={
                          artist ? '/search?type=artist' : 
                          playlist ? '/search?type=playlist' : 
                          albom ? '/search?type=album' : 
                          `viewall/${homeItem.id}`
                        } 
                      >
                        <span>View all</span>
                        <ChevronRightI />
                      </CustomLink>
                    </div>

                    <div className={styles.slider}>
                      <Swiper
                        navigation
                        modules={[ Navigation ]}
                        slidesPerView={6}
                        spaceBetween={2}
                        breakpoints={!clip ? standardCardBreaksPoints : {
                          0: {
                            slidesPerView: 2
                          }, 
                          576: {
                            slidesPerView: 2
                          },
                          768: {
                            slidesPerView: 3,
                          },
                          1200: {
                            slidesPerView: 3.5
                          }
                        }}
                      >
                        {
                          homeItem?.rows?.map((row, rowIndex) => {
                            return (
                              <SwiperSlide key={rowIndex}>
                                <StandardCard 
                                  id={top10 ? (rowIndex + 1).toString() : row.id}
                                  artistId={(artist || albom) ? row?.id : row?.artistId}
                                  playlistId={playlist ? row.id : row?.playlistId}
                                  albomId={albom ? row.id : row?.albomId}
                                  title={row.title}
                                  description={row.description}
                                  image={row.cover}
                                  top10={top10}
                                  artists={artist}
                                  playlists={playlist}
                                  alboms={albom}
                                  videoCard={clip}
                                  hideMoreI={albom}
                                  standard={homeItem.type === 'playlist'}
                                  onPlay={() => {
                                    if(homeItem.type === 'playlist') dispatch(setCurrentSong({ data: homeItem?.rows, id: row.id, index: rowIndex }))
                                  }}
                                  onOpenBottomSheet={() => {
                                    setSongId(row.id)
                                    setShowBottomSheet(true)
                                  }}
                                  onOpenInfoMenu={() => {
                                    setSongId(row.id)
                                    setShowInfo(true)
                                    
                                  }}
                                  onAddToQueue={() => 
                                    dispatch(addToQueue(row))
                                  }
                                />
                              </SwiperSlide>
                            )
                          })
                        }
                      </Swiper>
                    </div>

                  </div>
                  
                )
              })
            }
      </div>

      <BottomSheet 
        open={showBottomSheet}
        close={() => setShowBottomSheet(false)}
        onClick={(value) => {
          if(value === 'info') {
            setShowInfo(true)
            setShowBottomSheet(false)
          }
        }}
      />
    </>
  )
}
