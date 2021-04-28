import { lazy, Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import RenderRoutes, { IRoute } from "@/utils/RenderRoutes";
import LoadingPage from "@/components/LoadingPage";
import EmptyLayout from "@/layout/EmptyLayout";
import NormalLayout from "@/layout/NormalLayout";

const Router = () => {
  return (
    <BrowserRouter>
      {/* <RenderRoutes routes={routes} isLogin />
       */}
      <Suspense fallback={<LoadingPage />}>
        <Switch>
          <Route
            exact
            path={[
              "/",
              "/account",
              "/summary",
              "/access",
              "/finance",
              "/report/media",
              "/report/advertiser",
              "/ads",
              "/ads/:type",
              "/buried/manage",
              "/buried/manage/:type",
              "/buried/report",
              "/flow/apps",
              "/flow/codes",
              "/flow/apps/:type",
              "/flow/codes/:type",
            ]}
            render={() => {
              return (
                <NormalLayout>
                  <Route
                    exact
                    path="/"
                    component={lazy(() => import("@/pages/Summary"))}
                  />
                  <Route
                    path="/account"
                    component={lazy(() => import("@/pages/Center"))}
                  />
                  {/* <Route
                    path="/summary"
                    component={lazy(() => import("@/pages/Summary"))}
                  /> */}
                  <Route
                    path="/access"
                    component={lazy(() => import("@/pages/Access"))}
                  />
                  <Route
                    path="/finance"
                    component={lazy(() => import("@/pages/Finance"))}
                  />
                  <Route
                    path="/report/media"
                    component={lazy(() => import("@/pages/MediaReport"))}
                  />
                  <Route
                    path="/report/advertiser"
                    component={lazy(() => import("@/pages/AdvertiserReport"))}
                  />
                  <Route
                    path="/ads"
                    exact
                    component={lazy(() => import("@/pages/AdsHome"))}
                  />
                  <Route
                    path="/ads/:type"
                    component={lazy(() => import("@/pages/Ads"))}
                  />
                  <Route
                    path="/buried/manage"
                    exact
                    component={lazy(() => import("@/pages/BuriedHome"))}
                  />
                  <Route
                    path="/buried/report"
                    exact
                    component={lazy(() => import("@/pages/BuriedReportHome"))}
                  />
                  <Route
                    path="/buried/manage/:type"
                    component={lazy(() => import("@/pages/Buried"))}
                  />
                  <Route
                    exact
                    path="/flow/apps"
                    component={lazy(() => import("@/pages/AppHome"))}
                  />
                  <Route
                    exact
                    path="/flow/codes"
                    component={lazy(() => import("@/pages/CodeHome"))}
                  />
                  <Route
                    path="/flow/apps/:type"
                    component={lazy(() => import("@/pages/Apps"))}
                  />
                  <Route
                    path="/flow/codes/:type"
                    component={lazy(() => import("@/pages/Codes"))}
                  />
                </NormalLayout>
              );
            }}
          ></Route>

          <Route
            path="/login"
            component={lazy(() => import("@/pages/Login"))}
          />
          <Route
            path="/register"
            component={lazy(() => import("@/pages/Register"))}
          />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};

export default Router;
