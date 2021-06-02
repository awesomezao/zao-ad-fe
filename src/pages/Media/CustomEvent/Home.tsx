import { useState, useEffect } from "react";
import { Space, Table, Form, Select, Row, Col } from "antd";
import { getCustomBuriedList, IBuried } from "@/apis/buried";
import { useRequest } from "ahooks";
import { useHistory } from "react-router-dom";
import { BoxWrapper } from "@/styles/wrapper";
import useSideMenu from "@/hooks/useSideMenu";
import ConfigOperation from "@/components/ConfigOperation";
import PageHeader from "@/components/PageHeader";
import AppPicker from "@/components/AppPicker";
import { useCurrent } from "@/hooks/useCurrentPath";

const Home = () => {
  const [data, setData] = useState<IBuried[]>([]);
  const history = useHistory();
  const { sideMenu } = useSideMenu({
    title: "埋点",
    prePath: "/event",
    data: [
      { value: "/event/manage", label: "管理" },
      { value: "/event/report", label: "报表" },
    ],
  });
  const { redirect } = useCurrent();
  const getBuriedListR = useRequest(getCustomBuriedList, {
    manual: true,
    onSuccess: (res) => {
      setData(res.map((i) => ({ ...i, key: i._id })));
    },
  });

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
          <a onClick={() => redirect(`/event/report`)}>数据</a>
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
              <AppPicker
                onRequestSuccess={(appList) => {
                  getBuriedListR.run(appList[0]._id);
                }}
                onAppChange={(app_id) => {
                  getBuriedListR.run(app_id);
                }}
              />
            </Col>
          </Row>

          <ConfigOperation
            text="+ 新建埋点"
            onClick={() => history.push("/event/manage/create")}
          />

          <Table
            columns={columns}
            dataSource={data}
            loading={getBuriedListR.loading}
          />
        </BoxWrapper>
      </Col>
    </Row>
  );
};

export default Home;
