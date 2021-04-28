import {
  Button,
  Steps,
  Form,
  Menu,
  Select,
  Spin,
  TreeSelect,
  Input,
  Modal,
  message,
} from "antd";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { BoxWrapper } from "@/styles/wrapper";
import styled from "@emotion/styled";
import { useMount, useRequest } from "ahooks";
import AdCards from "@/components/AdCards";
import useUrlState from "@ahooksjs/use-url-state";
import { getAppList, IApp, getAppInfo } from "@/apis/app";
import { createCode, updateCode, getCodeInfo } from "@/apis/code";
import { INDUSTRY } from "@/constants";
import FooterBtnGroup from "@/components/FooterBtnGroup";

const { SubMenu, Item } = Menu;
const { Step } = Steps;
const { useForm } = Form;
const { confirm } = Modal;

const CodesWrapper = styled.div``;

const Codes = () => {
  const history = useHistory();
  const { type = "" } = useParams<{ type: "create" | "update" }>();
  const [urlState, setUrlState] = useUrlState({ step: 0, adType: "" });
  const [appList, setAppList] = useState<IApp[]>([]);
  const [form] = useForm();

  const treeData = INDUSTRY.map((i) => {
    return {
      title: i.name,
      value: i.code,
      key: i.code,
      children: i.children.map((j) => ({
        title: j.name,
        value: j.code,
        key: j.code,
      })),
    };
  });

  const urlSearchParams = new URLSearchParams(window.location.search);
  const code_id = urlSearchParams.get("code_id");

  const getAppListR = useRequest(getAppList, {
    manual: true,
    onSuccess: (res) => {
      setAppList(res);
    },
  });

  const createCodeR = useRequest(createCode, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      message.success("创建成功");
      showConfirm(res._id);
    },
  });

  const updateCodeR = useRequest(updateCode, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      message.success("更新成功");
      code_id && getCodeInfoR.run(code_id);
      showConfirm();
    },
  });

  const getAppInfoR = useRequest(getAppInfo, {
    manual: true,
    onSuccess: (res) => {
      form.setFieldsValue({ app_name: res.app_name });
    },
  });

  const getCodeInfoR = useRequest(getCodeInfo, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      getAppInfoR.run(res.app_id);
      form.setFieldsValue({
        shield: res.shield,
        code_name: res.code_name,
      });
    },
  });

  const showConfirm = (code_id?: string) => {
    confirm({
      title: type === "create" ? "创建成功" : "修改成功",
      icon: <ExclamationCircleOutlined color="green" />,
      content: "你可以选择返回主页,或者修改配置",
      okText: type === "create" ? "去修改" : "继续修改",
      cancelText: "返回主页",
      onOk() {
        if (type === "create") {
          history.push(`/flow/codes/update?code_id=${code_id}&step=1`);
        }
      },
      onCancel() {
        history.push("/flow/codes");
      },
    });
  };

  const handleClickCodeCard = (type: string) => {
    setUrlState({ step: 1, adType: type });
  };

  const handleSubmit = async () => {
    const res = await form.validateFields();
    const { shield } = res;
    res.shield = JSON.stringify(shield);
    res.code_type = urlState.adType;
    console.log(res);

    if (type === "create") {
      createCodeR.run(res);
    } else {
      res._id = code_id;
      updateCodeR.run(res);
    }
  };

  useMount(() => {
    if (type === "update" && code_id) {
      console.log(code_id);
      getCodeInfoR.run(code_id);
    } else {
      getAppListR.run();
    }
  });
  return (
    <CodesWrapper>
      <BoxWrapper width="1000px">
        <Steps current={Number(urlState.step)}>
          <Step title="选择代码位类型" />
          <Step title={type === "create" ? "创建配置" : "更新配置"} />
        </Steps>
      </BoxWrapper>
      <BoxWrapper width="1000px">
        {Number(urlState.step) === 0 && (
          <AdCards onClick={handleClickCodeCard} />
        )}
        {Number(urlState.step) === 1 && (
          <Spin
            spinning={
              createCodeR.loading ||
              updateCodeR.loading ||
              getAppInfoR.loading ||
              getCodeInfoR.loading
            }
          >
            <div>
              <h2 className="bold">
                {type === "create" ? "创建广告位" : "修改广告位"}
              </h2>
              <Form style={{ width: "400px" }} form={form} layout="vertical">
                {type === "create" ? (
                  <Form.Item
                    label="选择所属应用"
                    name="app_id"
                    rules={[{ required: true, message: "请填写代码位名称" }]}
                  >
                    <Select placeholder="请选择所属应用">
                      {appList.map((i) => (
                        <Select.Option key={i._id} value={i._id}>
                          {i.app_name}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                ) : (
                  <Form.Item label="选择所属应用" name="app_name">
                    <Input disabled />
                  </Form.Item>
                )}
                <Form.Item name="shield" label="屏蔽行业">
                  <TreeSelect
                    treeData={treeData}
                    placeholder="请选择屏蔽行业"
                    allowClear
                    treeCheckable
                  />
                </Form.Item>
                <Form.Item
                  name="code_name"
                  label="代码位名称"
                  rules={[{ required: true, message: "请填写代码位名称" }]}
                >
                  <Input placeholder="请填写代码位名称" />
                </Form.Item>
              </Form>
            </div>
          </Spin>
        )}
      </BoxWrapper>
      {Number(urlState.step) === 1 && (
        <FooterBtnGroup
          width="1000px"
          onConfirm={handleSubmit}
          onCancel={() => history.push("/flow/apps")}
          loading={
            createCodeR.loading ||
            updateCodeR.loading ||
            getAppInfoR.loading ||
            getCodeInfoR.loading
          }
        />
      )}
    </CodesWrapper>
  );
};

export default Codes;
