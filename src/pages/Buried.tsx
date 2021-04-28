import { BoxWrapper } from "@/styles/wrapper";
import {
  Form,
  Radio,
  Cascader,
  TreeSelect,
  Input,
  message,
  Spin,
  Modal,
  Select,
} from "antd";
import FooterBtnGroup from "@/components/FooterBtnGroup";
import { useParams, useHistory } from "react-router-dom";
import { useRequest, useMount } from "ahooks";
import { useState } from "react";
import {
  createCustomBuried,
  getCustomBuriedInfo,
  updateCustomBuried,
} from "@/apis/buried";
import { getAppList, IApp, getAppInfo } from "@/apis/app";
import { getIndustryArray } from "@/utils";
import { ExclamationCircleOutlined } from "@ant-design/icons";
const { Item, useForm } = Form;
const { confirm } = Modal;

const Buried = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [appList, setAppList] = useState<IApp[]>([]);
  const { type = "" } = useParams<{ type: "create" | "update" }>();
  const urlSearchParams = new URLSearchParams(window.location.search);
  const buried_id = urlSearchParams.get("buried_id");

  const showConfirm = (buried_id?: string) => {
    confirm({
      title: type === "create" ? "创建成功" : "修改成功",
      icon: <ExclamationCircleOutlined color="green" />,
      content: "你可以选择返回主页,或者修改配置",
      okText: type === "create" ? "去修改" : "继续修改",
      cancelText: "返回主页",
      onOk() {
        if (type === "create") {
          history.push(`/buried/update?buried_id=${buried_id}`);
        }
      },
      onCancel() {
        history.push("/buried");
      },
    });
  };

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

  const getAppInfoR = useRequest(getAppInfo, {
    manual: true,
    onSuccess: (res) => {
      form.setFieldsValue({
        app_info: res.app_name,
      });
    },
  });

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
      });
      if (type === "update") {
        getAppInfoR.run(res.app_id);
        form.setFieldsValue({
          app_info: res.app_id,
        });
      }
    },
  });

  useMount(() => {
    if (type === "create") {
      getAppListR.run();
    }
    if (type === "update" && buried_id) {
      getBuriedInfoR.run(buried_id);
    }
  });

  const handleSubmit = async () => {
    const res = await form.validateFields();

    if (type === "create") {
      createBuriedR.run(res);
    } else {
      res.buried_id = buried_id;
      updateBuriedR.run(res);
    }
  };

  return (
    <Spin spinning={getBuriedInfoR.loading || updateBuriedR.loading}>
      <BoxWrapper>
        <h2 style={{ fontWeight: "bold" }}>完善自定义埋点信息</h2>
        <Form style={{ width: "400px" }} form={form} layout="vertical">
          {type === "create" && (
            <Item label="请选择应用" name="app_id">
              <Select>
                {appList.map((i) => (
                  <Select.Option key={i._id} value={i._id}>
                    {i.app_name}
                  </Select.Option>
                ))}
              </Select>
            </Item>
          )}
          {type === "update" && (
            <Item label="所属应用" name="app_info">
              <Input disabled />
            </Item>
          )}
          <Item
            label="自定义埋点名称"
            name="event"
            rules={[{ required: true, message: "请输入自定义埋点名称" }]}
          >
            <Input
              placeholder="请输入自定义埋点名称"
              disabled={type === "update"}
            />
          </Item>
          <Item label="描述" name="desc">
            <Input placeholder="请输入描述" />
          </Item>
        </Form>
      </BoxWrapper>
      <FooterBtnGroup
        onConfirm={handleSubmit}
        onCancel={() => history.push("/buried")}
        loading={
          createBuriedR.loading ||
          updateBuriedR.loading ||
          getBuriedInfoR.loading
        }
      />
    </Spin>
  );
};

export default Buried;
