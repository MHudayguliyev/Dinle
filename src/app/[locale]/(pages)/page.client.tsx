
'use client';
import React, {useRef, useMemo, useState, useEffect, useCallback} from 'react'
import Image from 'next/image';
import { useQuery } from 'react-query'
//styles
import classNames from 'classnames/bind'
import styles from './page.module.scss';
//icons
import UserI from '@app/_components/icons/user/icon';
import ArrowRightLgI from '@app/_components/icons/ArrowRightLg/icon';
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
import { copyLink, delay, isAuthorized, parse } from '@app/_utils/helpers';
import InfoSmI from '@app/_components/icons/infoSm/icon';
import ShareSmI from '@app/_components/icons/shareSm/icon';
import ReadMoreI from '@app/_components/icons/readMore/icon';
import Preloader from '@app/_compLibrary/Preloader';

//translations 
import {useTranslations, useLocale} from 'next-intl';
import toast from 'react-hot-toast';

type Affixes = 'news' | 'clip' | 'show' | 'karaoke' | 'song'

const cn = classNames.bind(styles)
export default function Home() {
  const locale = useLocale();
  const t = useTranslations('home');
  const dispatch = useAppDispatch()
  const dropdownContentRef:any = useRef(null)
  const dropdownToggleRef:any = useRef(null)
  const [openDropdown] = useClickOutside(dropdownContentRef, dropdownToggleRef, 'mousedown')
  const [songId, setSongId] = useState<string>("")
  const [bottomSheetAffix, setBottomSheetAffix] = useState<Affixes>('song')
  const [showBottomSheet, setShowBottomSheet] = useState<boolean>(false)
  const [showInfo, setShowInfo] = useState<boolean>(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const [isTopInfoLoading, setLoading] = useState<boolean>(true)

  //queries
  const {
    data: banners
  } = useQuery('GetBanners', () => GetBanners(), {
    refetchOnWindowFocus: false
  })
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

  // console.log(homeItems)

  useEffect(() => {
    if(!isAuthorized()){
      setIsAuthenticated(false)
    }else setIsAuthenticated(true)
    delay(500).then(() => setLoading(false))
  }, [])


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
    const userId = user?.username 
    return (
      <div className={styles.authContent}>
        {
          isTopInfoLoading ? <span className={styles.loader}><Preloader /></span> : isAuthenticated ? 
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
  }, [isTopInfoLoading, isAuthenticated, openDropdown, dropdownContentRef, dropdownToggleRef])

  const actionsData = [
    {
        value: 'info', 
        label: {ru: 'Maglumat', tm: 'Maglumat'}, 
        icon: <InfoSmI />
    }, 
    {
        value: 'share', 
        label: {ru: 'Paylasmak', tm: 'Paylasmak'}, 
        icon: <ShareSmI />
    }, 
    {
        value: 'queue', 
        label: {ru: 'Indiki aydyma gos', tm: 'Indiki aydyma gos'}, 
        icon: <ReadMoreI />
    }, 
  ]

  const handleCopyLink = useCallback((id: string, affix: Affixes) => {
    copyLink(`${affix === 'song' ? "/song" : `/all/${affix}`}/${id}`)?.then((mode) => {
      if(showBottomSheet) setShowBottomSheet(false)
      if(mode === 'desktop') toast.success('Link is copied.')
      setSongId("")
    })
  }, [showBottomSheet, setSongId])

  return (
    <>
        {infoMenu}
        <div className={styles.topMenu}>
          <h3>{t('news')}</h3>
          {authContent}
        </div>


        <div className={styles.sliders}>
            <div className={styles.banners}>
              <Swiper
                navigation
                modules={[ Navigation, Autoplay ]}
                slidesPerView={2}
                spaceBetween={15}
                speed={1000}
                // autoplay={{delay: 5000}}
                breakpoints={sliderBreakpoints}
              >
                {
                  banners?.map(banner => (
                    <SwiperSlide key={banner.id}>
                      <div className={styles.banner}>
                        <CustomLink href={''}>
                          <Image src={banner.cover} alt='banner' width='400' height='400'/>
                        </CustomLink>
                      </div>
                    </SwiperSlide>
                  ))
                }
              </Swiper>
            </div>

            {
              data?.map((homeItem) => {
                if(homeItem.id === 'banner') return null
                const artist = homeItem.id === 'artists'
                const top10 = homeItem.id === 'top10songs'
                const playlist = homeItem.id === 'playlists'
                const albom = homeItem.id === 'alboms'
                const clip = homeItem.id === 'clips' || homeItem.id === 'videos' || homeItem.id === 'concerts'
                const show = homeItem.id === 'shows'
                const karaoke = homeItem.id === 'karaoke'
                const news = homeItem.id === 'news'
                const searchParam = `?title=${homeItem.name}`

                return (
                  <div key={homeItem.id}>
                    <div className={styles.song__header}>
                      <CustomLink   
                        href={
                          artist ? '/search?tab=artist' : 
                          playlist ? '/search?tab=playlist' : 
                          albom ? '/search?tab=albom' : 
                          clip ? `/all/clip${searchParam}${homeItem.id === 'concerts' ? `&type=${homeItem.id}` : homeItem.id === 'videos' ? `&type=${homeItem.id}` : ""}` : 
                          news ? `/all/news${searchParam}` : 
                          show ? `/all/show${searchParam}` : 
                          karaoke ? `/all/karaoke${searchParam}` : 
                          `all/song/${homeItem.id}${searchParam}`
                        } 
                        scroll={false}
                        >
                        <h3>{homeItem.name}</h3>
                        <ArrowRightLgI />
                      </CustomLink>
                    </div>

                    <div className={styles.slider}>
                      <Swiper
                        navigation
                        modules={[ Navigation ]}
                        slidesPerView={6}
                        spaceBetween={2}
                        breakpoints={(clip || show || news || karaoke) ? 
                          {
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
                              slidesPerView: 4
                            }
                          } : 
                          standardCardBreaksPoints
                        }
                      >
                        {
                          homeItem?.rows?.map((row, rowIndex) => {
                            const affix = clip ? 'clip' : show ? 'show' : news ? 'news' : karaoke ? 'karaoke' : 'song'
                            return (
                              <SwiperSlide key={rowIndex}>
                                <StandardCard 
                                  id={row.id}
                                  top10Id={rowIndex + 1}
                                  artistId={(artist || albom) ? row?.id : row?.artistId}
                                  playlistId={playlist ? row.id : row?.playlistId}
                                  albomId={albom ? row.id : row?.albomId}
                                  videoId={row.id}
                                  newsId={row.id}
                                  showId={row.id}
                                  karaokeId={row.id}
                                  title={row.title}
                                  description={row.description}
                                  image={row.cover}
                                  top10={top10}
                                  artists={artist}
                                  playlists={playlist}
                                  alboms={albom}
                                  videoCard={clip}
                                  showCard={show}
                                  newsCard={news}
                                  karaokeCard={karaoke}
                                  videoDuration={clip ? row.duration : undefined}
                                  hideMoreI={albom || playlist}
                                  standard={homeItem.type === 'playlist' || homeItem.type === 'top-playlist'}
                                  onPlay={(id) => {
                                    if((homeItem.type === 'playlist' || homeItem.type === 'top-playlist') || top10) 
                                    dispatch(setCurrentSong({ data: homeItem?.rows, id: row.id, index: rowIndex }))
                                  }}
                                  onShare={() => 
                                    handleCopyLink(row.id, affix)
                                  }
                                  onOpenInfoMenu={() => {
                                    setSongId(row.id)
                                    setShowInfo(true)
                                  }}
                                  onAddToQueue={() => 
                                    dispatch(addToQueue(row))
                                  }
                                  onOpenBottomSheet={() => {
                                    setBottomSheetAffix(affix)
                                    setSongId(row.id)
                                    setShowBottomSheet(true)
                                  }}
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
        actionsData={actionsData} 
        open={showBottomSheet}
        close={() => setShowBottomSheet(false)}
        onClick={(value) => {
          if(value === 'info') {
            setShowInfo(true)
            setShowBottomSheet(false)
          }else if(value === 'share'){
            handleCopyLink(songId, bottomSheetAffix)
            setShowBottomSheet(false)
          }
        }}
      />
    </>
  )
}
