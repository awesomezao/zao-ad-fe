import { useState, useEffect } from "react";
import { Button, Menu, Space, Table, Tag, Form, Select, Row, Col } from "antd";
import { getCustomBuriedList, IBuried } from "@/apis/buried";
import { useRequest } from "ahooks";
import { useHistory } from "react-router-dom";
import { BoxWrapper } from "@/styles/wrapper";
import { getNameFromIndustryCode } from "@/utils";
import styled from "@emotion/styled";
import { APP_STATUS } from "@/constants";
import { getAppList, IApp, getAppInfo } from "@/apis/app";

const { Item, SubMenu } = Menu;

const BuriedHomeWrapper = styled.div`
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

const BuriedHome = () => {
  const [current, setCurrent] = useState("/buried");
  const [data, setData] = useState<IBuried[]>([]);
  const [appList, setAppList] = useState<IApp[]>([]);
  const history = useHistory();
  const [form] = Form.useForm();

  const getBuriedListR = useRequest(getCustomBuriedList, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      setData(res.map((i) => ({ ...i, key: i._id })));
    },
  });

  const getAppListR = useRequest(getAppList, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      if (res.length > 0) {
        form.setFieldsValue({
          app_id: res[0]._id,
        });
        getBuriedListR.run(res[0]._id);
        setAppList(res);
      }
    },
  });

  const handleAppChange = (e: any) => {
    getBuriedListR.run(e);
  };

  useEffect(() => {
    setCurrent(history.location.pathname);
    getAppListR.run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: "自定义埋点ID",
      dataIndex: "_id",
      key: "_id",
      // render: (text: any) => text,
    },
    {
      title: "自定义埋点",
      dataIndex: "event",
      key: "event",
      // render: (text: any) => text,
    },
    {
      title: "应用ID",
      dataIndex: "app_id",
      key: "app_id",
    },
    {
      title: "操作",
      key: "action",
      render: (text: any, record: any) => (
        <Space>
          <a>接入</a>
          <a
            onClick={() =>
              history.push(`/buried/manage/update?buried_id=${record._id}`)
            }
          >
            编辑
          </a>
          <a
            onClick={() =>
              history.push(
                `/buried/manage/update?app_id=${record.app_id}&buried_id=${record._id}`
              )
            }
          >
            数据
          </a>
        </Space>
      ),
    },
  ];
  const handleClick = (e: any) => {
    setCurrent(e.key);
    history.push(e.key);
  };
  return (
    <BuriedHomeWrapper style={{ display: "flex" }}>
      <Menu
        className="menu"
        onClick={handleClick}
        selectedKeys={[current]}
        mode="inline"
        style={{ width: "256px", height: "calc(100vh - 51px)" }}
        defaultOpenKeys={["/buried"]}
        defaultSelectedKeys={[current]}
      >
        <SubMenu key="/buried" title="埋点">
          <Item key="/buried/manage">管理</Item>
          <Item key="/buried/report">报表</Item>
        </SubMenu>
      </Menu>
      <BoxWrapper
        width="100%"
        height="600px"
        notCenter
        css={{ margin: "30px" }}
      >
        <h2 className="bold">应用</h2>
        <Row>
          <Col span={8}>
            <Form form={form}>
              <Form.Item
                label="选择应用"
                name="app_id"
                style={{ marginTop: "10px" }}
              >
                <Select onChange={handleAppChange}>
                  {appList.map((i) => (
                    <Select.Option key={i._id} value={i._id}>
                      {i.app_name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Form>
          </Col>
        </Row>

        <div className="btn">
          <Button
            type="primary"
            onClick={() => history.push("/buried/manage/create")}
          >
            +新建埋点
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          loading={getBuriedListR.loading}
        />
      </BoxWrapper>
    </BuriedHomeWrapper>
  );
};

export default BuriedHome;
