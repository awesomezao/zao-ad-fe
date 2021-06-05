import { ISummary } from "./ads";
import { ICode } from "./code";
import axios from "./index";

export interface IApp {
  _id: string;
  app_name: string;
  user_id: string;
  app_status: string;
  industry: number;
  shield: number[];
}

export interface ICreateAppReq {
  app_name: string;
  shield: string; // encode
  industry: number;
}

export const createApp = (req: ICreateAppReq): Promise<IApp> =>
  axios.post("/app/create", req);

export interface IUpdateAppReq extends ICreateAppReq {
  app_id: string;
}
export const updateApp = (req: IUpdateAppReq): Promise<{}> =>
  axios.post("/app/update", req);

export const getAppList = (running?: boolean): Promise<IApp[]> =>
  axios.get("/app/list", { params: { running } });

export const getAppInfo = (app_id: string): Promise<IApp> =>
  axios.get("/app/info", { params: { app_id } });

export interface IAppInfo extends IApp {
  codes: ICode[];
}

export const getAppInfoList = (): Promise<IAppInfo[]> =>
  axios.get("/app/infoList");

export const getAppSummary = (): Promise<ISummary> => axios.get("/app/summary");

export const changeAppStatus = (
  app_id: string,
  status: "stop" | "under_review"
): Promise<{}> => axios.get("/app/status", { params: { app_id, status } });

export const deleteApp = (app_id: string): Promise<{}> =>
  axios.get("/app/delete", { params: { app_id } });
