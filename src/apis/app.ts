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

export const getAppList = (): Promise<IApp[]> => axios.get("/app/list");

export const getAppInfo = (app_id: string): Promise<IApp> =>
  axios.get("/app/info", { params: { app_id } });

export interface IAppInfo extends IApp {
  codes: ICode[];
}

export const getAppInfoList = (): Promise<IAppInfo[]> =>
  axios.get("/app/infoList");
