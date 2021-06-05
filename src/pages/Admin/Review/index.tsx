import useSideMenu from "@/hooks/useSideMenu";
import { Row, Col } from "antd";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import App from "./App";
import Code from "./Code";
import Ads from "./Ads";
import Recharge from "./Recharge";
import Withdraw from "./Withdraw";
import { useUser } from "@/hooks/useUser";
import { useMount } from "ahooks";

const Review = () => {
  const { user } = useUser();
  const { sideMenu } = useSideMenu({
    title: "审核",
    prePath: "/admin",
    data: [
      { value: "/admin/app", label: "应用" },
      { value: "/admin/code", label: "广告位" },
      { value: "/admin/ads", label: "广告计划" },
      { value: "/admin/recharge", label: "充值" },
      { value: "/admin/withdraw", label: "提现" },
    ],
  });
  const history = useHistory();
  useMount(() => {
    if (user.role !== "admin") {
      history.push("/");
    }
  });

  return (
    <Row>
      <Col span={3}>{sideMenu}</Col>
      <Col span={19} offset={1}>
        {history.location.pathname === "/admin/app" && <App />}
        {history.location.pathname === "/admin/code" && <Code />}
        {history.location.pathname === "/admin/ads" && <Ads />}
        {history.location.pathname === "/admin/recharge" && <Recharge />}
        {history.location.pathname === "/admin/withdraw" && <Withdraw />}
      </Col>
    </Row>
  );
};

export default Review;
