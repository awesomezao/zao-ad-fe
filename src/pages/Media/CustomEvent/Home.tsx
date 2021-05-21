import { useState, useEffect } from "react";
import {
  Button,
  Menu,
  Space,
  Table,
  Tag,
  Form,
  Select,
  Row,
  Col,
  Spin,
} from "antd";
import { getCustomBuriedList, IBuried } from "@/apis/buried";
import { useRequest } from "ahooks";
import { useHistory } from "react-router-dom";
import { BoxWrapper } from "@/styles/wrapper";
import { getAppList, IApp, getAppInfo } from "@/apis/app";
import useSideMenu from "@/hooks/useSideMenu";
import ConfigOperation from "@/components/ConfigOperation";
import PageHeader from "@/components/PageHeader";

const Home = () => {
  const [data, setData] = useState<IBuried[]>([]);
  const [appList, setAppList] = useState<IApp[]>([]);
  const history = useHistory();
  const { sideMenu } = useSideMenu({
    title: "埋点",
    prePath: "/event",
    data: [
      { value: "/event/manage", label: "管理" },
      { value: "/event/report", label: "报表" },
    ],
  });
  const [form] = Form.useForm();

  const getBuriedListR = useRequest(getCustomBuriedList, {
    manual: true,
    onSuccess: (res) => {
      setData(res.map((i) => ({ ...i, key: i._id })));
    },
  });

  const getAppListR = useRequest(getAppList, {
    manual: true,
    onSuccess: (res) => {
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
      render: (record: any) => (
        <Space>
          <a>接入</a>
          <a
            onClick={() =>
              history.push(
                `/event/manage/update?app_id=${record.app_id}&buried_id=${record._id}`
              )
            }
          >
            编辑
          </a>
          <a>数据</a>
        </Space>
      ),
    },
  ];

  return (
    <Row>
      <Col span={3}>{sideMenu}</Col>
      <Col span={19} offset={1}>
        <BoxWrapper height="600px">
          <PageHeader title="埋点" />
          <Row>
            <Col span={8}>
              <Form form={form}>
                <Form.Item label="选择应用" name="app_id">
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

          <ConfigOperation
            text="+ 新建埋点"
            onClick={() => history.push("/event/manage/create")}
          />

          <Table
            columns={columns}
            dataSource={data}
            loading={getAppListR.loading || getBuriedListR.loading}
          />
        </BoxWrapper>
      </Col>
    </Row>
  );
};

export default Home;
