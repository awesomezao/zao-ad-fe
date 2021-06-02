import { BoxWrapper } from "@/styles/wrapper";
import { Row, Col, message, Spin } from "antd";
import FooterBtnGroup from "@/components/ReviewFooterBtnGroup";
import { useHistory } from "react-router-dom";
import { useRequest, useMount } from "ahooks";
import { createApp, getAppInfo, updateApp } from "@/apis/app";
import {
  getIndustryCascaderOptions,
  getIndustryTreeSelectData,
  getIndustryArray,
} from "@/utils";
import { reviewApp } from "@/apis/admin";
import useForm, { IFormItem } from "@/hooks/useForm";
import useConfirm from "@/hooks/useConfirm";
import useUrlSearchParams from "@/hooks/useUrlSearchParams";
import PageHeader from "@/components/PageHeader";
import { useCurrent } from "@/hooks/useCurrentPath";

const AppInfo = () => {
  const history = useHistory();
  const { form, Form, renderFormItem } = useForm();
  const app_id = useUrlSearchParams("app_id");
  const { redirect } = useCurrent();

  const { showConfirm } = useConfirm({
    title: "审核",
    content: "确定审核意见吗",
    okText: "确定",
    cancelText: "取消",
    onOk: (props) => {
      const { app_id, status } = props;
      reviewR.run(app_id, status);
    },
  });

  const reviewR = useRequest(reviewApp, {
    manual: true,
    onSuccess: (res) => {
      message.success("审核成功");
      redirect("/admin/app");
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
    if (app_id) {
      getAppInfoR.run(app_id);
    }
  });

  const formConfig: IFormItem<any>[] = [
    {
      name: "app_attr",
      type: "Radio",
      label: "应用属性",
      extra: "在完成签署合同前，只能创建【测试】应用",
      disabled: true,
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
      disabled: true,
      config: {
        data: getIndustryCascaderOptions(),
      },
    },
    {
      name: "shield",
      type: "TreeSelect",
      label: "屏蔽管理",
      disabled: true,
      config: {
        data: getIndustryTreeSelectData(),
      },
    },
    {
      name: "app_name",
      type: "Input",
      label: "应用名称",
      disabled: true,
      requiredMessage: "请输入应用名称",
      placeholder: "请输入应用名称",
    },
  ];

  return (
    <Spin spinning={getAppInfoR.loading}>
      <Row justify="center">
        <Col span={16}>
          <BoxWrapper>
            <PageHeader title="应用信息" showBack />
            <Col span={15}>
              <Form>{formConfig.map((i) => renderFormItem(i))}</Form>
            </Col>
          </BoxWrapper>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={16}>
          <FooterBtnGroup
            onPass={() => {
              showConfirm({ app_id, status: "running" });
            }}
            onReject={() => {
              showConfirm({ app_id, status: "no_pass" });
            }}
            onCancel={() => history.push("/admin/app")}
            loading={reviewR.loading || getAppInfoR.loading}
          />
        </Col>
      </Row>
    </Spin>
  );
};

export default AppInfo;
