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
  ads_name: 1,
  pay_method: 1,
  payments: 1,
  code_type: 1,
  buried_event: '$buried.event',
  buried_date: '$buried.data.date',
  buried_date_string: '$buried.data.date_string',
  buried_value: '$buried.data.value',
  data: {
    ads_name: string;
    pay_method: string;
    payments: number;
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
