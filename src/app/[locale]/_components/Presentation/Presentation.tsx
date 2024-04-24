import React from 'react'
//styles
import styles from './Presentation.module.scss'

interface PresentationProps {
    renderCover?: () => React.ReactNode
    renderActions?: () => React.ReactNode
    /** @default false **/
    isArtist?: boolean
    /** @default false **/
    isVideo?: boolean
    /** @default false **/
    isSong?: boolean
    /** @default false **/
    isPlaylist?: boolean
    /** @default false **/
    isGenre?: boolean
    /** @default false **/
    isAlbom?: boolean
}
const Presentation = (props: PresentationProps) => {
    const {
        renderCover, 
        renderActions
    } = props
  return (
    <>
        <div className={styles.presentation}>
            <div className={styles.background_gradient}></div>
            <div className={styles.background_image}>
                {renderCover && renderCover()}
            </div>
            <div className={styles.wrapper}>
                <div className={styles.content_box}>
                    {renderCover && renderCover()}
                    <div className={styles.artist}>
                        <div className={styles.title}>Artist</div>
                        <div className={styles.name}>{credentials?.title}</div>
                    </div>
                </div>
                <div className={styles.actions}>
                    {playBtn()}  
                    {followBtn}
                    {shareBtn}
                    {infoToggler}
                </div>
            </div>
        </div>
    </>
  )
}

export default Presentation
