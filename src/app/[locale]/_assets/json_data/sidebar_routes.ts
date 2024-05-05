import { SidebarRoutes } from "@app/_types"

const sidebar_routes: SidebarRoutes = [
    {
      display_name: {
        ru: 'Главное',
        tm: 'Baş sahypa'
      },
      route: '/',
      icon: "home",
      sub: []
    },
    {
      display_name: {
        ru: 'Поиск',
        tm: 'Gözle'
      },
      route: '/search?tab=genre',
      icon: "search",
      sub: []
    },
    {
      display_name: {
        ru: 'Избранное',
        tm: 'Halanlarym'
      },
      route: '/liked',
      icon: "favorite",
      sub: []
    },
    {
      display_name: {
        ru: 'Настройки',
        tm: 'Sazlamalar'
      },
      route: '/settings',
      icon: "settings",
      sub: []
    }
  ]

  export default sidebar_routes