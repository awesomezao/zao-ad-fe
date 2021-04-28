import axios from "./index";

export interface IGetReportChartRes {
  _id: string;
  date: string;
  date_string: string;
  value: number;
  event: string;
}

// -----------------------media--------------------------------
export interface IGetReportChartReq {
  code_id: string;
  type: string;
  start: string;
  end: string;
}
export const getReportChart = (
  req: IGetReportChartReq
): Promise<IGetReportChartRes[]> =>
  axios.get("/report/chart", {
    params: req,
  });
export interface IGetReportTableReq {
  current: number;
  page_size: number;
}
export interface IGetReportTableRes {
  pagination: {
    current: number;
    page_size: number;
    total: number;
  };
  data: {
    _id: string;
    app_name: string;
    industry: number;
    code_id: string;
    code_name: string;
    code_type: string;
    event: string;
    date_string: string;
    date: number;
    value: number;
  }[];
}
export const getReportTable = (
  req: IGetReportTableReq
): Promise<IGetReportTableRes> =>
  axios.get("/report/table", {
    params: req,
  });

// -----------------------advertiser------------------------------
export interface IGetAdsReportChartReq {
  ads_id: string;
  type: string;
  start: string;
  end: string;
}
export const getAdsReportChart = (
  req: IGetAdsReportChartReq
): Promise<IGetReportChartRes[]> =>
  axios.get("/report/chart/ads", {
    params: req,
  });

export interface IGetReportTableReq {
  current: number;
  page_size: number;
}
export interface IGetAdsReportTableRes {
  pagination: {
    current: number;
    page_size: number;
    total: number;
  };
  data: {
    ads_name: string;
    ads_directional: any;
    ads_date: string;
    ads_time: string;
    pay_method: string;
    payments: number;
    ads_creative_config: any;
    code_id: string;
    code_type: string;
    code_name: string;
    media_id: string;
    media_name: string;
    app_id: string;
    app_name: string;
    app_industry: number;
    buried_id: string;
    buried_event: string;
    buried_date: number;
    buried_date_string: string;
    buried_value: number;
  }[];
}
export const getAdsReportTable = (
  req: IGetReportTableReq
): Promise<IGetAdsReportTableRes> =>
  axios.get("/report/table/ads", {
    params: req,
  });
