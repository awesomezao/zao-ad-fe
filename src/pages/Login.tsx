import { login } from "@/apis/user";
import { useHistory } from "react-router-dom";
import { Button, Form, Input, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import AuthWrapper from "@/components/AuthWrapper";
import { useRequest } from "ahooks";

const { Item, useForm } = Form;

const Login = () => {
  const history = useHistory();
  const [form] = useForm();
  const loginR = useRequest(login, {
    manual: true,
    onSuccess: (res) => {
      message.success('登陆成功')
      window.localStorage.setItem('user_token',res.token)
    },
  });
  const handleSubmit = async () => {
    const res = await form.validateFields();
    delete res.remember;
    loginR.run(res);
  };
  return (
    <AuthWrapper>
      <Form form={form} initialValues={{ remember: true, role: "advertiser" }}>
        <Item
          name="username"
          hasFeedback
          rules={[{ required: true, message: "请输入用户名" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="请输入用户名" />
        </Item>
        <Item
          name="password"
          hasFeedback
          rules={[{ required: true, message: "请输入密码" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="请输入密码"
          />
        </Item>
        <Item>
          <Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>记住我</Checkbox>
          </Item>
          {/* eslint-disable-next-line */}
          <a style={{ float: "right" }}>忘记密码</a>
        </Item>
        <Item>
          <Button
            style={{ width: "100%" }}
            type="primary"
            onClick={handleSubmit}
            loading={loginR.loading}
          >
            登录
          </Button>
          or<a onClick={() => history.push("/register")}> 去注册!</a>
        </Item>
      </Form>
    </AuthWrapper>
  );
};

export default Login;
