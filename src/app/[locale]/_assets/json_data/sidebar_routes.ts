import { SidebarRoutes } from "@app/_types"

const sidebar_routes: SidebarRoutes = [
    {
      display_name: {
        ru: 'Основной',
        tk: 'Baş sahypa'
      },
      route: '/',
      icon: "home",
      sub: []
    },
    {
      display_name: {
        ru: 'Поиск',
        tk: 'Gözle'
      },
      route: '/search?tab=genre',
      icon: "search",
      sub: []
    },
    // {
    //   display_name: {
    //     ru: 'playlists',
    //     tk: 'playlists'
    //   },
    //   route: '/playlists',
    //   icon: "playlist",
    //   sub: []
    // },
    {
      display_name: {
        ru: 'Настройки',
        tk: 'Sazlamalar'
      },
      route: '/settings',
      icon: "settings",
      sub: []
    }
  ]

  export default sidebar_routes