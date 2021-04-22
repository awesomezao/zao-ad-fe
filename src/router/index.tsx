import { lazy } from "react";
import { BrowserRouter } from "react-router-dom";
import RenderRoutes, { IRoute } from "@/utils/RenderRoutes";
import NormalLayout from "@/layout/NormalLayout";

const routes: IRoute[] = [
  {
    path: "/",
    exact: true,
    component: NormalLayout,
  },
  {
    path: "/login",
    // exact: true,
    component: lazy(() => import("@/pages/Login")),
  },
  {
    path: "/register",
    // exact: true,
    component: lazy(() => import("@/pages/Register")),
  },
];

const Router = () => {

  return (
    <BrowserRouter>
      <RenderRoutes routes={routes} isLogin />
    </BrowserRouter>
  );
};

export default Router;
