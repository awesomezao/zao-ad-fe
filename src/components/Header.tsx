import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Menu } from "antd";
import zaoLogoImg from "@/assets/images/zao_logo.png";
import styled from "@emotion/styled";
import UserInfo from "./UserInfo";
import { useRecoilState } from "recoil";
import { userState } from "@/globalState/user";

const { Item, SubMenu } = Menu;

const HeaderWrapper = styled.div`
  display: flex;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  .logo {
    float: left;
    margin-left: 20px;
    img {
      cursor: pointer;
    }
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
    margin-right: 20px;
  }
`;

const PageHeader = () => {
  const [current, setCurrent] = useState("/summary");
  const history = useHistory();
  const [user] = useRecoilState(userState);

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
        <Item key="/">概览</Item>
        {user.role === "advertiser" && (
          <Item key="/report/advertiser">报表</Item>
        )}
        {user.role === "media" && <Item key="/report/media">报表</Item>}

        <Item key="/finance">财务</Item>
        {/* media */}
        {user.role === "media" && (
          <SubMenu key="/flow" title="流量">
            <Item key="/flow/app">应用</Item>
            <Item key="/flow/code">广告位</Item>
          </SubMenu>
        )}

        {user.role === "media" && (
          <SubMenu key="/event" title="埋点">
            <Item key="/event/manage">管理</Item>
            <Item key="/event/report">报表</Item>
          </SubMenu>
        )}
        {user.role === "media" && <Item key="/access">接入</Item>}
        {/* advertiser */}
        {user.role === "advertiser" && <Item key="/ads">投放</Item>}
      </Menu>
      <div className="user-info">
        <UserInfo />
      </div>
    </HeaderWrapper>
  );
};

export default PageHeader;
