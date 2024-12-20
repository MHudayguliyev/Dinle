import React, { useMemo } from 'react'
import CustomLink from '@components/CustomLink/CustomLink';
//types
import { Localization, TabMenuTypes } from '@app/_types';
//styles
import styles from './Tab.module.scss';
import classNames from 'classnames/bind';
//hooks
import useWindowSize from '@hooks/useWindowSize'
import { useWindowScrollPositions } from '@app/_hooks/useWindowOffset'
import { isUndefined } from '@app/_utils/helpers';
//redux-hooks
import { useAppSelector } from '@app/_hooks/redux_hooks';
//translations
import { useLocale } from 'next-intl';

type TabProps = {
  tabs: TabMenuTypes[]
  pathname: string | null
  baseUrl: string 
  /** @defaultValue false **/
  searchMenu?: boolean
  /** @defaultValue false **/
  fixed?: boolean
  /** @defaultValue false **/
  fixedTopNull?: boolean
  scrollYPosition?: number
}
const cn = classNames.bind(styles)
function Tab (props: TabProps){
  const {
    tabs, 
    pathname, 
    baseUrl, 
    searchMenu = false, 
    fixed = false, 
    scrollYPosition,  
    fixedTopNull, 
  }= props

  const locale = useLocale()
  const sidebarFolded = useAppSelector(state => state.sidebarReducer.sidebarFolded)
  const [width] = useWindowSize()
  const { scrolly } = useWindowScrollPositions()
  const scrollPositionFixed = useMemo(() =>  width <= 768 && scrollYPosition ? scrollYPosition + 10 : scrollYPosition,[scrollYPosition, scrolly, width]) 


  return (
    <div className={cn({
      menu: true, 
      autoHeight: (fixed || fixedTopNull) && scrollPositionFixed
    })}>
      <div className={cn({
        wrapper: true, 
        fixed: (!isUndefined(scrollPositionFixed) && scrolly >= scrollPositionFixed! && fixed), 
        fixedTopNull: (!isUndefined(scrollPositionFixed) && scrolly >= scrollPositionFixed! && fixedTopNull), 
        sidebarFolded: sidebarFolded
      })}>
        {
          tabs.map(tab => (
            <CustomLink  href={"/".concat(baseUrl + `?tab=${tab.route}`)} className={cn({ active: (pathname === tab.route) || (!searchMenu && isUndefined(pathname) && tab.route === tabs[0].route) })}>
              {tab.label[locale as keyof Localization]}
            </CustomLink>
          ))
        }
      </div>
    </div>
  )
}

export default Tab