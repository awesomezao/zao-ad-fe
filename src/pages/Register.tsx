import { register } from "@/apis/user";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, Form, Input, message, Select, Upload } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import AuthWrapper from "@/components/AuthWrapper";
import { useRequest } from "ahooks";
import Avatar from "@/components/Avatar";

const { Item, useForm } = Form;

const Register = () => {
  const history = useHistory();
  const [form] = useForm();
  const [avatar, setAvatar] = useState<any>(null);
  const registerR = useRequest(register, {
    manual: true,
    onSuccess: (res) => {
      message.success("注册成功，正在跳转到登录界面...");
      history.push('/login')
    },
  });
  const handleSubmit = async () => {
    const res = await form.validateFields();
    const req: any = new FormData();
    req.set("username", res.username);
    req.set("password", res.password);
    req.set("role", res.role);
    req.set("name", res.name);
    req.set("avatar", avatar);
    registerR.run(req);
  };
  return (
    <AuthWrapper>
      <Form form={form}>
        <Item>
          <Avatar bind={setAvatar} showEdit allowEdit />
        </Item>
        <Item
          name="name"
          hasFeedback
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
        </Item>
        <Item
          name="username"
          hasFeedback
          rules={[
            { required: true, message: "请输入邮箱" },
            {
              type: "email",
              message: "请输入正确的邮箱格式",
            },
          ]}
        >
          <Input prefix={<UserOutlined />} placeholder="请输入邮箱" />
        </Item>
        <Item
          name="password"
          hasFeedback
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="请输入密码" />
        </Item>
        <Item
          name="confirmPassword"
          hasFeedback
          rules={[
            { required: true, message: "请确认密码" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("两次输入不一致"));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="请确认密码" />
        </Item>
        <Item name="role" rules={[{ required: true, message: "请选择角色" }]}>
          <Select placeholder="请选择角色">
            <Select.Option value="advertiser">广告主</Select.Option>
            <Select.Option value="media">媒体</Select.Option>
          </Select>
        </Item>
        <Item>
          <Button
            style={{ width: "100%" }}
            type="primary"
            onClick={handleSubmit}
            loading={registerR.loading}
          >
            注册
          </Button>
          or<a onClick={() => history.push("/login")}> 去登录!</a>
        </Item>
      </Form>
    </AuthWrapper>
  );
};

export default Register;
