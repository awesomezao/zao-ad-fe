import styled from "@emotion/styled";
import { ContainerWrapper } from "@/styles/wrapper";
import zaoLogoImg from "@/assets/images/zao_logo.png";

const LoginWrapper = styled(ContainerWrapper)`
  top: 200px;
  width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  .logo {
    height: 50px;
    margin-bottom: 50px;
    display: flex;
    align-items: center;
    text-align: center;
    span {
      font-size: 30px;
      font-weight: bold;
      padding-left: 15px;
      position: relative;
      top: -3px;
    }
  }
  .form {
    width: 100%;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 24px 73px rgba(156, 152, 152, 0.35);
  }
  .copyRight {
    font-size: 12px;
    color: #8f9fcc;
    margin-top: 50px;
    text-align: center;
  }
`;

const AuthWrapper: React.FC<{}> = ({ children }) => {
  return (
    <LoginWrapper horizontalCenter>
      <div className="logo">
        <img alt="" src={zaoLogoImg} height="50px" />
        <span>广告管理平台</span>
      </div>

      <div className="form">{children}</div>
      <div className="copyRight">
        Copyright © 2021 - 202~ zao Inc. All Rights Reserved.
      </div>
    </LoginWrapper>
  );
};

export default AuthWrapper;
