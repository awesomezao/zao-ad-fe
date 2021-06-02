import { useRecoilState } from "recoil";
import { currentState } from "@/globalState/history";
import { useHistory } from "react-router-dom";

export const useCurrent = () => {
  const [current, setCurrent] = useRecoilState(currentState);
  const history = useHistory();
  const redirect = (target: string) => {
    setCurrent(target);
    history.push(target);
  };

  return { current, setCurrent, redirect };
};
