import { APP_STATUS } from "@/constants";
import { Tag } from "antd";

// 审核中、运行中、审核不通停止
export type TAppStatus = "under_review" | "running" | "no_pass" | "stop";

interface Props {
  status: TAppStatus;
}

const AppStatus = ({ status }: Props) => {
  return (
    <>
      {status === "under_review" ? (
        <Tag color="warning">{(APP_STATUS as any)[status]}</Tag>
      ) : null}
      {status === "running" ? (
        <Tag color="success">{(APP_STATUS as any)[status]}</Tag>
      ) : null}
      {status === "no_pass" ? (
        <Tag color="error">{(APP_STATUS as any)[status]}</Tag>
      ) : null}
      {status === "stop" ? (
        <Tag color="default">{(APP_STATUS as any)[status]}</Tag>
      ) : null}
    </>
  );
};

export default AppStatus;
