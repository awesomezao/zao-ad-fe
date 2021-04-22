import { IUser } from "@/react-app-env";
import { atom, RecoilState } from "recoil";
import userEmptyImg from "@/assets/images/user_empty.png";

export const userState: RecoilState<IUser> = atom({
  key: "userState",
  default: {
    _id: "",
    username: "",
    password: "",
    role: "media",
    name: "",
    avatar: userEmptyImg,
  },
});
