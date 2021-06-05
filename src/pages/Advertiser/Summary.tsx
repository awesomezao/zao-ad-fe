import { useState } from "react";
import { BoxWrapper } from "@/styles/wrapper";
import { Row, Col, Statistic, Space } from "antd";
import { useUser } from "@/hooks/useUser";
import { useHistory } from "react-router-dom";
import { useRequest, useMount } from "ahooks";
import { getAdsSummary, ISummary } from "@/apis/ads";
import { getAdvertiserFinanceInfo, IAdvertiserFinance } from "@/apis/user";
import { useCurrent } from '@/hooks/useCurrentPath';

const Summary = () => {
  const { user } = useUser();
  const history = useHistory();
  const {redirect} =useCurrent();
  const [summaryData, setSummaryData] = useState<ISummary>({
    running: 0,
    under_review: 0,
    no_pass: 0,
  });
  const [advertiserFinance, setAdvertiserFinance] =
    useState<IAdvertiserFinance>({
      _id: "",
      user_id: "",
      balance: 0,
      today_cost: 0,
      today_date_string: "",
    });

  const getAdsSummaryR = useRequest(getAdsSummary, {
    manual: true,
    onSuccess: (res) => {
      setSummaryData(res);
    },
  });

  const getAdvertiserFinanceR = useRequest(getAdvertiserFinanceInfo, {
    manual: true,
    onSuccess: (res) => {
      setAdvertiserFinance(res);
    },
  });

  useMount(() => {
    getAdsSummaryR.run();
    getAdvertiserFinanceR.run();
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
                  <span>余额（元）</span>
                  <a onClick={() => redirect("/finance")}>去充值</a>
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
          <h2 style={{ fontSize: 20, marginBottom: 20 }}>广告统计</h2>
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
