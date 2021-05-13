import React, {Suspense} from 'react';

import {HashRouter as Router, match, Redirect, Switch} from 'react-router-dom';
import {Route, RouteComponentProps, RouteProps} from 'react-router'
import loadable from '@loadable/component';
import * as H from "history";

export interface RvcRouteConfig {
    /**
     * 路由名
     */
    path?: string;
    /**
     * 匹配到当前路由之后,要跳转的路由
     */
    redirect?: string;
    /**
     * 是否精确匹配. 默认: true
     */
    exact?: boolean;
    /**
     * <strong>不需要懒加载的路由绑定模块</strong>
     * <p>
     * 如：已经引入了Home组件, 则component填 Home
     * </p>
     * <strong>需要懒加载的路由绑定模块.</strong>
     * <p>
     * 所有的路由都是以src为根目录.
     * </p>
     * <p>
     * 如果你有个模块:src/Home, 则component填'Home'
     * </p>
     * <p>
     * 如果你有个模块:src/pages/Test, 则component填'pages/Test'
     * </p>
     */
    component?: any;
    /**
     * 子路由
     */
    routes?: RvcRouteConfig[],
    /**
     * 是否将path值作为key. 默认为:true. 为true时, 路由的key为path值, 否则为路由的索引值
     */
    pathAsKey?: boolean,
    /**
     * 路由挂载组件的高阶组件封装, 可以用来实现鉴权. 所有高阶组件都使用懒加载. 高阶组件会从右到左开始逐层包装, 只有当前这一层执行通过, 才会继续执行下一层
     * <br/>
     * 所有的路由都是以src为根目录.
     * </p>
     * <p>
     * 如果你有个模块:src/Home, 则component填'Home'
     * </p>
     * <p>
     * 如果你有个模块:src/pages/Test, 则component填'pages/Test'
     * </p>
     */
    wrappers?: string[]
}

interface ExpandRouteProps extends RouteProps {
    key: any;
}

/**
 * 构建包装组件
 * @param WrapperComponent 包装组件
 * @param TargetComponent  被包装组件
 * @param lazyLoad 目标组件是否为懒加载方式
 * @param route 当前的路由信息
 * @param props 其它参数
 */
const buildWrapperComponent = (WrapperComponent: any, TargetComponent: any, lazyLoad: boolean, route: RvcRouteConfig, props: RouteComponentProps<any>): any => {
    if (null === WrapperComponent) {
        return () => lazyLoad ?
            <Suspense fallback={<div>Loading……</div>}>
              <TargetComponent {...props} route={route}/>
            </Suspense>
            : <TargetComponent {...props} route={route}/>
    }
    return () => <WrapperComponent {...props} route={route}>
        <TargetComponent {...props} route={route}/>
    </WrapperComponent>
}

/**
 * 深度包装
 * @param RealComponent 真正需要被包装的组件
 * @param wrapperArr 用于包装的组件
 * @param lazyLoad 真正需要被包装的组件是否是懒加载方式
 * @param route 当前的路由信息
 * @param props 其它参数
 */
const deepWrapper = (RealComponent: any, wrapperArr: string[], lazyLoad: boolean, route: RvcRouteConfig, props: RouteComponentProps<any>) => {
    if (wrapperArr.length === 0) {
        return buildWrapperComponent(null, RealComponent, lazyLoad, route, props)
    }
    let WrapperComponent = null;
    for (let wrapper of wrapperArr) {
        const TargetComponent = loadable(() => import(`@/${wrapper}`));
        if (WrapperComponent === null) {
            WrapperComponent = buildWrapperComponent(TargetComponent, RealComponent, lazyLoad, route, props);
        } else {
            WrapperComponent = buildWrapperComponent(TargetComponent, WrapperComponent, true, route, props);
        }
    }
    return WrapperComponent;
}
type RouteBuildParam = {
    /**
     * 实际的组件
     */
    component: any;
    /**
     * 路由组件的key
     */
    key: any;
    /**
     * 是否精确匹配
     */
    exact: boolean;
    /**
     * 路由路径
     */
    path?: string;
    /**
     * 当前路由信息
     */
    route: RvcRouteConfig;
    /**
     * 路由的高阶组件封装
     */
    wrappers: string[];
}

/**
 * 构建路由节点
 */
const buildRoute = ({component, key, exact, path, route, wrappers}: RouteBuildParam) => {
    // 判断当前是否使用的懒加载: 当前 route.component 的值为字符串时, 认为是需要使用懒加载方式
    const lazyLoad = typeof (component) === 'string';
    let LoadableComponent = lazyLoad ? loadable(() => import(`@/${component}`)) : component
    return (
        <Route<ExpandRouteProps>
            key={key}
            exact={exact}
            path={path}
            render={
                (props) => {
                    return deepWrapper(LoadableComponent, wrappers, lazyLoad, route, props)()
                }
            }
        />
    )
}

/**
 * 根据路由配置生成路由表
 * @param routes 路由配置
 */
export const renderRoutesMap = (routes?: Array<RvcRouteConfig>): any => {
    if (routes && routes.length > 0) {
        const routeArr = routes.map((route: RvcRouteConfig, index) => {
            // 当存在子路由时, 默认的exact应该为false, 否则应该为true
            const defaultExact = (route.routes && route.routes.length > 0) ? false : true;
            const {exact = defaultExact, path, pathAsKey = true, redirect, component, wrappers = []} = route;
            let key = pathAsKey ? path : index;
            key = key ? key : index;
            if (redirect) {
                return <Redirect key={index} from={path} to={redirect} exact={exact}/>
            } else {
                return buildRoute({component, key, exact, path, route, wrappers});
            }
        })
        return <Switch>{routeArr}</Switch>
    } else {
        return;
    }
}

/**
 * 路由组件公共属性
 */
export interface RouteCompProps {
    history: H.History;
    location: H.Location;
    match: match
}

/**
 * renderRoutes 渲染路由
 * @param  {array}      routes              路由列表
 */
const RenderRoutes: React.FC<{ routes: RvcRouteConfig[] }> = (props) => (
    <Router>
        {renderRoutesMap(props.routes)}
    </Router>
)

export default RenderRoutes
