import { useState, useEffect } from "react";
import { Button, Menu, Space, Table, Tag } from "antd";
import { getAppList, IApp } from "@/apis/app";
import { useRequest } from "ahooks";
import { useHistory } from "react-router-dom";
import { BoxWrapper } from "@/styles/wrapper";
import { ColumnsType } from "antd/lib/table";
import { getNameFromIndustryCode } from "@/utils";
import styled from "@emotion/styled";
import { APP_STATUS } from "@/constants";

const { Item, SubMenu } = Menu;

const AppHomeWrapper = styled.div`
  .btn {
    margin-top: 20px;
    padding: 9px 0px;
  }
  .btn-text {
    color: #999;
    margin-left: 15px;
    font-size: 12px;
    display: inline-block;
  }
`;

const AppHome = () => {
  const [current, setCurrent] = useState("/flow");
  const [data, setData] = useState<IApp[]>([]);
  const history = useHistory();

  const getAppListR = useRequest(getAppList, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      setData(res.map((i) => ({ ...i, key: i._id })));
    },
  });

  useEffect(() => {
    setCurrent(history.location.pathname);
    getAppListR.run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: "应用ID",
      dataIndex: "_id",
      key: "_id",
      // render: (text: any) => text,
    },
    {
      title: "应用名称",
      dataIndex: "app_name",
      key: "app_name",
      // render: (text: any) => text,
    },
    {
      title: "行业",
      dataIndex: "industry",
      key: "industry",
      render: (text: any) => getNameFromIndustryCode(text),
    },
    {
      title: "应用状态",
      dataIndex: "app_status",
      key: "app_status",
      render: (text: any) => (
        <>
          {text === "under_review" ? (
            <Tag color="warning">{(APP_STATUS as any)[text]}</Tag>
          ) : null}
          {text === "running" ? (
            <Tag color="success">{(APP_STATUS as any)[text]}</Tag>
          ) : null}
          {text === "no_pass" ? (
            <Tag color="error">{(APP_STATUS as any)[text]}</Tag>
          ) : null}
          {text === "stop" ? (
            <Tag color="default">{(APP_STATUS as any)[text]}</Tag>
          ) : null}
        </>
      ),
    },
    {
      title: "操作",
      key: "action",
      render: (text: any, record: any) => (
        <Space>
          <a>查看广告位</a>
          <a>编辑</a>
          <a>创建广告位</a>
          <a>数据</a>
        </Space>
      ),
    },
  ];
  const handleClick = (e: any) => {
    setCurrent(e.key);
    history.push(e.key);
  };
  return (
    <AppHomeWrapper style={{ display: "flex" }}>
      <Menu
        className="menu"
        onClick={handleClick}
        selectedKeys={[current]}
        mode="inline"
        style={{ width: "256px", height: "calc(100vh - 51px)" }}
        defaultOpenKeys={["/flow"]}
        defaultSelectedKeys={[current]}
      >
        <SubMenu key="/flow" title="流量">
          <Item key="/flow/apps">应用</Item>
          <Item key="/flow/codes">广告位</Item>
        </SubMenu>
      </Menu>
      <BoxWrapper
        width="100%"
        height="600px"
        notCenter
        css={{ margin: "30px" }}
      >
        <h2 className="bold">应用</h2>
        <div className="btn">
          <Button
            type="primary"
            onClick={() => history.push("/flow/apps/create")}
          >
            +新建应用
          </Button>
          <div className="btn-text">运行的应用不可多于50个</div>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          loading={getAppListR.loading}
        />
      </BoxWrapper>
    </AppHomeWrapper>
  );
};

export default AppHome;
