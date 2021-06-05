import { useState } from "react";
import { Space, Table, Row, Col, message } from "antd";
import { getAppList, IApp, changeAppStatus, deleteApp } from "@/apis/app";
import { useRequest, useMount } from "ahooks";
import { useHistory } from "react-router-dom";
import { BoxWrapper } from "@/styles/wrapper";
import { getNameFromIndustryCode } from "@/utils";
import AppStatus from "@/components/AppStatus";
import useSideMenu from "@/hooks/useSideMenu";
import ConfigOperation from "@/components/ConfigOperation";
import PageHeader from "@/components/PageHeader";
import { useCurrent } from "@/hooks/useCurrentPath";
import useStopConfirm from "@/hooks/useStopConfirm";
import useDeleteConfirm from "@/hooks/useDeleteConfirm";

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
  const { redirect } = useCurrent();

  const getAppListR = useRequest(getAppList, {
    manual: true,
    onSuccess: (res) => {
      setData(res.map((i) => ({ ...i, key: i._id })));
    },
  });

  const changeAppStatusR = useRequest(changeAppStatus, {
    manual: true,
    onSuccess: (res) => {
      message.success("操作成功");
      getAppListR.run();
    },
  });
  const { showConfirm } = useStopConfirm({
    onOk: (app_id) => changeAppStatusR.run(app_id, "stop"),
  });

  const deleteAppR = useRequest(deleteApp, {
    manual: true,
    onSuccess: (res) => {
      message.success("删除成功");
      getAppListR.run();
    },
  });
  const { showDeleteConfirm } = useDeleteConfirm({
    onOk: (app_id) => deleteAppR.run(app_id),
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
          <a onClick={() => history.push(`/flow/code`)}>查看广告位</a>
          <a
            onClick={() =>
              history.push(`/flow/app/update?app_id=${record._id}`)
            }
          >
            编辑
          </a>
          <a
            onClick={() => {
              if (record.app_status !== "stop") {
                showConfirm(record._id);
              } else {
                changeAppStatusR.run(record._id, "under_review");
              }
            }}
          >
            {record.app_status === "stop" ? "启用" : "停用"}
          </a>
          <a
            onClick={() => showDeleteConfirm(record._id)}
            style={{ color: "#f16363" }}
          >
            删除
          </a>
          <a onClick={() => history.push(`/flow/code/create`)}>创建广告位</a>
          <a onClick={() => redirect(`/report/media`)}>数据</a>
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
