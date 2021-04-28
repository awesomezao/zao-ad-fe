import { Popover } from "antd";
import { useHistory } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userState } from "@/globalState/user";
import styled from "@emotion/styled";
import { css } from "@emotion/css";
import { getImgUrl } from "@/utils";

const UserInfoWrapper = styled.div`
  display: flex;
  cursor: pointer;
  width: 200px;
  border-radius: 10px;
  transition: background 0.3s, width 0.3s;
  padding: 2px 5px;
  &:hover {
    background-color: #f2f4f7;
  }
  img {
    border-radius: 50%;
  }
  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-left: 15px;
    .name {
      font-weight: bold;
    }
    .role {
      color: gray;
    }
  }
`;

const ContentWrapper = styled.div`
  width: 300px;
  .header {
    /* background-color: #f0f0f0; */
    display: flex;
    padding: 10px;
    align-items: center;
    img {
      border-radius: 50%;
    }
    .info {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      margin-left: 15px;
      .name {
        font-weight: bold;
      }
      .role {
        color: gray;
      }
    }
  }
  .content {
    background-color: #ffffff;
    border-top: 1px solid #e6e8ed;
    padding: 10px;
  }
  .operation {
    border-top: 1px solid #e6e8ed;
    display: flex;
    justify-content: space-between;
    & > div {
      height: 50px;
      line-height: 50px;
      width: 50%;
      text-align: center;
      cursor: pointer;
      &:hover {
        background-color: #f0f0f0;
      }
    }
    i {
      width: 1px;
      background-color: #e6e8ed;
      margin: 10px 0;
    }
  }
`;

const popoverCss = css`
  .ant-popover-inner-content {
    padding: 0;
  }
  .ant-popover-inner {
    border-radius: 10px;
  }
  .ant-popover-content {
    border-radius: 10px;
  }
`;

const roleMap: any = {
  advertiser: "广告主",
  media: "媒体",
  admin: "管理员",
};

const UserInfo = () => {
  const [user] = useRecoilState(userState);
  const history = useHistory();

  const content = (
    <ContentWrapper>
      <div className="header">
        <img src={getImgUrl(user.avatar)} width="70px" height="70px" />
        <div className="info">
          <div className="name">{user.name}</div>
          <div className="role">{roleMap[user.role]}</div>
        </div>
      </div>
      <div className="content">
        <div>账号: {user.username}</div>
        <div>ID: {user._id}</div>
      </div>
      <div className="operation">
        <div onClick={() => history.push("/account")}>账户中心</div>
        <i />
        <div onClick={() => history.push("/login")}>退出</div>
      </div>
    </ContentWrapper>
  );
  return (
    <Popover
      content={content}
      placement="bottomRight"
      overlayClassName={popoverCss}
    >
      <UserInfoWrapper>
        <img src={getImgUrl(user.avatar)} width="45px" height="45px" />
        <div className="info">
          <div className="name">{user.name}</div>
          <div className="role">{roleMap[user.role]}</div>
        </div>
      </UserInfoWrapper>
    </Popover>
  );
};

export default UserInfo;
