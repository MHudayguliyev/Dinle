import { SidebarRoutes } from "@app/_types"

const sidebar_routes: SidebarRoutes = [
    {
      display_name: {
        en: 'Main',
        ru: 'Основной',
        tm: 'Esasy'
      },
      route: '/',
      icon: "home",
      sub: []
    },
    {
      display_name: {
        en: 'Search',
        ru: 'Search',
        tm: 'Search'
      },
      route: '/search?tab=genre',
      icon: "search",
      sub: []
    },
    {
      display_name: {
        en: 'playlists',
        ru: 'playlists',
        tm: 'playlists'
      },
      route: '/playlists',
      icon: "playlist",
      sub: []
    },
    {
      display_name: {
        en: 'Settings',
        ru: 'Settings',
        tm: 'Settings'
      },
      route: '/settings',
      icon: "settings",
      sub: []
    }
  ]

  export default sidebar_routes