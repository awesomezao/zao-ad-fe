import { BoxWrapper } from "@/styles/wrapper";
import { Row, Col, message, Spin } from "antd";
import FooterBtnGroup from "@/components/FooterBtnGroup";
import { useHistory } from "react-router-dom";
import { useRequest, useMount } from "ahooks";
import { createApp, getAppInfo, updateApp } from "@/apis/app";
import { getIndustryCascaderOptions, getIndustryTreeSelectData } from "@/utils";
import useForm, { IFormItem } from "@/hooks/useForm";
import useConfirm from "@/hooks/useConfirm";
import PageHeader from "@/components/PageHeader";

const Create = () => {
  const history = useHistory();
  const { form, Form, renderFormItem } = useForm();
  const { showConfirm } = useConfirm({
    title: "创建成功",
    content: "你可以选择返回主页,或者修改配置",
    okText: "去修改",
    onOk: (app_id) => history.push(`/flow/app/update?app_id=${app_id}`),
    onCancel: () => history.push("/flow/app"),
  });

  const createAppR = useRequest(createApp, {
    manual: true,
    onSuccess: (res) => {
      message.success("创建成功");
      showConfirm(res._id);
    },
  });

  const handleSubmit = async () => {
    const res = await form.validateFields();
    const { industry, shield } = res;
    res.industry = industry[1];
    res.shield = JSON.stringify(shield);
    createAppR.run(res);
  };

  const formConfig: IFormItem<any>[] = [
    {
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
      placeholder: "请选择需要屏蔽的行业",
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
    <Spin spinning={createAppR.loading}>
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
            loading={createAppR.loading}
          />
        </Col>
      </Row>
    </Spin>
  );
};

export default Create;
