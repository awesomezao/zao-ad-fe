/// <reference types="react-scripts" />
/// <reference types="@emotion/react/types/css-prop" />

export interface FormRenderSchema<T = any> {
  type: "object";
  displayType?: "row" | "column";
  properties: {
    [propName: string]: {
      title: string;
      placeholder?: string;
      type: string;
      required?: boolean;
      hidden?: boolean;
      format?: string;
      default?: any;
      [propName: string]: any;
    };
  };
}

export interface IUser {
  _id: string;
  username: string;
  password: string;
  role: string;
  name: string;
  avatar: string;
}