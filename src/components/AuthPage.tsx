import { useHistory } from "react-router-dom";
import { Button } from "antd";
import styled from "@emotion/styled";
import { FlexWrapper } from "@/styles/wrapper";

const AuthWrapper = styled(FlexWrapper)`
  border: 1px solid red;
  width: 400px;
  height: 200px;
`;

const AuthPage = () => {
  const history = useHistory();
  return (
    <AuthWrapper flexColumn horizontalCenter top="100px" flexCenter>
      <div css={{ color: "red" }}>若要访问请进行如下操作</div>
      <FlexWrapper>
        <Button type="primary" onClick={() => history.push("/login")}>
          登陆
        </Button>
        <Button onClick={() => history.goBack()}>取消</Button>
      </FlexWrapper>
    </AuthWrapper>
  );
};

export default AuthPage;
