import React from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
const { confirm } = Modal;

interface Props {
  title?: string;
  content?: string | React.ReactNode;
  okText?: string;
  cancelText?: string;
  onOk?: (payload: any) => void;
  onCancel?: (payload: any) => void;
}

const useStopConfirm = ({
  title = "提示",
  content = <>确认要停用吗</>,
  okText = "确认",
  cancelText = "取消",
  onOk = () => {},
  onCancel = () => {},
}: Props) => {
  const showConfirm = (payload?: any) => {
    confirm({
      title,
      icon: <ExclamationCircleOutlined style={{ color: "#e9441b" }} />,
      content,
      okText,
      cancelText,
      onOk() {
        onOk(payload);
      },
      onCancel() {
        onCancel(payload);
      },
    });
  };
  return { showConfirm };
};

export default useStopConfirm;
