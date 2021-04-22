import axios, { AxiosRequestConfig, AxiosError, AxiosResponse } from "axios";
import { message } from "antd";
import qs from "qs";
import checkStatus from "@/utils/checkStatus";

const envUrl = process.env.REACT_APP_API_ENV;

const instance = axios.create({
  timeout: 6000,
  baseURL: envUrl,
});

instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    let token = window.localStorage.getItem("user_token");
    config.headers = Object.assign(
      config.method === "get"
        ? {
            Accept: "application/json",
            "Content-Type": "application/json; charset=UTF-8",
          }
        : {
            "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
          },
      config.headers
    );
    if (token) {
      config.headers["token"] = token;
    }
    if (config.method === "post") {
      const contentType: string = config.headers["Content-Type"];
      if (contentType) {
        if (contentType.includes("multipart")) {
        } else if (contentType.includes("json")) {
          config.data = JSON.stringify(config.data);
        } else {
          config.data = qs.stringify(config.data);
        }
      }
    }
    return Promise.resolve(config);
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.headers["content-type"] === "application/octet-stream") {
      response.config.responseType = "blob";
      return response;
    }
    const { code } = response.data || {};
    if (code > 0) {
      message.error(response.data.message || "请求失败,请稍候重试...");
      return Promise.resolve({});
    } else {
      if ((response.config as any).message) {
        message.success((response.config as any).message);
      }
      // return Promise.resolve(checkStatus(response))
      return Promise.resolve(response.data?.data);
    }
  },
  (error: AxiosError) => {
    if (error.response) {
      // return Promise.reject(checkStatus(error.response))
      message.error(error.response.data.message);
      return Promise.reject(error.response.data);
    } else if (
      error.code === "ECONNABORTED" &&
      error.message.indexOf("timeout") !== -1
    ) {
      return Promise.reject({ message: "请求超时" });
    } else {
      return Promise.reject({});
    }
  }
);

export default instance;
