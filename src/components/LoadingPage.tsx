// 封装antd的Spin，主要用于路由懒加载的fallback
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { FlexWrapper } from "@/styles/wrapper";

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

const LoadingPage = () => (
  <FlexWrapper center css={{ height: "100vh" }}>
    <Spin indicator={antIcon} />
  </FlexWrapper>
);

export default LoadingPage;
