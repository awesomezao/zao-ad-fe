import { Row, Col } from "antd";
import { useHistory } from "react-router-dom";
import AppInfo from "./AppInfo";
import CodeInfo from "./CodeInfo";
import AdsInfo from "./AdsInfo";

const Review = () => {
  const history = useHistory();

  return (
    <Row justify="center">
      <Col span={18}>
        {history.location.pathname === "/admin/app/info" && <AppInfo />}
        {history.location.pathname === "/admin/code/info" && <CodeInfo />}
        {history.location.pathname === "/admin/ads/info" && <AdsInfo />}
      </Col>
    </Row>
  );
};

export default Review;
