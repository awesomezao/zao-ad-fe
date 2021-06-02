import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  creatAds,
  updateAds,
  getAdsList,
  getAdsInfo,
  IUpdateAdsReq,
} from "@/apis/ads";
import {
  Steps,
  Spin,
  Modal,
  message,
  Radio,
  Row,
  Col,
  Typography,
  Upload,
  DatePicker,
} from "antd";
import { useMount, useRequest } from "ahooks";
import { BoxWrapper } from "@/styles/wrapper";
import styled from "@emotion/styled";
import { ISplash, getSplashList } from "@/apis/user";
import { InboxOutlined } from "@ant-design/icons";
import { verticalImg, horizontalImg, emptyImg, CODE_TYPE } from "@/constants";
import ImgCrop from "antd-img-crop";
import FooterBtnGroup from "@/components/FooterBtnGroup";
import { getCodeInfo, getCodeName, ICode } from "@/apis/code";
import moment from "moment";
import { getImgUrl, getLocationTreeSelectOptions } from "@/utils";
import useForm, { IFormItem } from "@/hooks/useForm";
import useConfirm from "@/hooks/useConfirm";
import PageHeader from "@/components/PageHeader";
import DescRadioScope from "@/components/DescRadioScope";
import Preview from "@/components/Preview";
import useUrlSearchParams from "@/hooks/useUrlSearchParams";

const { Dragger } = Upload;

const Wrapper = styled.div`
  .ant-form-item-label {
    text-align: left;
  }
  .yellow {
    color: #fa8e00;
  }
  .img-type {
    display: flex;
    align-items: center;
    margin-top: 10px;
    div {
      margin-left: 5px;
    }
  }
`;

