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
import FooterBtnGroup from "@/components/ReviewFooterBtnGroup";
import { getCodeInfo, getCodeName, ICode } from "@/apis/code";
import moment from "moment";
import { getImgUrl, getLocationTreeSelectOptions } from "@/utils";
import useForm, { IFormItem } from "@/hooks/useForm";
import useConfirm from "@/hooks/useConfirm";
import PageHeader from "@/components/PageHeader";
import DescRadioScope from "@/components/DescRadioScope";
import Preview from "@/components/Preview";
import useUrlSearchParams from "@/hooks/useUrlSearchParams";
import { reviewAds } from "@/apis/admin";
import { useCurrent } from "@/hooks/useCurrentPath";

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

const AdsInfo = () => {
  const history = useHistory();
  const { form, Form, renderFormItem } = useForm();
  const ads_id = useUrlSearchParams("ads_id");
  const { redirect } = useCurrent();
  const { showConfirm } = useConfirm({
    title: "审核",
    content: "确定审核意见吗",
    okText: "确定",
    cancelText: "取消",
    onOk: (props) => {
      const { ads_id, status } = props;
      reviewR.run(ads_id, status);
    },
  });
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

  const reviewR = useRequest(reviewAds, {
    manual: true,
    onSuccess: (res) => {
      message.success("审核成功");
      redirect("/admin/ads");
    },
  });

  const getCodeNameR = useRequest(getCodeName, {
    manual: true,
    onSuccess: (res) => {
      form.setFieldsValue({ code_id: res });
    },
  });

  const getAdsInfoR = useRequest(getAdsInfo, {
    manual: true,
    onSuccess: (res) => {
      if (res.code_type === "splash" && res.code_id) {
        getCodeInfoR.run(res.code_id);
        getCodeNameR.run(res.code_id);
      }
      setCodeType(res.code_type);
      setImgType(res.creative_config.img_type);
      console.log(JSON.stringify(res.directional.age));
      form.setFieldsValue({
        ads_name: res.ads_name,
        code_type: res.code_type,
        gender: res.directional?.gender ? res.directional.gender : undefined,
        location: res.directional?.location
          ? res.directional.location
          : undefined,
        age: res.directional?.age
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
          <Dragger>
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
    <Spin spinning={getAdsInfoR.loading || reviewR.loading}>
      <Row justify="center">
        <Col span={16}>
          <Wrapper>
            <Form>
              <BoxWrapper margin="30px 0 0 0">
                <PageHeader title="广告计划信息" showBack />
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
            onPass={() => {
              showConfirm({ ads_id, status: "running" });
            }}
            onReject={() => {
              showConfirm({ ads_id, status: "no_pass" });
            }}
            onCancel={() => history.push("/admin/ads")}
            loading={getAdsInfoR.loading || reviewR.loading}
          />
        </Col>
      </Row>
    </Spin>
  );
};

export default AdsInfo;
