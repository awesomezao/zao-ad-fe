import React from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
const { confirm } = Modal;

interface Props {
  title: string;
  content: string | React.ReactNode;
  okText?: string;
  cancelText?: string;
  onOk?: (payload: any) => void;
  onCancel?: (payload: any) => void;
}

const useConfirm = ({
  title,
  content,
  okText = "操作成功",
  cancelText = "返回主页",
  onOk = () => {},
  onCancel = () => {},
}: Props) => {
  const showConfirm = (payload?: any) => {
    confirm({
      title,
      icon: <ExclamationCircleOutlined style={{ color: "#52C41A" }} />,
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

export default useConfirm;
