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

const Finance = () => {
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
    // getFinanceInfo.run();
  });

  useEffect(() => {
    if (showModal) {
      getFinanceInfoR.run();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal]);

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
                <Input style={{ width: 200 }} disabled suffix="元" />
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
