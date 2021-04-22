import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Menu } from "antd";
import zaoLogoImg from "@/assets/images/zao_logo.png";
import styled from "@emotion/styled";
import UserInfo from "./UserInfo";

const { Item } = Menu;

const HeaderWrapper = styled.div`
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  .logo {
    float: left;
    margin-left: 20px;
    i {
      margin: 0 20px 0 40px;
      border-left: 1px solid #d8d8d8;
    }
  }
  .menu {
    border-bottom: none !important;
  }
  .user-info {
    margin-left: auto;
    margin-right:20px
  }
`;

const PageHeader = () => {
  const [current, setCurrent] = useState("/summary");
  const history = useHistory();

  const handleClick = (e: any) => {
    setCurrent(e.key);
    history.push(e.key);
  };
  return (
    <HeaderWrapper>
      <div className="logo">
        <img src={zaoLogoImg} width="50" />
        <i />
      </div>
      <Menu
        className="menu"
        onClick={handleClick}
        selectedKeys={[current]}
        mode="horizontal"
      >
        <Item key="/summary">概览</Item>
        <Item key="/report">报表</Item>
        <Item key="/finance">财务</Item>
        {/* media */}
        <Item key="/flow">流量</Item>
        <Item key="/buried">埋点</Item>
        <Item key="/access">接入</Item>
        {/* advertiser */}
        <Item key="/ads">投放</Item>
      </Menu>
      <div className="user-info">
        <UserInfo />
      </div>
    </HeaderWrapper>
  );
};

export default PageHeader;
