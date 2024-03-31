import React from 'react'
//styles
import styles from './ArtistsList.module.scss'
import Image from 'next/image'
import CustomLink from '../CustomLink/CustomLink'

interface ArtistsListProps {
    id: string
    image: string 
    name: string
}
const ArtistsList = (props: ArtistsListProps) => {
    const { 
        id, 
        image, 
        name
    } = props

  return (
    <CustomLink href={`/artist/${id}`} className={styles.rows}>
        <div className={styles.row}>
            <div className={styles.rowImage}>
                <Image src={image} alt='artist' width='400' height='400'/>
            </div>
            <div className={styles.name}>
                <CustomLink href={`/artist/${id}`}>
                    {name}
                </CustomLink>
            </div>
        </div>
    </CustomLink>
  )
}

export default ArtistsList