import React from 'react';
import { Menu } from 'antd';
import {useHistory} from "react-router-dom";

import styles from "./index.module.less"

const { SubMenu } = Menu;

export default function Home(props: any) {
  let history = useHistory();
  const  handleClick = (e: any) => {
    console.log(e)
    const { key } = e;
    history.push(key);
  };

  return (
    <div className={styles.headerWrapper}>
      <div className={styles.topBanner}>
        招商银行跨银行交换中心
      </div>
      <div className={styles.bottomUserInfo}>
        <Menu
          onClick={handleClick}
          mode="horizontal"
        >
          <SubMenu key="systemManagement" title="系统管理">
            <Menu.Item key="cacheManagement">缓存管理</Menu.Item>
          </SubMenu>
        </Menu>
      </div>
    </div>
  )
}