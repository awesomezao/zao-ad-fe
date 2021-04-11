// 全局路由渲染
import { Suspense } from "react";
import * as H from "history";
import ReactRouter, { Redirect, Route, Switch } from "react-router-dom";
import LoadingPage from "@/components/LoadingPage";
import AuthPage from "@/components/AuthPage";

export interface IRoute extends ReactRouter.RouteProps {
  name?: string;
  path: string;
  requireAuth?: boolean;
  redirect?: H.LocationDescriptor;
  childRoutes?: IRoute[];
}

interface Props {
  routes: IRoute[];
  isLogin: boolean;
  extraProps?: any;
  switchProps?: ReactRouter.SwitchProps;
}

const RenderRoutes = ({
  routes,
  isLogin,
  extraProps = {},
  switchProps = {},
}: Props) => {
  if (!Array.isArray(routes)) {
    return <></>;
  }
  return (
    <Suspense fallback={<LoadingPage />}>
      <Switch {...switchProps}>
        {routes.map((route, i) => {
          if (route.redirect) {
            return (
              <Redirect
                key={route.path || i}
                exact={route.exact}
                strict={route.strict}
                from={route.path}
                to={route.redirect}
              />
            );
          }
          return (
            <Route
              key={route.path || i}
              path={route.path}
              exact={route.exact}
              strict={route.strict}
              render={(props) => {
                if (route.requireAuth && !isLogin) {
                  return <AuthPage />;
                }
                let renderChildRoutes = route.childRoutes ? (
                  <RenderRoutes routes={route.childRoutes} isLogin={isLogin} />
                ) : null;
                if (route.component) {
                  return (
                    <route.component {...props} {...extraProps} route={route}>
                      {renderChildRoutes}
                    </route.component>
                  );
                }
                return renderChildRoutes;
              }}
            />
          );
        })}
      </Switch>
    </Suspense>
  );
};

export default RenderRoutes;
