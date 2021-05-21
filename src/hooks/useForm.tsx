import React, { useMemo } from "react";
import {
  Form as AntdForm,
  Input,
  Radio,
  Cascader,
  TreeSelect,
  Select,
} from "antd";

export interface IRadioConfig {
  data: { value: string; label: string; disabled?: boolean }[];
}

export interface ISelectConfig {
  data: { value: string; label: string }[];
}

export type TCascader = { value: string; label: string; children: TCascader };
export interface ICascaderConfig {
  data: TCascader;
}

export type TTreeSelect = {
  title: string;
  value: number | string;
  key: number | string;
  children: TTreeSelect;
};
export interface ITreeSelectConfig {
  data: TTreeSelect;
}

export interface IFormItem<T> {
  name?: string;
  label: string;
  type: "Input" | "Radio" | "Cascader" | "TreeSelect" | "Select" | "Custom";
  onChange?: (e: any) => void;
  config?: T;
  disabled?: boolean;
  placeholder?: string;
  requiredMessage?: string;
  extra?: string;
  customComponent?: React.ReactNode;
}

interface Props {}

const useForm = (layout: "horizontal" | "vertical" | "inline" = "vertical") => {
  const [form] = AntdForm.useForm();
  const Form: React.FC = ({ children }) => (
    <AntdForm form={form} layout={layout}>
      {children}
    </AntdForm>
  );

  function renderFormItem<T>(props: IFormItem<T>) {
    const {
      name,
      label,
      type,
      requiredMessage,
      extra,
      placeholder,
      config,
      disabled,
      customComponent,
      onChange = () => {},
    } = props;
    let formItemField = null;
    const rules = [];
    if (requiredMessage) {
      rules.push({ required: true, message: requiredMessage });
    }
    if (type === "Input") {
      formItemField = (
        <Input
          placeholder={placeholder}
          onChange={onChange}
          disabled={disabled}
        />
      );
    }
    if (type === "Radio") {
      const { data = [] } = config as any;
      formItemField = (
        <Radio.Group
          value={data[0].value}
          defaultValue={data[0].value}
          onChange={onChange}
        >
          {data.map((i: any) => (
            <Radio.Button key={i.value} value={i.value} disabled={i.disabled}>
              {i.label}
            </Radio.Button>
          ))}
        </Radio.Group>
      );
    }
    if (type === "Select") {
      const { data = [] } = config as any;
      formItemField = (
        <Select onChange={onChange} placeholder={placeholder}>
          {data.map((i: any) => (
            <Select.Option key={i.value} value={i.value}>
              {i.label}
            </Select.Option>
          ))}
        </Select>
      );
    }
    if (type === "Cascader") {
      const { data } = config as any;
      formItemField = (
        <Cascader
          options={data}
          placeholder={placeholder}
          allowClear
          onChange={onChange}
        />
      );
    }
    if (type === "TreeSelect") {
      const { data } = config as any;
      formItemField = (
        <TreeSelect
          treeData={data}
          placeholder={placeholder}
          allowClear
          treeCheckable
        />
      );
    }
    if (type === "Custom") {
      formItemField = customComponent;
    }
    return (
      <AntdForm.Item
        key={`${name}-${label}`}
        name={name}
        label={label}
        rules={rules}
        extra={extra}
      >
        {formItemField}
      </AntdForm.Item>
    );
  }

  return {
    form,
    Form,
    renderFormItem,
  };
};

export default useForm;
