import styled from "@emotion/styled";
import { PageHeader as AntdPageHeader } from "antd";
import { useHistory } from "react-router-dom";

interface Props {
  title: string;
  showBack?: boolean;
}

const Wrapper = styled.div`
  .ant-page-header {
    padding: 5px 0 10px 0;
  }
`;

const PageHeader = ({ title, showBack = false }: Props) => {
  const history = useHistory();
  let handleBack = undefined;
  if (showBack) {
    handleBack = () => history.goBack();
  }
  return (
    <Wrapper>
      <AntdPageHeader title={title} onBack={handleBack} />
    </Wrapper>
  );
};

export default PageHeader;
