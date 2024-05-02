// @ts-nocheck
import React, { ReactNode, useMemo } from "react";
import Slider from "react-slick";
import ReactBlur from "react-blur";

//styles
import styles from './Slider.module.scss'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


type SliderProps = {
  data : any
  /** @defaultValue false **/
  slideForbanner?: boolean
  showDots?: boolean
  /** @defaultValue true **/
  infinite?: boolean
  /** @defaultValue 1 **/
  slidesToShow?: 1 | 3 | 4 | 5 | 6 | number
  /** @defaultValue 500 **/
  speed?: 500 | number
  /** @defaultValue true **/
  autoPlay?: boolean
  /** @defaultValue 2000 **/
  autoPlaySpeed?: 500 | 1500 | 2000 | 5000
  /** @defaultValue false **/
  responsive?: boolean
  /** @defaultValue false **/
  albums?: boolean
  className?:string 
}

type Settings = {
  dots: boolean
  infinite: boolean
  speed: number
  slidesToShow: number
  slidesToScroll: number
  autoplay: boolean
  autoplaySpeed?: number
  responsive: {
    breakpoint: number
    settings: {
      slidesToShow?: number
      slidesToScroll?: number
    }
  }[]
}

const SliderLib = (props: SliderProps) => {
    const {
        data,
        slideForbanner = false, 
        showDots = true,  
        infinite = true, 
        slidesToShow = 1,
        speed = 500, 
        autoPlay  = true, 
        autoPlaySpeed = 2000, 
        responsive = false, 
        albums = false, 
        className = ''
    } = props

    const settingsMem = useMemo((): Settings => {
      return {
        dots: showDots,
        infinite,
        speed,
        slidesToShow: slidesToShow,
        slidesToScroll:1,
        autoplay: false,
        autoplaySpeed: autoPlaySpeed,
        responsive: responsive ? [
          // {
          //   breakpoint: 1880,
          //   settings: {
          //       slidesToShow: 6,
          //   }
          // }, 
          // // {
          // //   breakpoint: albums ? 1730 : 1720,
          // //   settings: {
          // //       slidesToShow: albums ? 4.5 : 5.4,
          // //   }
          // // }, 
          // {
          //   breakpoint: albums ? 1650 : 1640,
          //   settings: {
          //       slidesToShow: albums ? 4.2 : 5,
          //   }
          // }, 
          // {
          //   breakpoint: 1575,
          //   settings: {
          //       slidesToShow: albums ? 3.9 :5,
          //   }
          // }, 
          // {
          //   breakpoint: 1490,
          //   settings: {
          //       slidesToShow: albums ? 3.6 : 4,
          //   }
          // }, 
          // {
          //   breakpoint: albums ? 1400 : 1415,
          //   settings: {
          //       slidesToShow: albums ? 3.3 : 4.2,
          //   }
          // }, 
          // {
          //   breakpoint: albums ? 1295 : 1342,
          //   settings: {
          //       slidesToShow: albums ? 3.1 : 3.9,
          //   }
          // }, 
          // {
          //   breakpoint: albums ? 1220 : 1270,
          //   settings: {
          //       slidesToShow: albums ? 2.9 : 3.6,
          //   }
          // }, 
          // {
          //   breakpoint: 1190,
          //   settings: {
          //       slidesToShow: albums ? 2.8 : 3.3,
          //   }
          // }, 
          // {
          //   breakpoint: albums ? 1130 : 1116,
          //   settings: {
          //       slidesToShow: albums ? 2.6 : 3,
          //   }
          // }, 
          // {
          //   breakpoint: albums ?  1070 : 1040,
          //   settings: {
          //       slidesToShow: albums ? 2.4 : 2.7,
          //   }
          // }, 
          // {
          //   breakpoint: albums ? 1010 : 962,
          //   settings: {
          //       slidesToShow: albums ? 2.2 : 2.4,
          //   }
          // }, 
          // {
          //   breakpoint: albums ? 950 : 890,
          //   settings: {
          //       slidesToShow: albums ? 2 : 2.2,
          //   }
          // },
          // {
          //   breakpoint: albums ? 890 : 840,
          //   settings: {
          //       slidesToShow: albums ? 1.9 : 2,
          //   }
          // },
          // {
          //   breakpoint: albums ? 859 : 795,
          //   settings: {
          //       slidesToShow: albums ? 1.8 : 1.9,
          //   }
          // },
          // {
          //   breakpoint: albums ? 830 : 765,
          //   settings: {
          //       slidesToShow: albums ? 1.7 : 1.7,
          //   }
          // },
          // {
          //   breakpoint: albums ? 800 : 696,
          //   settings: {
          //       slidesToShow: albums ? 1.6 : 1.5,
          //   }
          // },
          // {
          //   breakpoint: 652,
          //   settings: {
          //       slidesToShow: 2,
          //   }
          // },
          // {
          //   breakpoint: albums ? 770 : 599,
          //   settings: {
          //       slidesToShow:albums ? 1.5 : 2.1,
          //   } 
          // },
          // {
          //   breakpoint: albums ? 740 : 570,
          //   settings: {
          //       slidesToShow: albums ? 1 : 3,
          //   }
          // },
          // {
          //   breakpoint: 450, /////////////////
          //   settings: {
          //       slidesToShow: albums ? 2 : 2.4,
          //   }
          // },
          // {
          //   breakpoint: 384, /////////////////
          //   settings: {
          //       slidesToShow: albums ? 1.7 : 2,
          //   }
          // },
          // // {
          // //   breakpoint: 652,
          // //   settings: {
          // //       slidesToShow: 1.9,
          // //   }
          // // },
          // // {
          // //   breakpoint: 615,
          // //   settings: {
          // //       slidesToShow: 1.8,
          // //   }
          // // },
          // // {
          // //   breakpoint: 585,
          // //   settings: {
          // //       slidesToShow: 1,
          // //   }
          // // },
        ] : [] 
      }
    }, [])

  return (
    <Slider {...settingsMem} className={`${styles.slider__container} ${className}`}>
      {
        data?.map((item:any, index:number) => (
          <div key={index} className={styles.slide}>{item}</div>
        ))
      }
      {/* <ReactBlur className={styles.blurEffect} /> */}
    </Slider>
  )
}

export default SliderLib