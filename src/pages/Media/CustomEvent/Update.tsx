import { BoxWrapper } from "@/styles/wrapper";
import { message, Spin, Row, Col } from "antd";
import FooterBtnGroup from "@/components/FooterBtnGroup";
import { useHistory } from "react-router-dom";
import { useRequest, useMount } from "ahooks";
import { updateCustomBuried, getCustomBuriedInfo } from "@/apis/buried";
import useForm, { IFormItem } from "@/hooks/useForm";
import useConfirm from "@/hooks/useConfirm";
import PageHeader from "@/components/PageHeader";
import useUrlSearchParams from "@/hooks/useUrlSearchParams";

const Create = () => {
  const history = useHistory();
  const { form, Form, renderFormItem } = useForm();
  const { showConfirm } = useConfirm({
    title: "修改成功",
    content: "你可以选择返回主页,或者继续修改配置",
    okText: "继续修改",
    onCancel: () => history.push("/event/manage"),
  });
  const buried_id = useUrlSearchParams("buried_id");

  const updateBuriedR = useRequest(updateCustomBuried, {
    manual: true,
    onSuccess: (res) => {
      message.success("更新成功");
      buried_id && getBuriedInfoR.run(buried_id);
      showConfirm();
    },
  });

  const getBuriedInfoR = useRequest(getCustomBuriedInfo, {
    manual: true,
    onSuccess: (res) => {
      form.setFieldsValue({
        event: res.event,
        desc: res.desc,
        app_id: res.app.app_name,
      });
    },
  });

  useMount(() => {
    if (buried_id) {
      getBuriedInfoR.run(buried_id);
    }
  });

  const handleSubmit = async () => {
    const res = await form.validateFields();
    delete res.event;
    delete res.app_id;
    res.buried_id = buried_id;
    console.log(res);
    updateBuriedR.run(res);
  };

  const formConfig: IFormItem<any>[] = [
    {
      name: "app_id",
      type: "Input",
      label: "所属应用",
      disabled: true,
    },
    {
      name: "event",
      type: "Input",
      label: "埋点名称",
      disabled: true,
    },
    {
      name: "desc",
      type: "Input",
      label: "描述",
      placeholder: "请输入描述",
    },
  ];

  return (
    <Spin spinning={updateBuriedR.loading || getBuriedInfoR.loading}>
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
            loading={updateBuriedR.loading}
          />
        </Col>
      </Row>
    </Spin>
  );
};

export default Create;
