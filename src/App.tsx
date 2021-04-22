import { useEffect } from "react";
import Router from "./router";
import { getProfile } from "@/apis/user";
import { useRecoilState } from "recoil";
import { userState } from "@/globalState/user";

const App = () => {
  const [user, setUser] = useRecoilState(userState);

  const initData = async () => {
    const res = await getProfile();
    setUser(res)
  };

  useEffect(() => {
    initData();
  }, []);

  return <Router />;
};

export default App;
