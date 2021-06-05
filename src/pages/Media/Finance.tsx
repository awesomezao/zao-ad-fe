import { BoxWrapper } from "@/styles/wrapper";
import { useState, useEffect } from "react";
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
  Statistic,
  Space,
} from "antd";
import { useUser } from "@/hooks/useUser";
import PageHeader from "@/components/PageHeader";
import {
  withdraw,
  getWithdrawList,
  IWithdraw,
  getMediaFinanceInfo,
  IMediaFinance,
} from "@/apis/user";
import { useMount, useRequest } from "ahooks";
import AppStatus from "@/components/AppStatus";
import { useCurrent } from "@/hooks/useCurrentPath";

const Finance = () => {
  const { user } = useUser();
  const [data, setData] = useState<IWithdraw[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [mediaFinance, setMediaFinance] = useState<IMediaFinance>({
    _id: "",
    user_id: "",
    earnings: 0,
    today_earnings: 0,
    today_date_string: "",
  });
  const { redirect } = useCurrent();

  const getWithdrawListR = useRequest(getWithdrawList, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      setData(res);
    },
  });

  const getFinanceInfoR = useRequest(getMediaFinanceInfo, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      form.setFieldsValue({
        earnings: res.earnings,
      });
      setMediaFinance(res);
    },
  });

  const withdrawR = useRequest(withdraw, {
    manual: true,
    onSuccess: (res) => {
      message.success("提交订单成功,请等待管理员审核");
      getWithdrawListR.run();
      setShowModal(false);
    },
  });

  useMount(() => {
    getWithdrawListR.run();
    getFinanceInfoR.run();
    // getFinanceInfo.run();
  });

  const handleSubmit = async () => {
    const res = await form.validateFields();
    withdrawR.run(res.amount);
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
                  <span>收益（元）</span>
                  {/* <a onClick={() => redirect("/finance")}>去提现</a> */}
                </Space>
              }
              precision={2}
              value={mediaFinance.earnings}
            />
            <Statistic
              title="今日收益（元）"
              precision={4}
              value={mediaFinance.today_earnings}
            />
          </div>
        </BoxWrapper>
      </Col>
      <Col span={18}>
        <BoxWrapper>
          <PageHeader title="提现" />
          <Modal
            title="提现"
            visible={showModal}
            onOk={handleSubmit}
            onCancel={() => setShowModal(false)}
          >
            <Form form={form}>
              <Form.Item name="earnings" label="可提现数额">
                {/* <Input style={{ width: 200 }} disabled suffix="元" /> */}
                <InputNumber style={{ width: 200 }} disabled precision={4} />
              </Form.Item>
              <Form.Item
                name="amount"
                label="提现数额"
                rules={[{ required: true, message: "请输入提现数额" }]}
              >
                <InputNumber
                  style={{ width: 200 }}
                  placeholder="请输入提现数额"
                  max={mediaFinance.earnings}
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
            提现
          </Button>
          <Table columns={columns} dataSource={data} />
        </BoxWrapper>
      </Col>
    </Row>
  );
};

export default Finance;
