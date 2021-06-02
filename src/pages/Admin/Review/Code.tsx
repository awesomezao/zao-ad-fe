import { getReviewCodeList, IReviewCodeData, reviewCode } from "@/apis/admin";
import { Row, Col, Table, Space, message, Spin } from "antd";
import { BoxWrapper } from "@/styles/wrapper";
import CodeStatus from "@/components/AppStatus";
import { getNameFromIndustryCode, getCodeType } from "@/utils";
import { useState } from "react";
import { useMount, useRequest } from "ahooks";
import useConfirm from "@/hooks/useConfirm";
import { useHistory } from "react-router-dom";

const Code = () => {
  const [data, setData] = useState<IReviewCodeData[]>([]);
  const history = useHistory();
  const { showConfirm } = useConfirm({
    title: "审核",
    content: "确定审核意见吗",
    okText: "确定",
    cancelText: "取消",
    onOk: (props) => {
      const { code_id, status } = props;
      reviewR.run(code_id, status);
    },
  });

  const getDataR = useRequest(getReviewCodeList, {
    manual: true,
    onSuccess: (res) => setData(res),
  });

  const reviewR = useRequest(reviewCode, {
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
      title: "广告位id",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "广告位名称",
      dataIndex: "code_name",
      key: "code_name",
    },
    {
      title: "广告位类型",
      dataIndex: "code_type",
      key: "code_type",
      render: (text: any) => getCodeType(text),
    },
    {
      title: "广告位状态",
      dataIndex: "code_status",
      key: "code_status",
      render: (text: any) => <CodeStatus status={text} />,
    },
    {
      title: "操作",
      key: "action",
      render: (record: any) => (
        <Space>
          <a
            onClick={() =>
              history.push(`/admin/code/info?code_id=${record._id}`)
            }
          >
            查看详情
          </a>
          <a
            onClick={() => {
              showConfirm({ code_id: record.code_id, status: "running" });
            }}
          >
            通过
          </a>
          <a
            onClick={() => {
              showConfirm({ code_id: record.code_id, status: "no_pass" });
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

export default Code;
