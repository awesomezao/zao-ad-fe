import { BoxWrapper } from "@/styles/wrapper";
import { Button, Popconfirm, Space } from "antd";
import { useHistory } from "react-router-dom";

interface Props {
  onCancel?: () => void;
  onPass: () => void;
  onReject: () => void;
  loading?: boolean;
  width?: string;
  margin?: string;
}

const FooterBtnGroup = (props: Props) => {
  const {
    onCancel,
    onPass = () => {},
    onReject = () => {},
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
        <Button type="primary" danger loading={loading} onClick={onReject}>
          不通过
        </Button>
        <Button type="primary" loading={loading} onClick={onPass}>
          通过
        </Button>
      </Space>
    </BoxWrapper>
  );
};

export default FooterBtnGroup;