const Update = () => {
  const history = useHistory();
  const { form, Form, renderFormItem } = useForm();
  const ads_id = useUrlSearchParams("ads_id");
  const { showConfirm } = useConfirm({
    title: "修改成功",
    content: "你可以选择返回主页,或者继续修改配置",
    okText: "继续修改",
    onOk: (ads_id) => history.push(`/ads/update?ads_id=${ads_id}`),
    onCancel: () => history.push("/ads"),
  });
  const [codeIds, setCodeIds] = useState<any[]>([]);
  const [payMethod, setPayMethod] = useState("CPM");
  const [codeType, setCodeType] = useState("stream");
  const [imgType, setImgType] = useState("horizontal");
  const [imgUrl, setImgUrl] = useState("");
  const [previewImgUrl, setPreviewImgUrl] = useState("");

  const getCodeInfoR = useRequest(getCodeInfo, {
    manual: true,
    onSuccess: (res) => {
      const _ads_date = res.date ? res.date : [0, 0];
      const dateArr = [moment(_ads_date[0]), moment(_ads_date[1])];
      form.setFieldsValue({
        code_price: res.price,
        code_date: dateArr,
      });
    },
  });

  const getCodeNameR = useRequest(getCodeName, {
    manual: true,
    onSuccess: (res) => {
      form.setFieldsValue({ code_id: res });
    },
  });

  const updateAdsR = useRequest(updateAds, {
    manual: true,
    onSuccess: (res) => {
      console.log("updateAds", res);
      message.success("更新成功");
      ads_id && getAdsInfoR.run(ads_id);
      showConfirm(ads_id);
    },
  });

  const getAdsInfoR = useRequest(getAdsInfo, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      if (res.code_type === "splash" && res.code_id) {
        getCodeInfoR.run(res.code_id);
        getCodeNameR.run(res.code_id);
      }
      setCodeType(res.code_type);
      setImgType(res.creative_config.img_type);
      form.setFieldsValue({
        ads_name: res.ads_name,
        code_type: res.code_type,
        gender: res?.directional?.gender ? res.directional.gender : undefined,
        location: res?.directional?.location
          ? res.directional.location
          : undefined,
        age: res?.directional?.age
          ? JSON.stringify(res.directional.age)
          : undefined,
        pay_method: res.pay_method,
        payments: res.payments,
        img_type: res.creative_config.img_type,
        brand_title: res.creative_config.brand_title,
        location_url: res.creative_config.location_url,
        desc: res.creative_config.desc,
        ads_amount: res.ads_amount,
      });
      res.creative_config.img &&
        setPreviewImgUrl(getImgUrl(res.creative_config.img));
      setImgUrl(res.creative_config.img);
    },
  });

  useMount(() => {
    if (ads_id) {
      getAdsInfoR.run(ads_id);
    }
  });

  const handleSubmit = async () => {
    const res = await form.validateFields();
    const _res: IUpdateAdsReq | any = {};
    _res.ads_id = ads_id;
    _res.ads_name = res.ads_name;
    _res.code_type = res.code_type;
    _res.directional = JSON.stringify({
      gender: res.gender,
      location: res.location,
      age: res.age ? JSON.parse(res.age) : undefined,
    });
    if (res.code_type === "splash") {
      _res.pay_method = "CPT";
    } else {
      _res.pay_method = res.pay_method;
    }

    _res.payments = res.payments ? Number(res.payments) : 0;
    _res.ads_amount = res.ads_amount ? Number(res.ads_amount) : 0;

    _res.creative_config = JSON.stringify({
      img_type: res.img_type,
      img: imgUrl,
      desc: res.desc,
      brand_title: res.brand_title,
      location_url: res.location_url,
    });

    console.log(_res);
    updateAdsR.run(_res);
  };

  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const uploadProps = {
    name: "file",
    multiple: true,
    action: "/apis/file/upload",
    onChange(info: any) {
      const { status } = info.file;
      if (status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (status === "done") {
        setImgUrl(`./${info.file.response.data.path}`);
        message.success(`${info.file.name} file uploaded successfully.`);
        getBase64(info.file.originFileObj, (imageUrl: string) =>
          setPreviewImgUrl(imageUrl)
        );
      } else if (status === "error") {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const formConfig: IFormItem<any>[] = [
    // ads_name
    {
      name: "ads_name",
      type: "Input",
      label: "投放计划名称",
      requiredMessage: "请输入投放计划名称",
      placeholder: "请输入投放计划名称",
    },
    // code_type
    {
      name: "code_type",
      type: "Radio",
      label: "广告位类型",
      onChange: (e) => {
        setCodeType(e.target.value);
        if (e.target.value === "splash") {
          // getSplashListR.run();
          form.setFieldsValue({
            img_type: "vertical",
          });
          setImgType("vertical");
        }
      },
      config: {
        data: [
          { value: "stream", label: "信息流", disabled: true },
          { value: "banner", label: "Banner", disabled: true },
          { value: "splash", label: "开屏广告", disabled: true },
        ],
      },
    },
    // gender
    {
      name: "gender",
      type: "Radio",
      label: "性别",
      config: {
        data: [
          { value: undefined, label: "不限" },
          { value: "man", label: "男" },
          { value: "woman", label: "女" },
        ],
      },
    },
    // location
    {
      name: "location",
      type: "TreeSelect",
      label: "地域",
      placeholder: "请输入地域定向",
      config: {
        data: getLocationTreeSelectOptions(),
      },
    },
    // age
    {
      name: "age",
      type: "Radio",
      label: "年龄",
      config: {
        data: [
          { value: undefined, label: "不限" },
          { value: "[14,18]", label: "14~18" },
          { value: "[19,24]", label: "19~24" },
          { value: "[25,29]", label: "25~29" },
          { value: "[30,39]", label: "30~39" },
          { value: "[40,49]", label: "40~49" },
          { value: "[50,1000]", label: "50~1000" },
        ],
      },
    },
    // pay_method
    {
      name: "pay_method",
      type: "Custom",
      label: "支付方式",
      customComponent: (
        <Radio.Group onChange={(e) => setPayMethod(e.target.value)}>
          <Radio.Button value="CPM" disabled={codeType === "splash"}>
            <DescRadioScope title="CPM" desc="按每次曝光付费" />
          </Radio.Button>
          <Radio.Button value="CPC" disabled={codeType === "splash"}>
            <DescRadioScope title="CPC" desc="按每次点击付费" />
          </Radio.Button>
          <Radio.Button value="CPT" disabled={codeType !== "splash"}>
            <DescRadioScope title="CPT" desc="包时段付费" />
          </Radio.Button>
        </Radio.Group>
      ),
    },
    // payments
    {
      name: "payments",
      type: "Input",
      label: "出价",
      requiredMessage: "请出价",
      placeholder: "请出价",
      fieldProps: {
        prefix: "￥",
        suffix: payMethod === "CPM" ? "元/千次曝光" : "元/点击",
      },
      itemProps: {
        noStyle: true,
      },
      fieldAfter: (
        <Typography.Text>
          {payMethod === "CPM" ? (
            <span>
              建议出价<span className="yellow">5.1</span>~
              <span className="yellow">12.88元</span>/千次曝光
            </span>
          ) : (
            <span>
              建议出价<span className="yellow">0.53</span>~
              <span className="yellow">1.34</span>元/点击
            </span>
          )}
        </Typography.Text>
      ),
    },
    // ads_amount
    {
      name: "ads_amount",
      type: "Input",
      label: "投放数量",
      requiredMessage: "请输入投放数量",
      placeholder: "请输入投放数量",
    },
    // brand_title
    {
      name: "brand_title",
      type: "Input",
      label: "品牌名称",
      requiredMessage: "请输入品牌名称",
      placeholder: "请输入品牌名称",
    },
    // desc
    {
      name: "desc",
      type: "Input",
      label: "广告描述",
      requiredMessage: "请输入广告描述",
      placeholder: "请输入广告描述",
    },
    // location_url
    {
      name: "location_url",
      type: "Input",
      label: "落地页",
      requiredMessage: "请输入落地页",
      placeholder: "请输入落地页",
    },
    // img_type
    {
      name: "img_type",
      type: "Custom",
      label: "创意形式",
      customComponent: (
        <Radio.Group
          value="horizontal"
          defaultValue="horizontal"
          onChange={(e) => setImgType(e.target.value)}
        >
          <Radio.Button
            value="horizontal"
            disabled={codeType === "splash"}
            style={{ height: "100px", width: "200px" }}
          >
            <div className="img-type">
              <img src={horizontalImg} height="80px" />
              <div>横版大图16:9</div>
            </div>
          </Radio.Button>
          <Radio.Button
            value="vertical"
            style={{ height: "100px", width: "200px" }}
          >
            <div className="img-type">
              <img src={verticalImg} height="80px" />
              <div>竖版大图9:16</div>
            </div>
          </Radio.Button>
        </Radio.Group>
      ),
    },
    // img
    {
      name: "img",
      type: "Custom",
      label: "上传图片",
      customComponent: (
        <ImgCrop
          rotate
          grid
          aspect={imgType === "horizontal" ? 16 / 9 : 9 / 16}
        >
          <Dragger {...uploadProps}>
            <p>
              <InboxOutlined />
            </p>
            <p>点击或拖拽到此区域上传</p>
          </Dragger>
        </ImgCrop>
      ),
    },
    // code_id
    {
      name: "code_id",
      type: "Input",
      label: "开屏广告位",
      requiredMessage: "开屏广告位",
      placeholder: "开屏广告位",
      disabled: true,
    },
    // code_price
    {
      name: "code_price",
      type: "Input",
      label: "售价",
      disabled: true,
      placeholder: "售价",
    },
    // code_date
    {
      name: "code_date",
      type: "Custom",
      label: "合约时间",
      placeholder: "合约时间",
      customComponent: <DatePicker.RangePicker disabled format="YYYY-MM-DD" />,
    },
  ];

  return (
    <Spin spinning={updateAdsR.loading}>
      <Row justify="center">
        <Col span={16}>
          <Wrapper>
            <Form>
              <BoxWrapper margin="30px 0 0 0">
                <PageHeader title="新建广告计划" showBack />
                <Col span={17}>
                  {formConfig.slice(0, 2).map((i) => renderFormItem(i))}
                  {codeType === "splash"
                    ? formConfig.slice(13).map((i) => renderFormItem(i))
                    : null}
                </Col>
              </BoxWrapper>
              {codeType !== "splash" ? (
                <>
                  <BoxWrapper margin="30px 0 0 0">
                    <PageHeader title="定向" />
                    <Col span={17}>
                      {formConfig.slice(2, 5).map((i) => renderFormItem(i))}
                    </Col>
                  </BoxWrapper>
                  <BoxWrapper margin="30px 0 0 0">
                    <PageHeader title="出价" />
                    <Col span={17}>
                      {formConfig.slice(5, 8).map((i) => renderFormItem(i))}
                    </Col>
                  </BoxWrapper>
                </>
              ) : null}

              <BoxWrapper margin="30px 0 0 0">
                <PageHeader title="广告创意" />
                <Row>
                  <Col span={13}>
                    {formConfig.slice(8, 13).map((i) => renderFormItem(i))}
                  </Col>
                  <Col span={5} offset={2}>
                    <Preview src={previewImgUrl} layout={imgType} />
                  </Col>
                </Row>
              </BoxWrapper>
            </Form>
          </Wrapper>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={16}>
          <FooterBtnGroup
            onConfirm={handleSubmit}
            onCancel={() => history.push("/ads")}
            loading={updateAdsR.loading}
          />
        </Col>
      </Row>
    </Spin>
  );
};

export default Update;
