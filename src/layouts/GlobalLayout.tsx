import React, {FC, useEffect, useState} from 'react';
import Header from '@/components/Header'
import {renderRoutesMap, RouteCompProps} from "@/utils/router";

interface HomeProps extends RouteCompProps{
}

const GlobalLayout: FC<HomeProps> = (props) => {
  // @ts-ignore
  const routes = props.route?.routes;

  return (
    <div style={{ width: '100%' }}>
      <Header />
      {renderRoutesMap(routes)}
    </div>
  )
}

export default GlobalLayout;