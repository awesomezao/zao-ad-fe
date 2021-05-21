import { Steps, Row, Col, Spin, message } from "antd";
import { useHistory } from "react-router-dom";
import { BoxWrapper } from "@/styles/wrapper";
import { useMount, useRequest } from "ahooks";
import {  updateCode, getCodeInfo } from "@/apis/code";
import FooterBtnGroup from "@/components/FooterBtnGroup";
import useConfirm from "@/hooks/useConfirm";
import useForm, { IFormItem } from "@/hooks/useForm";
import useUrlSearchParams from "@/hooks/useUrlSearchParams";
import PageHeader from "@/components/PageHeader";
import { getIndustryTreeSelectData, getCodeType } from "@/utils";

const { Step } = Steps;

const Update = () => {
  const history = useHistory();
  const { form, Form, renderFormItem } = useForm();
  const { showConfirm } = useConfirm({
    title: "修改成功",
    content: "你可以选择返回主页,或者继续修改配置",
    okText: "继续修改",
    onCancel: () => history.push("/flow/code"),
  });
  const code_id = useUrlSearchParams("code_id");

  const getCodeInfoR = useRequest(getCodeInfo, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      form.setFieldsValue({
        code_type: getCodeType(res.code_type),
        app_id: res.app.app_name,
        shield: res.shield,
        code_name: res.code_name,
      });
    },
  });

  const updateCodeR = useRequest(updateCode, {
    manual: true,
    onSuccess: (res) => {
      message.success("更新成功");
      code_id && getCodeInfoR.run(code_id);
      showConfirm();
    },
  });

  useMount(() => {
    if (code_id) {
      getCodeInfoR.run(code_id);
    }
  });

  const handleSubmit = async () => {
    const res = await form.validateFields();
    const { shield } = res;
    res.shield = JSON.stringify(shield);
    res._id = code_id;
    delete res.app_id;
    console.log(res);
    updateCodeR.run(res);
  };

  const formConfig: IFormItem<any>[] = [
    {
      name: "code_type",
      type: "Input",
      label: "广告位类型",
      disabled: true,
    },
    {
      name: "app_id",
      type: "Input",
      label: "所属应用",
      disabled: true,
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
      name: "code_name",
      type: "Input",
      label: "广告位名称",
      requiredMessage: "请输入广告位名称",
      placeholder: "请输入广告位名称",
    },
  ];

  return (
    <>
      <Row justify="center">
        <Col span={16}>
          <BoxWrapper margin="30px 0 0 0">
            <Steps current={1}>
              <Step title="选择广告位类型" />
              <Step title={"修改配置"} />
            </Steps>
          </BoxWrapper>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={16}>
          <BoxWrapper>
            <Spin spinning={updateCodeR.loading || getCodeInfoR.loading}>
              <PageHeader title="修改广告位" />
              <Col span={15}>
                <Form>{formConfig.map((i) => renderFormItem(i))}</Form>
              </Col>
            </Spin>
          </BoxWrapper>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={16}>
          <FooterBtnGroup
            onConfirm={handleSubmit}
            onCancel={() => history.push("/flow/code")}
            loading={updateCodeR.loading || getCodeInfoR.loading}
          />
        </Col>
      </Row>
    </>
  );
};

export default Update;
