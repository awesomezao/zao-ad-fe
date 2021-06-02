import axios from "./index";

export interface IReviewAppData {
  _id: string;
  app_id: string;
  app_name: string;
  industry: number;
  user_id: string;
  app_status: string;
  user_name: string;
}

export interface IReviewCodeData {
  _id: string;
  code_id: string;
  app_id: string;
  app_name: string;
  industry: number;
  code_type: string;
  code_name: string;
  user_id: string;
  code_status: string;
  user_name: string;
}

export interface IReviewAdsData {
  _id: string;
  ads_id: string;
  ads_name: string;
  code_type: string;
  pay_method: string;
  payments: number;
  status: string;
  ads_amount: number;
  user_name: string;
}

export interface IReviewRechargeData {
  _id: string;
  user_id: string;
  user_name: string;
  order_id: string;
  amount: number;
  date_string: string;
  status: string;
}

export interface IReviewWithdrawData extends IReviewRechargeData {}

export const getReviewAppList = (): Promise<IReviewAppData[]> =>
  axios.get("/app/review/list");
export const getReviewCodeList = (): Promise<IReviewCodeData[]> =>
  axios.get("/code/review/list");
export const getReviewAdsList = (): Promise<IReviewAdsData[]> =>
  axios.get("/ads/review/list");

export const getReviewRechargeList = (): Promise<IReviewRechargeData[]> =>
  axios.get("/user/review/recharge/list");
export const getReviewWithdrawList = (): Promise<IReviewWithdrawData[]> =>
  axios.get("/user/review/withdraw/list");

export const reviewApp = (app_id: string, status: string): Promise<{}> =>
  axios.get("/app/review", {
    params: { app_id, status },
  });
export const reviewCode = (code_id: string, status: string): Promise<{}> =>
  axios.get("/code/review", {
    params: { code_id, status },
  });
export const reviewAds = (ads_id: string, status: string): Promise<{}> =>
  axios.get("/ads/review", {
    params: { ads_id, status },
  });
export const reviewRecharge = (
  user_id: string,
  order_id: string,
  status: string
): Promise<{}> =>
  axios.get("/user/review/recharge", {
    params: { user_id, order_id, status },
  });
export const reviewWithdraw = (
  user_id: string,
  order_id: string,
  status: string
): Promise<{}> =>
  axios.get("/user/review/withdraw", {
    params: { user_id, order_id, status },
  });
