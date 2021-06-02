import { atom } from "recoil";

export const currentState = atom({
  key: "current",
  default: "/",
});
