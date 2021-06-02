import { getReviewAdsList, IReviewAdsData, reviewAds } from "@/apis/admin";
import { Row, Col, Table, Space, message, Spin } from "antd";
import { BoxWrapper } from "@/styles/wrapper";
import AdsStatus from "@/components/AppStatus";
import { useState } from "react";
import { useMount, useRequest } from "ahooks";
import useConfirm from "@/hooks/useConfirm";
import { getCodeType } from "@/utils";
import { useHistory } from "react-router-dom";

const Ads = () => {
  const [data, setData] = useState<IReviewAdsData[]>([]);
  const history = useHistory();
  const { showConfirm } = useConfirm({
    title: "审核",
    content: "确定审核意见吗",
    okText: "确定",
    cancelText: "取消",
    onOk: (props) => {
      const { ads_id, status } = props;
      reviewR.run(ads_id, status);
    },
  });

  const getDataR = useRequest(getReviewAdsList, {
    manual: true,
    onSuccess: (res) => setData(res),
  });

  const reviewR = useRequest(reviewAds, {
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
      title: "广告计划id",
      dataIndex: "_id",
      key: "_id",
    },
    {
      title: "广告主名称",
      dataIndex: "user_name",
      key: "user_name",
    },
    {
      title: "广告计划名称",
      dataIndex: "ads_name",
      key: "ads_name",
    },
    {
      title: "广告位类型",
      dataIndex: "code_type",
      key: "code_type",
      render: (text: any) => getCodeType(text),
    },
    {
      title: "支付方式",
      dataIndex: "pay_method",
      key: "pay_method",
    },
    {
      title: "支付数额",
      dataIndex: "payments",
      key: "payments",
    },
    {
      title: "投放数量",
      dataIndex: "ads_amount",
      key: "ads_amount",
    },
    {
      title: "投放状态",
      dataIndex: "status",
      key: "status",
      render: (text: any) => <AdsStatus status={text} />,
    },
    {
      title: "操作",
      key: "action",
      render: (record: any) => (
        <Space>
          <a
            onClick={() => {
              history.push(`/admin/ads/info?ads_id=${record._id}`);
            }}
          >
            查看详情
          </a>
          <a
            onClick={() => {
              showConfirm({ ads_id: record.ads_id, status: "running" });
            }}
          >
            通过
          </a>
          <a
            onClick={() => {
              showConfirm({ ads_id: record.ads_id, status: "no_pass" });
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

export default Ads;
