import { BoxWrapper } from "@/styles/wrapper";
import { Button, Table } from "antd";
import { useUser } from "@/hooks/useUser";

const Finance = () => {
  const { user } = useUser();

  const columns = [
    {
      title: "日期",
      dataIndex: "name",
      key: "name",
      // render: (text:any) => <a>{text}</a>,
    },
    {
      title: "订单号",
      dataIndex: "name",
      key: "name",
      // render: (text:any) => <a>{text}</a>,
    },
    {
      title: "状态",
      dataIndex: "name",
      key: "name",
      // render: (text:any) => <a>{text}</a>,
    },
    {
      title: user.role === "media" ? "收入" : "数额",
      dataIndex: "name",
      key: "name",
      // render: (text:any) => <a>{text}</a>,
    },
  ];
  return (
    <BoxWrapper width="80%">
      <h2>结算单</h2>
      <Button type="primary">{user.role === "media" ? "提现" : "充值"}</Button>
      <Table columns={columns} dataSource={[]} />
    </BoxWrapper>
  );
};

export default Finance;
