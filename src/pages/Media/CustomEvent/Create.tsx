import { BoxWrapper } from "@/styles/wrapper";
import { message, Spin, Row, Col } from "antd";
import FooterBtnGroup from "@/components/FooterBtnGroup";
import { useHistory } from "react-router-dom";
import { useRequest, useMount } from "ahooks";
import { useState } from "react";
import { createCustomBuried } from "@/apis/buried";
import { getAppList, IApp, getAppInfo } from "@/apis/app";
import useForm, { IFormItem } from "@/hooks/useForm";
import useConfirm from "@/hooks/useConfirm";
import PageHeader from "@/components/PageHeader";

const Create = () => {
  const history = useHistory();
  const { form, Form, renderFormItem } = useForm();
  const [appList, setAppList] = useState<IApp[]>([]);
  const { showConfirm } = useConfirm({
    title: "创建成功",
    content: "你可以选择返回主页,或者修改配置",
    okText: "去修改",
    onOk: (buried_id) =>
      history.push(`/event/manage/update?buried_id=${buried_id}`),
    onCancel: () => history.push("/event/manage"),
  });

  const createBuriedR = useRequest(createCustomBuried, {
    manual: true,
    onSuccess: (res) => {
      message.success("创建成功");
      showConfirm(res._id);
    },
  });

  const getAppListR = useRequest(getAppList, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      form.setFieldsValue({
        app_id: res[0]._id,
      });
      setAppList(res);
    },
  });

  useMount(() => {
    getAppListR.run();
  });

  const handleSubmit = async () => {
    const res = await form.validateFields();
    createBuriedR.run(res);
  };

  const formConfig: IFormItem<any>[] = [
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
      name: "event",
      type: "Input",
      label: "埋点名称",
      requiredMessage: "请输入自定义埋点名称",
      placeholder: "请输入自定义埋点名称",
    },
    {
      name: "desc",
      type: "Input",
      label: "描述",
      placeholder: "请输入描述",
    },
  ];

  return (
    <Spin spinning={createBuriedR.loading || getAppListR.loading}>
      <Row justify="center">
        <Col span={16}>
          <BoxWrapper>
            <PageHeader title="完善自定义埋点信息" />
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
            onCancel={() => history.push("/event/manage")}
            loading={createBuriedR.loading || getAppListR.loading}
          />
        </Col>
      </Row>
    </Spin>
  );
};

export default Create;
