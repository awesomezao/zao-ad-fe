import { getReviewAppList, IReviewAppData, reviewApp } from "@/apis/admin";
import { Row, Col, Table, Space, message, Spin } from "antd";
import { BoxWrapper } from "@/styles/wrapper";
import AppStatus from "@/components/AppStatus";
import { getNameFromIndustryCode } from "@/utils";
import { useState } from "react";
import { useMount, useRequest } from "ahooks";
import useConfirm from "@/hooks/useConfirm";
import { useHistory } from "react-router-dom";

const App = () => {
  const [data, setData] = useState<IReviewAppData[]>([]);

  const { showConfirm } = useConfirm({
    title: "审核",
    content: "确定审核意见吗",
    okText: "确定",
    cancelText: "取消",
    onOk: (props) => {
      const { app_id, status } = props;
      reviewR.run(app_id, status);
    },
  });
  const history = useHistory();

  const getDataR = useRequest(getReviewAppList, {
    manual: true,
    onSuccess: (res) => setData(res),
  });

  const reviewR = useRequest(reviewApp, {
    manual: true,
    onSuccess: (res) => {
      message.success("审核成功");
      getDataR.run();
    },
  });

  useMount(() => {
    getDataR.run();
  });

  const columns = [
    {
      title: "应用ID",
      dataIndex: "app_id",
      key: "app_id",
    },
    {
      title: "应用名称",
      dataIndex: "app_name",
      key: "app_name",
    },
    {
      title: "媒体名称",
      dataIndex: "user_name",
      key: "user_name",
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
          <a
            onClick={() =>
              history.push(`/admin/app/info?app_id=${record.app_id}`)
            }
          >
            查看详情
          </a>
          <a
            onClick={() => {
              showConfirm({ app_id: record.app_id, status: "running" });
            }}
          >
            通过
          </a>
          <a
            onClick={() => {
              showConfirm({ app_id: record.app_id, status: "no_pass" });
            }}
          >
            不通过
          </a>
        </Space>
      ),
    },
  ];
  return (
    <Spin spinning={getDataR.loading || reviewR.loading}>
      <BoxWrapper>
        <Table columns={columns} dataSource={data} />
      </BoxWrapper>
    </Spin>
  );
};

export default App;
