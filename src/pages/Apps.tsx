import { BoxWrapper } from "@/styles/wrapper";
import {
  Form,
  Radio,
  Cascader,
  TreeSelect,
  Input,
  Button,
  message,
  Spin,
  Modal,
} from "antd";
import { INDUSTRY } from "@/constants";
import FooterBtnGroup from "@/components/FooterBtnGroup";
import { useParams, useHistory } from "react-router-dom";
import { useRequest, useMount } from "ahooks";
import { useState } from "react";
import { createApp, getAppInfo, updateApp } from "@/apis/app";
import { getIndustryArray } from "@/utils";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { Item, useForm } = Form;
const { confirm } = Modal;

const Apps = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const { type = "" } = useParams<{ type: "create" | "update" }>();
  const urlSearchParams = new URLSearchParams(window.location.search);
  const app_id = urlSearchParams.get("app_id");
  const industry = INDUSTRY.map((i) => {
    return {
      value: i.code,
      label: i.name,
      children: i.children.map((j) => ({ value: j.code, label: j.name })),
    };
  });
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

  const showConfirm = (app_id?: string) => {
    confirm({
      title: type === "create" ? "创建成功" : "修改成功",
      icon: <ExclamationCircleOutlined color="green" />,
      content: "你可以选择返回主页,或者修改配置",
      okText: type === "create" ? "去修改" : "继续修改",
      cancelText: "返回主页",
      onOk() {
        if (type === "create") {
          history.push(`/flow/apps/update?app_id=${app_id}`);
        }
      },
      onCancel() {
        history.push("/flow/apps");
      },
    });
  };

  const createAppR = useRequest(createApp, {
    manual: true,
    onSuccess: (res) => {
      message.success("创建成功");
      showConfirm(res._id);
    },
  });

  const updateAppR = useRequest(updateApp, {
    manual: true,
    onSuccess: (res) => {
      message.success("更新成功");
      app_id && getAppInfoR.run(app_id);
      showConfirm();
    },
  });

  const getAppInfoR = useRequest(getAppInfo, {
    manual: true,
    onSuccess: (res) => {
      form.setFieldsValue({
        industry: getIndustryArray(res.industry),
        shield: res.shield,
        app_name: res.app_name,
      });
    },
  });

  useMount(() => {
    if (type === "update" && app_id) {
      getAppInfoR.run(app_id);
    }
  });

  const handleSubmit = async () => {
    const res = await form.validateFields();
    const { industry, shield } = res;
    res.industry = industry[1];
    res.shield = JSON.stringify(shield);
    console.log(res);

    if (type === "create") {
      createAppR.run(res);
    } else {
      res.app_id = app_id;
      updateAppR.run(res);
    }
  };

  return (
    <Spin spinning={getAppInfoR.loading || updateAppR.loading}>
      <BoxWrapper>
        <h2 style={{ fontWeight: "bold" }}>完善应用信息</h2>
        <Form style={{ width: "400px" }} form={form} layout="vertical">
          <Item label="应用属性" extra="在完成签署合同前，只能创建【测试】应用">
            <Radio.Group value="test">
              <Radio.Button value="official" disabled>
                正式
              </Radio.Button>
              <Radio.Button value="test">测试</Radio.Button>
            </Radio.Group>
          </Item>
          <Item
            label="行业"
            name="industry"
            extra="请尽量填写和应用商店一致的行业"
            rules={[{ required: true, message: "请选择行业" }]}
          >
            <Cascader options={industry} placeholder="请选择行业" allowClear />
          </Item>
          <Item label="屏蔽管理" name="shield">
            <TreeSelect
              treeData={treeData}
              placeholder="请选择屏蔽行业"
              allowClear
              treeCheckable
            />
          </Item>
          <Item
            label="应用名称"
            name="app_name"
            rules={[{ required: true, message: "请输入应用名称" }]}
          >
            <Input placeholder="请输入应用名称" />
          </Item>
        </Form>
      </BoxWrapper>
      <FooterBtnGroup
        onConfirm={handleSubmit}
        onCancel={()=>history.push('/flow/apps')}
        loading={
          createAppR.loading || updateAppR.loading || getAppInfoR.loading
        }
      />
    </Spin>
  );
};

export default Apps;
