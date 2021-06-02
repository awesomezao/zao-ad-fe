import { IUser } from "@/react-app-env";
import { ICode } from "./code";
import axios from "./index";

interface ILoginReq {
  username: string;
  password: string;
  role: string;
}
interface ILoginRes {
  token: string;
}
export const login = (req: ILoginReq): Promise<ILoginRes> =>
  axios.post("/user/login", req);

export const register = (req: IUser): Promise<IUser> =>
  axios.post("/user/register", req, {
    headers: {
      "Content-Type": "multipart/form-data; ",
    },
  });

export const getProfile = (): Promise<IUser> => axios.get("/user/profile");

export const updateUser = (req: any): Promise<{}> =>
  axios.post("/user/update", req, {
    headers: {
      "Content-Type": "multipart/form-data; ",
    },
  });

export interface IMedia {
  _id: string;
  media_name: string;
  apps: {
    app_id: string;
    app_name: string;
    codes: ICode[];
  }[];
}
export const getMediaList = (): Promise<IMedia[]> =>
  axios.get("/user/getMediaList");

export interface ISplash {
  _id: string;
  user_id: string;
  user_name: string;
  apps: {
    app_id: string;
    app_name: string;
    codes: {
      code_name: string;
      code_id: string;
    }[];
  }[];
}
export const getSplashList = (): Promise<ISplash[]> =>
  axios.get("/user/splash/list");

export interface IAdvertiserFinance {
  _id: string;
  user_id: string;
  balance: number; // 余额
  today_cost: number; // 今日花费
  today_date_string: string;
}
export const getAdvertiserFinanceInfo = (): Promise<IAdvertiserFinance> =>
  axios.get("/user/advertiser_finance/info");

export interface IMediaFinance {
  _id: string;
  user_id: string;
  earnings: number; // 余额
  today_earnings: number; // 今日收益
  today_date_string: string;
}
export const getMediaFinanceInfo = (): Promise<IMediaFinance> =>
  axios.get("/user/media_finance/info");

export interface IAdminFinance extends IMediaFinance {}
export const getAdminFinanceInfo = (): Promise<IAdminFinance> =>
  axios.get("/user/admin_finance/info");

export interface ICharge {
  _id: string;
  user_id: string;
  date_string: string;
  status: string;
  amount: number;
}
export const recharge = (amount: number): Promise<ICharge> =>
  axios.get("/user/recharge", { params: { amount } });

export const getRechargeList = (): Promise<ICharge[]> =>
  axios.get("/user/recharge/list");

export interface IWithdraw extends ICharge {}
export const withdraw = (amount: number): Promise<IWithdraw> =>
  axios.get("/user/withdraw", { params: { amount } });

export const getWithdrawList = (): Promise<IWithdraw[]> =>
  axios.get("/user/withdraw/list");
