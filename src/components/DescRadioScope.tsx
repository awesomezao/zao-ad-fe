import { Space, Tooltip } from "antd";
import { QuestionCircleFilled } from "@ant-design/icons";

interface Props {
  title: string;
  desc: string;
}

const DescRadioScope = ({ title, desc }: Props) => {
  return (
    <Space>
      {title}
      <Tooltip title={desc} color="#fff" overlayInnerStyle={{ color: "#000" }}>
        <QuestionCircleFilled style={{ color: "#c4c8cc" }} />
      </Tooltip>
    </Space>
  );
};

export default DescRadioScope;
