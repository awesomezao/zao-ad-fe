import { useState } from "react";
import { Space, Table, Row, Col, message } from "antd";
import { useRequest, useMount } from "ahooks";
import { useHistory } from "react-router-dom";
import { BoxWrapper } from "@/styles/wrapper";
import ConfigOperation from "@/components/ConfigOperation";
import PageHeader from "@/components/PageHeader";
import { getAdsList, IAds, changeAdsStatus,deleteAds } from "@/apis/ads";
import { getCodeType } from "@/utils";
import { useCurrent } from "@/hooks/useCurrentPath";
import AdsStatus from "@/components/AppStatus";
import useStopConfirm from "@/hooks/useStopConfirm";
import useDeleteConfirm from "@/hooks/useDeleteConfirm";

const Home = () => {
  const history = useHistory();
  const [data, setData] = useState<IAds[]>([]);
  const { redirect } = useCurrent();

  const getAdsListR = useRequest(getAdsList, {
    manual: true,
    onSuccess: (res) => {
      setData(res);
    },
  });

  const changeAdsStatusR = useRequest(changeAdsStatus, {
    manual: true,
    onSuccess: (res) => {
      message.success("操作成功");
      getAdsListR.run();
    },
  });
  const { showConfirm } = useStopConfirm({
    onOk: (ads_id) => changeAdsStatusR.run(ads_id, "stop"),
  });

  const deleteAdsR = useRequest(deleteAds, {
    manual: true,
    onSuccess: (res) => {
      message.success("删除成功");
      getAdsListR.run();
    },
  });
  const { showDeleteConfirm } = useDeleteConfirm({
    onOk: (ads_id) => deleteAdsR.run(ads_id),
  });

  useMount(() => {
    getAdsListR.run();
  });

  const columns = [
    {
      title: "投放ID",
      dataIndex: "_id",
      key: "_id",
      // render: (text: any) => text,
    },
    {
      title: "投放名称",
      dataIndex: "ads_name",
      key: "ads_name",
      // render: (text: any) => text,
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
      // render: (text: any) => text,
    },
    {
      title: "支付数额",
      dataIndex: "payments",
      key: "payments",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (text: any) => <AdsStatus status={text} />,
    },
    {
      title: "操作",
      key: "action",
      render: (text: any, record: any) => (
        <Space>
          <a onClick={() => history.push(`/ads/update?ads_id=${text._id}`)}>
            编辑
          </a>
          <a
            onClick={() => {
              if (record.status !== "stop") {
                showConfirm(record._id);
              } else {
                changeAdsStatusR.run(record._id, "under_review");
              }
            }}
          >
            {record.status === "stop" ? "启用" : "停用"}
          </a>
          <a
            onClick={() => showDeleteConfirm(record._id)}
            style={{ color: "#f16363" }}
          >
            删除
          </a>
          <a onClick={() => redirect("/report/advertiser")}>数据</a>
        </Space>
      ),
    },
  ];

  return (
    <Row>
      <Col span={22} offset={1}>
        <BoxWrapper>
          <PageHeader title="投放" />
          <ConfigOperation
            text="+ 新建投放"
            onClick={() => history.push("/ads/create")}
          />
          <Table
            columns={columns}
            dataSource={data}
            loading={getAdsListR.loading}
          />
        </BoxWrapper>
      </Col>
    </Row>
  );
};

export default Home;
