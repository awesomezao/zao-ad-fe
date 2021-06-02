import { Steps, Row, Col, Spin, message, DatePicker } from "antd";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { BoxWrapper } from "@/styles/wrapper";
import { useMount, useRequest } from "ahooks";
import { updateCode, getCodeInfo } from "@/apis/code";
import FooterBtnGroup from "@/components/ReviewFooterBtnGroup";
import useConfirm from "@/hooks/useConfirm";
import useForm, { IFormItem } from "@/hooks/useForm";
import useUrlSearchParams from "@/hooks/useUrlSearchParams";
import PageHeader from "@/components/PageHeader";
import { getIndustryTreeSelectData, getCodeType } from "@/utils";
import moment from "moment";
import { useCurrent } from "@/hooks/useCurrentPath";
import { reviewCode } from "@/apis/admin";

const { Step } = Steps;

const CodeInfo = () => {
  const history = useHistory();
  const { form, Form, renderFormItem } = useForm();
  const [isSplash, setIsSplash] = useState(false);
  const { redirect } = useCurrent();
  const { showConfirm } = useConfirm({
    title: "审核",
    content: "确定审核意见吗",
    okText: "确定",
    cancelText: "取消",
    onOk: (props) => {
      const { code_id, status } = props;
      reviewR.run(code_id, status);
    },
  });
  const code_id = useUrlSearchParams("code_id");

  const reviewR = useRequest(reviewCode, {
    manual: true,
    onSuccess: (res) => {
      message.success("审核成功");
      redirect("/admin/code");
    },
  });

  const getCodeInfoR = useRequest(getCodeInfo, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      if (res.code_type === "splash") {
        setIsSplash(true);
        const _ads_date = res.date ? res.date : [0, 0];
        const dateArr = [moment(_ads_date[0]), moment(_ads_date[1])];
        form.setFieldsValue({
          price: res.price,
          date: dateArr,
        });
      }
      form.setFieldsValue({
        code_type: getCodeType(res.code_type),
        app_id: res.app.app_name,
        shield: res.shield,
        code_name: res.code_name,
      });
    },
  });

  useMount(() => {
    if (code_id) {
      getCodeInfoR.run(code_id);
    }
  });

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
    {
      name: "price",
      type: "Input",
      label: "售价",
      disabled: true,
      requiredMessage: "请输入广告位售价",
      placeholder: "请输入广告位售价",
    },
    {
      name: "date",
      type: "Custom",
      label: "出售时间",
      requiredMessage: "出售时间",
      placeholder: "出售时间",
      customComponent: <DatePicker.RangePicker disabled format="YYYY-MM-DD" />,
    },
  ];

  return (
    <>
      <Row justify="center">
      </Row>
      <Row justify="center">
        <Col span={16}>
          <BoxWrapper>
            <Spin spinning={getCodeInfoR.loading}>
              <PageHeader title="广告位信息" showBack />
              <Col span={15}>
                <Form>
                  {formConfig.slice(0, 4).map((i) => renderFormItem(i))}
                  {isSplash
                    ? formConfig.slice(4, 6).map((i) => renderFormItem(i))
                    : null}
                </Form>
              </Col>
            </Spin>
          </BoxWrapper>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={16}>
          <FooterBtnGroup
            onPass={() => {
              showConfirm({ code_id, status: "running" });
            }}
            onReject={() => {
              showConfirm({ code_id, status: "no_pass" });
            }}
            onCancel={() => history.push("/admin/code")}
            loading={getCodeInfoR.loading || reviewR.loading}
          />
        </Col>
      </Row>
    </>
  );
};

export default CodeInfo;
