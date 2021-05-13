import {
  Home,
} from '@/pages'
import React from 'react'

export type RouterType = {
  path: string,
  component: React.LazyExoticComponent<any>,
  root: string[],
  notExect?: boolean,
}

const HomeRouter: RouterType = {
  path: '/home',
  component: Home,
  root: [],
}

const Routers: RouterType[] = ([
  HomeRouter,
])

export {
  Routers
}