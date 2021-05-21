import { useState } from "react";
import { Space, Table, Row, Col } from "antd";
import { getAppList, IApp } from "@/apis/app";
import { useRequest, useMount } from "ahooks";
import { useHistory } from "react-router-dom";
import { BoxWrapper } from "@/styles/wrapper";
import { getNameFromIndustryCode } from "@/utils";
import AppStatus from "@/components/AppStatus";
import useSideMenu from "@/hooks/useSideMenu";
import ConfigOperation from "@/components/ConfigOperation";
import PageHeader from "@/components/PageHeader";

const Home = () => {
  const history = useHistory();
  const [data, setData] = useState<IApp[]>([]);
  const { sideMenu } = useSideMenu({
    title: "流量",
    prePath: "/flow",
    data: [
      { value: "/flow/app", label: "应用" },
      { value: "/flow/code", label: "广告位" },
    ],
  });

  const getAppListR = useRequest(getAppList, {
    manual: true,
    onSuccess: (res) => {
      setData(res.map((i) => ({ ...i, key: i._id })));
    },
  });

  useMount(() => {
    getAppListR.run();
  });

  const columns = [
    {
      title: "应用ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "应用名称",
      dataIndex: "app_name",
      key: "app_name",
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
      render: (text: any) => <AppStatus status={text} />,
    },
    {
      title: "操作",
      key: "action",
      render: (record: any) => (
        <Space>
          <a>查看广告位</a>
          <a
            onClick={() =>
              history.push(`/flow/app/update?app_id=${record._id}`)
            }
          >
            编辑
          </a>
          <a>创建广告位</a>
          <a>数据</a>
        </Space>
      ),
    },
  ];

  return (
    <Row>
      <Col span={3}>{sideMenu}</Col>
      <Col span={19} offset={1}>
        <BoxWrapper>
          <PageHeader title="应用" />
          <ConfigOperation
            text="+ 新建应用"
            extra="运行的应用不可多于50个"
            onClick={() => history.push("/flow/app/create")}
          />
          <Table
            columns={columns}
            dataSource={data}
            loading={getAppListR.loading}
          />
        </BoxWrapper>
      </Col>
    </Row>
  );
};

export default Home;
