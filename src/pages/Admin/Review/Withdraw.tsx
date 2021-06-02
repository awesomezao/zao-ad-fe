import {
  getReviewWithdrawList,
  IReviewWithdrawData,
  reviewWithdraw,
} from "@/apis/admin";
import { Row, Col, Table, Space, message, Spin } from "antd";
import { BoxWrapper } from "@/styles/wrapper";
import WithdrawStatus from "@/components/AppStatus";
import { getNameFromIndustryCode } from "@/utils";
import { useState } from "react";
import { useMount, useRequest } from "ahooks";
import useConfirm from "@/hooks/useConfirm";

const Withdraw = () => {
  const [data, setData] = useState<IReviewWithdrawData[]>([]);
  const [status, setStatus] = useState(1);

  const { showConfirm } = useConfirm({
    title: "审核",
    content: status === 1 ? "确定通过审核吗" : "确定不通过审核吗",
    okText: "确定",
    cancelText: "取消",
    onOk: (props) => {
      const { user_id, order_id, status } = props;
      reviewR.run(user_id, order_id, status);
    },
  });

  const getDataR = useRequest(getReviewWithdrawList, {
    manual: true,
    onSuccess: (res) => setData(res),
  });

  const reviewR = useRequest(reviewWithdraw, {
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
      title: "订单ID",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "用户ID",
      dataIndex: "user_id",
      key: "user_id",
    },
    {
      title: "用户名称",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "提现数额",
      dataIndex: "amount",
      key: "amount",
    },
    {
      title: "申请日期",
      dataIndex: "date_string",
      key: "date_string",
    },
    {
      title: "申请状态",
      dataIndex: "status",
      key: "status",
      render: (text: any) => <WithdrawStatus status={text} />,
    },
    {
      title: "操作",
      key: "action",
      render: (record: any) => (
        <Space>
          <a
            onClick={() => {
              setStatus(1);
              showConfirm({
                user_id: record.user_id,
                order_id: record.order_id,
                status: "pass",
              });
            }}
          >
            通过
          </a>
          <a
            onClick={() => {
              setStatus(0);
              showConfirm({
                user_id: record.user_id,
                order_id: record.order_id,
                status: "no_pass",
              });
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

export default Withdraw;
