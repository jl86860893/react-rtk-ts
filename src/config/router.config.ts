import {RvcRouteConfig} from "../utils/router";

const routes: RvcRouteConfig[] = [
  {
    path: '/',
    component: 'layouts/GlobalLayout',
    exact: false,
    routes: [
      {
        path: '/',
        redirect: '/home'
      },
      {
        path: '/home',
        component: 'pages/home/index'
      }
    ]
  },
]

export default routes;