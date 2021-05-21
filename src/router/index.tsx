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
              "/event/manage",
              "/event/manage/create",
              "/event/manage/update",
              "/event/report",
              "/flow/app",
              "/flow/app/create",
              "/flow/app/update",
              "/flow/code",
              "/flow/code/create",
              "/flow/code/update",
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
                    component={lazy(() => import("@/pages/Media/Access"))}
                  />
                  <Route
                    path="/finance"
                    component={lazy(() => import("@/pages/Finance"))}
                  />
                  <Route
                    path="/report/media"
                    component={lazy(() => import("@/pages/Media/Report"))}
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
                    path="/event/manage"
                    exact
                    component={lazy(() => import("@/pages/Media/CustomEvent/Home"))}
                  />
                  <Route
                    path="/event/manage/create"
                    component={lazy(() => import("@/pages/Media/CustomEvent/Create"))}
                  />
                  <Route
                    path="/event/manage/update"
                    component={lazy(() => import("@/pages/Media/CustomEvent/Update"))}
                  />
                  {/* <Route
                    path="/event/report"
                    exact
                    component={lazy(() => import("@/pages/eventReportHome"))}
                  />
                  <Route
                    path="/event/manage/:type"
                    component={lazy(() => import("@/pages/event"))}
                  /> */}
                  <Route
                    exact
                    path="/flow/app"
                    component={lazy(() => import("@/pages/Media/App/Home"))}
                  />
                  <Route
                    path="/flow/app/create"
                    component={lazy(() => import("@/pages/Media/App/Create"))}
                  />
                  <Route
                    path="/flow/app/update"
                    component={lazy(() => import("@/pages/Media/App/Update"))}
                  />
                  <Route
                    exact
                    path="/flow/code"
                    component={lazy(() => import("@/pages/Media/Code/Home"))}
                  />
                  <Route
                    path="/flow/code/create"
                    component={lazy(() => import("@/pages/Media/Code/Create"))}
                  />
                  <Route
                    path="/flow/code/update"
                    component={lazy(() => import("@/pages/Media/Code/Update"))}
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
