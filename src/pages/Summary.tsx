import { BoxWrapper } from "@/styles/wrapper";
import { Row, Col, Statistic, Space } from "antd";
import { useUser } from "@/hooks/useUser";
import { useHistory } from "react-router-dom";

const Summary = () => {
  const { user } = useUser();
  const history = useHistory();

  return (
    <div>
      {user.role === "advertiser" && (
        <>
          <BoxWrapper width="80%">
            <h2 style={{ fontSize: 20, marginBottom: 20 }}>hi, {user.name}</h2>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Statistic
                title={
                  <Space>
                    <span>余额（元）</span>
                    <a onClick={() => history.push("/finance")}>去充值</a>
                  </Space>
                }
                value={5000}
              />
              <Statistic title="今日广告花费（元）" value={0} />
              <Statistic title="账户日预算（元）" value={100} />
            </div>
          </BoxWrapper>
          <BoxWrapper width="80%">
            <h2 style={{ fontSize: 20, marginBottom: 20 }}>广告统计</h2>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Statistic title="投放中" value={2} />
              <Statistic title="审核中" value={0} />
              <Statistic title="未通过" value={0} />
            </div>
          </BoxWrapper>
        </>
      )}

      {user.role === "media" && (
        <>
          <BoxWrapper width="80%">
            <h2 style={{ fontSize: 20, marginBottom: 20 }}>hi, {user.name}</h2>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Statistic
                title={
                  <Space>
                    <span>余额（元）</span>
                    <a onClick={() => history.push("/finance")}>去提现</a>
                  </Space>
                }
                value={100}
              />
              <Statistic title="今日收益" value={0} />
              <Statistic title="预计收益" value={10} />
            </div>
          </BoxWrapper>
          <BoxWrapper width="80%">
            <h2 style={{ fontSize: 20, marginBottom: 20 }}>广告统计</h2>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Statistic title="运行中" value={2} />
              <Statistic title="审核中" value={0} />
              <Statistic title="未通过" value={0} />
            </div>
          </BoxWrapper>
        </>
      )}
    </div>
  );
};

export default Summary;
