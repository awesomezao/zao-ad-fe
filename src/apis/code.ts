import { IApp } from "./app";
import axios from "./index";
import { ISummary } from "./ads";

export interface ICode {
  _id: string;
  app_id: string;
  code_name: string;
  code_type: string;
  code_status: string;
  shield: number[];
  app: IApp | any;
  price: number;
  date: number[];
}

export interface ICreateCodeReq {
  code_name: string;
  code_type: string;
  shield: string; // encode
  app_id: string;
}

export const createCode = (req: ICreateCodeReq): Promise<ICode> =>
  axios.post("/code/create", req);

export interface IUpdateCodeReq {
  _id: string;
  code_name: string;
  shield: string;
}
export const updateCode = (req: IUpdateCodeReq): Promise<{}> =>
  axios.post("/code/update", req);

export const getCodeList = (): Promise<ICode[]> => axios.get("/code/list");

export const getFilterCodeList = (app_id: string): Promise<ICode[]> =>
  axios.get("/code/filter_list", { params: { app_id } });

export interface IGetCodeInfoRes extends ICode {
  app: IApp;
}
export const getCodeInfo = (code_id: string): Promise<ICode> =>
  axios.get("/code/info", { params: { code_id } });

export const getCodeName = (code_id: string): Promise<string> =>
  axios.get("/code/codeName", {
    params: { code_id },
  });

export const getCodeSummary = (): Promise<ISummary> =>
  axios.get("/code/summary");
