import { BoxWrapper } from "@/styles/wrapper";
import { useState } from "react";
import {
  Button,
  Table,
  Col,
  Row,
  Modal,
  Input,
  Form,
  InputNumber,
  message,
  Statistic, Space
} from "antd";
import { useUser } from "@/hooks/useUser";
import PageHeader from "@/components/PageHeader";
import { recharge, getRechargeList, ICharge } from "@/apis/user";
import { useMount, useRequest } from "ahooks";
import AppStatus from "@/components/AppStatus";
import { getAdvertiserFinanceInfo, IAdvertiserFinance } from "@/apis/user";
import { useCurrent } from '@/hooks/useCurrentPath';

const Finance = () => {
  const [data, setData] = useState<ICharge[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const {redirect} =useCurrent();
  const { user } = useUser();

  const [advertiserFinance, setAdvertiserFinance] =
    useState<IAdvertiserFinance>({
      _id: "",
      user_id: "",
      balance: 0,
      today_cost: 0,
      today_date_string: "",
    });

  const getRechargeListR = useRequest(getRechargeList, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      setData(res);
    },
  });

  const getAdvertiserFinanceR = useRequest(getAdvertiserFinanceInfo, {
    manual: true,
    onSuccess: (res) => {
      setAdvertiserFinance(res);
    },
  });

  const rechargeR = useRequest(recharge, {
    manual: true,
    onSuccess: (res) => {
      message.success("提交订单成功,请等待管理员审核");
      getRechargeListR.run();
      setShowModal(false);
    },
  });

  useMount(() => {
    getAdvertiserFinanceR.run();
    getRechargeListR.run();
  });

  const handleSubmit = async () => {
    const res = await form.validateFields();
    rechargeR.run(res.amount);
  };

  const columns = [
    {
      title: "日期",
      dataIndex: "date_string",
      key: "date_string",
      // render: (text:any) => <a>{text}</a>,
    },
    {
      title: "订单号",
      dataIndex: "_id",
      key: "_id",
      // render: (text:any) => <a>{text}</a>,
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (text: any) => <AppStatus status={text} />,
    },
    {
      title: "数额",
      dataIndex: "amount",
      key: "amount",
      // render: (text:any) => <a>{text}</a>,
    },
  ];
  return (
    <Row justify="center">
      <Col span={18}>
        <BoxWrapper margin="30px 0 0 0">
          <h2 style={{ fontSize: 20, marginBottom: 20 }}>hi, {user.name}</h2>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Statistic
              title={
                <Space>
                  <span>余额（元）</span>
                  {/* <a onClick={() => redirect("/finance")}>去充值</a> */}
                </Space>
              }
              precision={2}
              value={advertiserFinance.balance}
            />
            <Statistic
              title="今日广告花费（元）"
              precision={4}
              value={advertiserFinance.today_cost}
            />
          </div>
        </BoxWrapper>
      </Col>
      <Col span={18}>
        <BoxWrapper>
          <PageHeader title="充值" />
          <Modal
            title="充值"
            visible={showModal}
            onOk={handleSubmit}
            onCancel={() => setShowModal(false)}
          >
            <Form form={form}>
              <Form.Item
                name="amount"
                rules={[{ required: true, message: "请输入充值数额" }]}
              >
                <InputNumber
                  style={{ width: 200 }}
                  placeholder="请输入充值数额"
                />
              </Form.Item>
            </Form>
          </Modal>
          <Button
            type="primary"
            onClick={() => {
              setShowModal(true);
            }}
          >
            充值
          </Button>
          <Table columns={columns} dataSource={data} />
        </BoxWrapper>
      </Col>
    </Row>
  );
};

export default Finance;
