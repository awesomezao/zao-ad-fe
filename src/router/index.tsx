import { lazy } from "react";
import { BrowserRouter } from "react-router-dom";
import RenderRoutes, { IRoute } from "@/utils/RenderRoutes";

const routes: IRoute[] = [
  {
    path: "/",
    component: lazy(() => import("@/pages/Home")),
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
