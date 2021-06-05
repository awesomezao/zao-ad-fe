import { BoxWrapper } from "@/styles/wrapper";
import { Button, Popconfirm, Space } from "antd";
import { useHistory } from "react-router-dom";

interface Props {
  onCancel?: () => void;
  onConfirm: () => void;
  margin?: string;
  loading?: boolean;
  width?: string;
}

const FooterBtnGroup = (props: Props) => {
  const {
    onCancel,
    onConfirm = () => {},
    loading = false,
    width,
    margin = "",
  } = props;
  const history = useHistory();
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      history.goBack();
    }
  };

  return (
    <BoxWrapper
      width={width}
      margin={margin}
      css={{ display: "flex", justifyContent: "flex-end" }}
    >
      <Space>
        <Button onClick={handleCancel}>取消</Button>
        <Popconfirm
          title="确认要提交吗"
          okText="确认"
          cancelText="取消"
          onConfirm={onConfirm}
        >
          <Button type="primary" loading={loading}>
            提交
          </Button>
        </Popconfirm>
      </Space>
    </BoxWrapper>
  );
};

export default FooterBtnGroup;
