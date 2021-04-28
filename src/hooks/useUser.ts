import { useRecoilState } from "recoil";
import { userState } from "@/globalState/user";
import { getProfile } from "@/apis/user";

export const useUser = () => {
  const [user, setUser] = useRecoilState(userState);

  const refreshUserStatus = async () => {
    const res = await getProfile();
    setUser(res);
  };

  return { user, refreshUserStatus };
};
