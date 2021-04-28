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
