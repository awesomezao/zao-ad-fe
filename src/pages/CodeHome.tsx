import { useState, useEffect } from "react";
import { Button, Menu, Space, Table, Tag } from "antd";
import { getCodeList, ICode } from "@/apis/code";
import { useRequest } from "ahooks";
import { useHistory } from "react-router-dom";
import { BoxWrapper } from "@/styles/wrapper";
import { getNameFromIndustryCode } from "@/utils";
import styled from "@emotion/styled";
import { APP_STATUS, CODE_TYPE } from "@/constants";

const { Item, SubMenu } = Menu;

const CodeHomeWrapper = styled.div`
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

const CodeHome = () => {
  const [current, setCurrent] = useState("/flow");
  const [data, setData] = useState<any[]>([]);
  const history = useHistory();

  const getCodeListR = useRequest(getCodeList, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      setData(
        res.map((i) => ({
          ...i,
          key: i._id,
          app_name: i.app.app_name,
          industry: i.app.industry,
        }))
      );
    },
  });

  useEffect(() => {
    setCurrent(history.location.pathname);
    getCodeListR.run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: "代码位ID",
      dataIndex: "_id",
      key: "_id",
      // render: (text: any) => text,
    },
    {
      title: "代码位名称",
      dataIndex: "code_name",
      key: "code_name",
      // render: (text: any) => text,
    },
    {
      title: "代码位类型",
      dataIndex: "code_type",
      key: "code_type",
      render: (text: any) => (CODE_TYPE as any)[text],
    },
    {
      title: "所属应用",
      dataIndex: "app_name",
      key: "app_name",
      // render: (text: any) => text,
    },
    {
      title: "应用ID",
      dataIndex: "app_id",
      key: "app_id",
      // render: (text: any) => text,
    },
    {
      title: "行业",
      dataIndex: "industry",
      key: "industry",
      render: (text: any) => getNameFromIndustryCode(text),
    },
    {
      title: "代码位状态",
      dataIndex: "code_status",
      key: "code_status",
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
          <a
            onClick={() =>
              history.push(`/flow/codes/update?code_id=${record._id}&step=1`)
            }
          >
            编辑
          </a>
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
    <CodeHomeWrapper style={{ display: "flex" }}>
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
          <Item key="/flow/codes">代码位</Item>
        </SubMenu>
      </Menu>
      <BoxWrapper
        width="100%"
        height="600px"
        notCenter
        css={{ margin: "30px" }}
      >
        <h2 className="bold">代码位</h2>
        <div className="btn">
          <Button
            type="primary"
            onClick={() => history.push("/flow/codes/create")}
          >
            +新建代码位
          </Button>
          <div className="btn-text">运行的代码位不可多于50个</div>
        </div>

        <Table columns={columns} dataSource={data} />
      </BoxWrapper>
    </CodeHomeWrapper>
  );
};

export default CodeHome;
