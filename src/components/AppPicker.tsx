import { useState } from "react";
import { getAppList, IApp, getAppInfo } from "@/apis/app";
import { useRequest, useMount } from "ahooks";
import { Form, Select } from "antd";

interface Props {
  onRequestSuccess?: (res: IApp[]) => void;
  onAppChange?: (app_id: string) => void;
  refreshList?: boolean;
}

const AppPicker = (props: Props) => {
  const {
    onRequestSuccess = (res) => {},
    onAppChange = (app_id) => {},
    refreshList = false,
  } = props;
  const [appList, setAppList] = useState<IApp[]>([]);
  const [form] = Form.useForm();

  const getAppListR = useRequest(getAppList, {
    manual: true,
    onSuccess: (res) => {
      if (res.length > 0) {
        form.setFieldsValue({
          app_id: res[0]._id,
        });
        onRequestSuccess(res);
        setAppList(res);
      }
    },
  });

  useMount(() => {
    getAppListR.run();
  });

  return (
    <div>
      <Form form={form}>
        <Form.Item label="选择应用" name="app_id">
          <Select onChange={onAppChange}>
            {appList.map((i) => (
              <Select.Option key={i._id} value={i._id}>
                {i.app_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AppPicker;
