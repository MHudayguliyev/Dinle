'use client';
import React, { useCallback, useMemo } from 'react'
import Image from 'next/image'
import { useQuery } from 'react-query'
//styles
import styles from './page.module.scss'
//comp
import TopNavbar from '@app/_components/TopNavbar/TopNavbar'
//icon
import PrevNextI from '@app/_components/icons/prevNext/icon'
import Share from '@app/_components/icons/share/icon';
//api
import { GetOneArtNews } from '@app/_api/Queries/Getters'

//moment js 
import moment from 'moment'
//utils
import { copyLink } from '@app/_utils/helpers'
//react toast
import toast from 'react-hot-toast'

const OneNews = ({params}: {params: {each: string}}) => {
  const newsId = useMemo(() => params.each,[params.each])
  const {data} = useQuery(['GetOneArtNews', newsId], () => GetOneArtNews(newsId))

  const handleCopyLink = useCallback(() => {
    copyLink(`/news/${newsId}`)?.then((mode) => {
    if(mode === 'desktop') toast.success('Link is copied.')
  })
  }, [newsId])
  const cover = useMemo(() => (
    <Image src={data?.cover ?? ""} alt='cover' width='400' height='400'/>
  ), [data])
  const share = useMemo(() => (
    <Share onClick={handleCopyLink}/>
  ), [handleCopyLink])
  const createdDt = useMemo(() => (
    <div className={styles.date}>{moment(data?.createdAt).format('DD.MM.YYYY')}</div>
  ), [data])

  return (
    <>
      <div className={styles.presentation}>
        <div className={styles.background_gradient}></div>
        <div className={styles.background_image}>
            {cover}
        </div>
        <div className={styles.wrapper}>
            <div className={styles.content_box}>
                {cover}
                <div className={styles.content}>
                    <div className={styles.news}>Sungat habarlary</div>
                    <div className={styles.title}>{data?.title}</div>
                    {createdDt}
                </div>
            </div>
            <div className={styles.actions}>
              {share}
            </div>
        </div>
      </div>

      <div className={styles.presentation_mobile}>
            <div className={styles.background_gradient}></div>
            <div className={styles.background_image}>
                {cover}
            </div>
            <div className={styles.mobile_presentation_wrapper}>
                <div className={styles.content_box}>
                    {cover}
                    <div className={styles.content}>
                      <div className={styles.news}>Sungat habarlary</div>
                      <div className={styles.title}>{data?.title}</div>
                    {createdDt}
                </div>
                </div>
            </div>
      </div>

      <div className={styles.mainBody}>
          <p className={styles.description}>{data?.description}</p>
          <div className={styles.author}>{data?.author ?? 'Author'}</div>
      </div>
    </>
  )
}

export default OneNews