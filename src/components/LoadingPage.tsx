// 封装antd的Spin，主要用于路由懒加载的fallback
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import styled from "@emotion/styled";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const Wrapper = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LoadingPage = () => (
  <Wrapper>
    <Spin indicator={antIcon} />
  </Wrapper>
);

export default LoadingPage;
