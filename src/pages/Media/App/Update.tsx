import { BoxWrapper } from "@/styles/wrapper";
import { Row, Col, message, Spin } from "antd";
import FooterBtnGroup from "@/components/FooterBtnGroup";
import { useHistory } from "react-router-dom";
import { useRequest, useMount } from "ahooks";
import { createApp, getAppInfo, updateApp } from "@/apis/app";
import {
  getIndustryCascaderOptions,
  getIndustryTreeSelectData,
  getIndustryArray,
} from "@/utils";
import useForm, { IFormItem } from "@/hooks/useForm";
import useConfirm from "@/hooks/useConfirm";
import useUrlSearchParams from "@/hooks/useUrlSearchParams";
import PageHeader from "@/components/PageHeader";

const Update = () => {
  const history = useHistory();
  const { form, Form, renderFormItem } = useForm();
  const { showConfirm } = useConfirm({
    title: "修改成功",
    content: "你可以选择返回主页,或者继续修改配置",
    okText: "继续修改",
    onCancel: () => history.push("/flow/app"),
  });
  const app_id = useUrlSearchParams("app_id");

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

  const updateAppR = useRequest(updateApp, {
    manual: true,
    onSuccess: (res) => {
      message.success("更新成功");
      app_id && getAppInfoR.run(app_id);
      showConfirm();
    },
  });

  useMount(() => {
    if (app_id) {
      getAppInfoR.run(app_id);
    }
  });

  const handleSubmit = async () => {
    if (app_id) {
      const res = await form.validateFields();
      const { industry, shield } = res;
      res.industry = industry[1];
      res.shield = JSON.stringify(shield);
      res.app_id = app_id;
      delete res.app_attr;
      updateAppR.run(res);
    }
  };

  const formConfig: IFormItem<any>[] = [
    {
      name: "app_attr",
      type: "Radio",
      label: "应用属性",
      extra: "在完成签署合同前，只能创建【测试】应用",
      config: {
        data: [
          { value: "test", label: "测试" },
          { value: "official", label: "正式", disabled: true },
        ],
      },
    },
    {
      name: "industry",
      type: "Cascader",
      label: "行业",
      extra: "请尽量填写和应用商店一致的行业",
      requiredMessage: "请选择行业",
      placeholder: "请选择行业",
      config: {
        data: getIndustryCascaderOptions(),
      },
    },
    {
      name: "shield",
      type: "TreeSelect",
      label: "屏蔽管理",
      config: {
        data: getIndustryTreeSelectData(),
      },
    },
    {
      name: "app_name",
      type: "Input",
      label: "应用名称",
      requiredMessage: "请输入应用名称",
      placeholder: "请输入应用名称",
    },
  ];

  return (
    <Spin spinning={updateAppR.loading || getAppInfoR.loading}>
      <Row justify="center">
        <Col span={16}>
          <BoxWrapper>
            <PageHeader title="完善应用信息" showBack />
            <Col span={15}>
              <Form>{formConfig.map((i) => renderFormItem(i))}</Form>
            </Col>
          </BoxWrapper>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={16}>
          <FooterBtnGroup
            onConfirm={handleSubmit}
            onCancel={() => history.push("/flow/app")}
            loading={updateAppR.loading}
          />
        </Col>
      </Row>
    </Spin>
  );
};

export default Update;
