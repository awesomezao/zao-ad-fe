import { useState } from "react";
import { Space, Table, Row, Col, message } from "antd";
import {
  getCodeList,
  ICode,
  getFilterCodeList,
  changeCodeStatus,
  deleteCode,
} from "@/apis/code";
import { useRequest, useMount } from "ahooks";
import { useHistory } from "react-router-dom";
import { BoxWrapper } from "@/styles/wrapper";
import { getNameFromIndustryCode, getCodeType } from "@/utils";
import AppStatus from "@/components/AppStatus";
import useSideMenu from "@/hooks/useSideMenu";
import ConfigOperation from "@/components/ConfigOperation";
import PageHeader from "@/components/PageHeader";
import AppPicker from "@/components/AppPicker";
import { useCurrent } from "@/hooks/useCurrentPath";
import CodeModal from "@/components/CodeModal";
import AccessCode from "../Doc/AccessCode.md";
import { IApp } from "@/apis/app";
import useStopConfirm from "@/hooks/useStopConfirm";
import useDeleteConfirm from "@/hooks/useDeleteConfirm";

const Home = () => {
  const history = useHistory();
  const [data, setData] = useState<ICode[]>([]);
  const [appList, setAppList] = useState<IApp[]>([]);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const { sideMenu } = useSideMenu({
    title: "流量",
    prePath: "/flow",
    data: [
      { value: "/flow/app", label: "应用" },
      { value: "/flow/code", label: "广告位" },
    ],
  });
  const getAccessCode = (code_id: string, code_type: string) => {
    if (code_type === "splash") {
      return `
~~~typescript
  // 获取开屏广告
  const splashAdInfo = getSplashAd('${code_id}');

  <Splash splashCodeId={'${code_id}'} run={showAd} />
~~~
      `;
    } else {
      return `
~~~typescript
  //  发送点击事件
  sendClickEvent(ads_id,'${code_id}');
  //  发送曝光事件
  sendShowEvent(ads_id,'${code_id}');

  const adInfo = getAd('${code_type}','${code_id}');
~~~
      `;
    }
  };
  const [doc, setDoc] = useState("");
  const { redirect } = useCurrent();
  const getCodeFilterListR = useRequest(getFilterCodeList, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      setData(
        res.map((i) => ({
          ...i,
          key: i._id,
          app_name: i.app.app_name,
          industry: i.app.industry,
        }))
      );
    },
  });
  const changeCodeStatusR = useRequest(changeCodeStatus, {
    manual: true,
    onSuccess: (res) => {
      message.success("操作成功");
      if (appList.length) {
        getCodeFilterListR.run(appList[0]._id);
      }
    },
  });
  const { showConfirm } = useStopConfirm({
    onOk: (props) => {
      if (props.code_type !== "splash") {
        changeCodeStatusR.run(props.code_id, "stop");
      } else {
        message.warning("签订的开屏广告合约无法中途删除");
      }
    },
  });

  const deleteCodeR = useRequest(deleteCode, {
    manual: true,
    onSuccess: (res) => {
      message.success("删除成功");
      if (appList.length) {
        getCodeFilterListR.run(appList[0]._id);
      }
    },
  });
  const { showDeleteConfirm } = useDeleteConfirm({
    onOk: (props) => deleteCodeR.run(props.code_id),
  });

  const columns = [
    {
      title: "广告位ID",
      dataIndex: "_id",
      key: "_id",
      // render: (text: any) => text,
    },
    {
      title: "广告位名称",
      dataIndex: "code_name",
      key: "code_name",
      // render: (text: any) => text,
    },
    {
      title: "广告位类型",
      dataIndex: "code_type",
      key: "code_type",
      render: (text: any) => getCodeType(text),
    },
    {
      title: "所属应用",
      dataIndex: "app_name",
      key: "app_name",
      // render: (text: any) => text,
    },
    {
      title: "应用ID",
      dataIndex: "app_id",
      key: "app_id",
      // render: (text: any) => text,
    },
    {
      title: "行业",
      dataIndex: "industry",
      key: "industry",
      render: (text: any) => getNameFromIndustryCode(text),
    },
    {
      title: "广告位状态",
      dataIndex: "code_status",
      key: "code_status",
      render: (text: any) => <AppStatus status={text} />,
    },
    {
      title: "操作",
      key: "action",
      render: (record: any) => (
        <Space>
          <a
            onClick={() =>
              history.push(`/flow/code/update?code_id=${record._id}`)
            }
          >
            编辑
          </a>
          <a onClick={() => redirect(`/report/media`)}>数据</a>
          <a
            onClick={() => {
              if (record.code_status !== "stop") {
                showConfirm(record._id);
              } else {
                changeCodeStatusR.run(record._id, "under_review");
              }
            }}
          >
            {record.code_status === "stop" ? "启用" : "停用"}
          </a>
          <a
            onClick={() =>
              showDeleteConfirm({
                code_id: record._id,
                code_type: record.code_type,
              })
            }
            style={{ color: "#f16363" }}
          >
            删除
          </a>
          <a
            onClick={() => {
              setShowCodeModal(true);
              setDoc(getAccessCode(record._id, record.code_type));
            }}
          >
            接入
          </a>
        </Space>
      ),
    },
  ];

  return (
    <Row>
      <Col span={3}>{sideMenu}</Col>
      <Col span={19} offset={1}>
        <BoxWrapper>
          <PageHeader title="广告位" />
          <CodeModal
            show={showCodeModal}
            doc={doc}
            onCancel={() => setShowCodeModal(false)}
          />
          <Col span={10}>
            <AppPicker
              onRequestSuccess={(appList) => {
                if (appList.length) {
                  setAppList(appList);
                  getCodeFilterListR.run(appList[0]._id);
                }
              }}
              onAppChange={(app_id) => {
                getCodeFilterListR.run(app_id);
              }}
            />
          </Col>

          <ConfigOperation
            text="+ 新建广告位"
            extra="运行的广告位不可多于50个"
            onClick={() => history.push("/flow/code/create")}
          />
          <Table
            columns={columns}
            dataSource={data}
            loading={getCodeFilterListR.loading}
          />
        </BoxWrapper>
      </Col>
    </Row>
  );
};

export default Home;
