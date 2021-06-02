import { useState } from "react";
import { BoxWrapper } from "@/styles/wrapper";
import { Row, Col, Statistic, Space } from "antd";
import { useUser } from "@/hooks/useUser";
import { useHistory } from "react-router-dom";
import { useRequest, useMount } from "ahooks";
import { ISummary } from "@/apis/ads";
import { getCodeSummary } from "@/apis/code";
import { getMediaFinanceInfo, IMediaFinance } from "@/apis/user";
import { useCurrent } from "@/hooks/useCurrentPath";

const Summary = () => {
  const { user } = useUser();
  const history = useHistory();
  const { redirect } = useCurrent();
  const [summaryData, setSummaryData] = useState<ISummary>({
    running: 0,
    under_review: 0,
    no_pass: 0,
  });
  const [mediaFinance, setMediaFinance] = useState<IMediaFinance>({
    _id: "",
    user_id: "",
    earnings: 0,
    today_earnings: 0,
    today_date_string: "",
  });

  const getCodeSummaryR = useRequest(getCodeSummary, {
    manual: true,
    onSuccess: (res) => {
      setSummaryData(res);
    },
  });

  const getMediaFinanceR = useRequest(getMediaFinanceInfo, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      setMediaFinance(res);
    },
  });

  useMount(() => {
    getCodeSummaryR.run();
    getMediaFinanceR.run();
  });

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
                  <a onClick={() => redirect("/finance")}>去提现</a>
                </Space>
              }
              precision={2}
              value={mediaFinance.earnings}
            />
            <Statistic
              title="今日收益（元）"
              value={mediaFinance.today_earnings}
            />
          </div>
        </BoxWrapper>
      </Col>
      <Col span={18}>
        <BoxWrapper>
          <h2 style={{ fontSize: 20, marginBottom: 20 }}>广告位统计</h2>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Statistic title="投放中" value={summaryData.running} />
            <Statistic title="审核中" value={summaryData.under_review} />
            <Statistic title="未通过" value={summaryData.no_pass} />
          </div>
        </BoxWrapper>
      </Col>
    </Row>
  );
};

export default Summary;
