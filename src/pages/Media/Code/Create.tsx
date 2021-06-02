import { Steps, Row, Col, Spin, message, DatePicker } from "antd";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { BoxWrapper } from "@/styles/wrapper";
import { useMount, useRequest } from "ahooks";
import AdCards from "@/components/AdCards";
import useUrlState from "@ahooksjs/use-url-state";
import { getAppList, IApp, getAppInfo } from "@/apis/app";
import { createCode, updateCode, getCodeInfo } from "@/apis/code";
import FooterBtnGroup from "@/components/FooterBtnGroup";
import useConfirm from "@/hooks/useConfirm";
import useForm, { IFormItem } from "@/hooks/useForm";
import PageHeader from "@/components/PageHeader";
import { getIndustryTreeSelectData, getCodeType } from "@/utils";
import moment from "moment";

const { Step } = Steps;

const Create = () => {
  const history = useHistory();
  const { form, Form, renderFormItem } = useForm();
  const [urlState, setUrlState] = useUrlState({ step: 0, adType: "" });
  const [appList, setAppList] = useState<IApp[]>([]);
  const { showConfirm } = useConfirm({
    title: "创建成功",
    content: "你可以选择返回主页,或者修改配置",
    okText: "去修改",
    onOk: (code_id) => history.push(`/flow/app/update?code_id=${code_id}`),
    onCancel: () => history.push("/flow/code"),
  });

  const getAppListR = useRequest(getAppList, {
    manual: true,
    onSuccess: (res) => {
      setAppList(res);
    },
  });

  const createCodeR = useRequest(createCode, {
    manual: true,
    onSuccess: (res) => {
      message.success("创建成功");
      showConfirm(res._id);
    },
  });

  const handleClickCodeCard = (type: string) => {
    setUrlState({ step: 1, adType: type });
  };

  useMount(() => {
    form.setFieldsValue({ code_type: getCodeType(urlState.adType) });
    getAppListR.run();
  });

  const handleSubmit = async () => {
    const res = await form.validateFields();
    const { shield, date, price } = res;
    res.shield = JSON.stringify(shield);
    res.code_type = urlState.adType;
    res.date = JSON.stringify(date);
    res.price = price;
    console.log(res);
    createCodeR.run(res);
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
      type: "Select",
      label: "所属应用",
      requiredMessage: "请选择所属应用",
      placeholder: "请选择所属应用",
      config: {
        data: appList.map((i) => ({ value: i._id, label: i.app_name })),
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
      name: "code_name",
      type: "Input",
      label: "广告位名称",
      requiredMessage: "请输入广告位名称",
      placeholder: "请输入广告位名称",
    },
    {
      name: "price",
      type: "InputNumber",
      label: "售价",
      requiredMessage: "请输入广告位售价",
      placeholder: "请输入广告位售价",
    },
    {
      name: "date",
      type: "Custom",
      label: "选择出售时间",
      requiredMessage: "选择出售时间",
      placeholder: "选择出售时间",
      customComponent: <DatePicker.RangePicker format="YYYY-MM-DD" />,
    },
  ];

  return (
    <>
      <Row justify="center">
        <Col span={16}>
          <BoxWrapper margin="30px 0 0 0">
            <Steps current={Number(urlState.step)}>
              <Step title="选择广告位类型" />
              <Step title={"创建配置"} />
            </Steps>
          </BoxWrapper>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={16}>
          <BoxWrapper>
            {Number(urlState.step) === 0 && (
              <AdCards onClick={handleClickCodeCard} />
            )}
            {Number(urlState.step) === 1 && (
              <Spin spinning={createCodeR.loading || getAppListR.loading}>
                <PageHeader title="创建广告位" />
                <Col span={15}>
                  <Form>
                    {formConfig.slice(0, 4).map((i) => renderFormItem(i))}
                    {urlState.adType === "splash"
                      ? formConfig.slice(4, 6).map((i) => renderFormItem(i))
                      : null}
                  </Form>
                </Col>
              </Spin>
            )}
          </BoxWrapper>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={16}>
          {Number(urlState.step) === 1 && (
            <FooterBtnGroup
              onConfirm={handleSubmit}
              onCancel={() => history.push("/flow/code")}
              loading={createCodeR.loading || getAppListR.loading}
            />
          )}
        </Col>
      </Row>
    </>
  );
};

export default Create;
