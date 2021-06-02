import axios from "./index";

// 投放定向
export type TDirectional = {
  gender: "all" | "man" | "woman";
  location: "all" | string;
  age: "all" | number;
};

// 投放日期：长期、自定义
export type TAdsDate = "long_term" | "custom";

// 信息流、banner、开屏广告、激励视频
export type TCodeType = "stream" | "banner" | "splash" | "reward_video";

// 投放时间：全天、自定义
export type TAdsTime = "all_day" | "custom";

// 千次曝光、前次点击、优化千次曝光、优化千次点击
export type TPayMethod = "CPM" | "CPC" | "oCPM" | "oCPC";

// 创意内容
export interface ICreativeConfig {
  img: string;
  img_type: "vertical" | "horizontal";
  desc: string; // 广告描述
  brand_title: string; // 品牌标题
  location_url: string; // 落地页
}

export interface IAds {
  _id: string;
  // user_id: string;
  ads_name: string; //  投放名称
  // media_id: string; // 媒体id
  code_id: string; // 广告位id
  code_type: TCodeType; // 投放的广告位类型
  directional: TDirectional; // 广告定向
  ads_date: TAdsDate; // 投放日期
  ads_time: TAdsTime; // 投放时间
  pay_method: TPayMethod; // 支付方式
  payments: number; // 支付数额
  creative_config: ICreativeConfig; // 创意内容
  ads_amount: number;
}

export interface ICreateAdsReq {
  code_id: string; // 广告位id
  ads_name: string; //  投放名称
  media_id: string; // 媒体id
  code_type: TCodeType; // 投放的广告位类型
  directional: TDirectional; // 广告定向
  ads_date: TAdsDate; // 投放日期
  ads_time: TAdsTime; // 投放时间
  pay_method: TPayMethod; // 支付方式
  payments: number; // 支付数额
  creative_config: ICreativeConfig; // 创意内容
}
export const creatAds = (req: ICreateAdsReq): Promise<IAds> =>
  axios.post("/ads/create", req);

export interface IUpdateAdsReq {
  ads_id: string;
  ads_name: string; //  投放名称
  directional: TDirectional; // 广告定向
  ads_date: TAdsDate; // 投放日期
  ads_time: TAdsTime; // 投放时间
  pay_method: TPayMethod; // 支付方式
  payments: number; // 支付数额
  creative_config: ICreativeConfig; // 创意内容
}
export const updateAds = (req: ICreateAdsReq): Promise<{}> =>
  axios.post("/ads/update", req);

export const getAdsList = (): Promise<IAds[]> => axios.get("/ads/list");

export const getAdsInfo = (ads_id: string): Promise<IAds> =>
  axios.get("/ads/info", { params: { ads_id } });

export interface ISummary {
  running: number;
  under_review: number;
  no_pass: number;
}
export const getAdsSummary = (): Promise<ISummary> => axios.get("/ads/summary");
