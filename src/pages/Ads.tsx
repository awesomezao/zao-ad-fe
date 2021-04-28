import { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { creatAds, updateAds, getAdsList, getAdsInfo } from "@/apis/ads";
import useUrlState from "@ahooksjs/use-url-state";
import {
  Button,
  Steps,
  Form,
  Menu,
  Select,
  Spin,
  TreeSelect,
  Input,
  Modal,
  message,
  Radio,
  Cascader,
  DatePicker,
  TimePicker,
  Row,
  Col,
  Space,
  Tooltip,
  Typography,
  Upload,
  Image,
  Affix,
} from "antd";
import { useMount, useRequest } from "ahooks";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { BoxWrapper } from "@/styles/wrapper";
import styled from "@emotion/styled";
import { getMediaList, IMedia } from "@/apis/user";
import { QuestionCircleFilled } from "@ant-design/icons";
import { InboxOutlined } from "@ant-design/icons";
import { verticalImg, horizontalImg, emptyImg, CODE_TYPE } from "@/constants";
import ImgCrop from "antd-img-crop";
import FooterBtnGroup from "@/components/FooterBtnGroup";
import { getCodeName } from "@/apis/code";
import * as moment from "moment";
import { getImgUrl } from "@/utils";

const { Step } = Steps;
const { useForm, Item } = Form;
const { confirm } = Modal;
const { Dragger } = Upload;

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

const AdsWrapper = styled.div`
  display: flex;
  background-color: #f5f6f7;
  h2 {
    margin-bottom: 40px;
  }
  .ant-form-item-label {
    text-align: left;
  }
  .step {
    /* background-color: #fff; */
    width: 300px;
    height: calc(100vh - 111px);
    margin: 30px 0 30px 30px;
    & > div {
      height: 100%;
    }
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
  .creative {
    display: flex;
  }
  .preview {
    margin-top: 30px;
    margin-left: 200px;
  }
`;

const Ads = () => {
  const history = useHistory();
  const { type = "" } = useParams<{ type: "create" | "update" }>();
  const [form] = useForm();
  const [codeType, setCodeType] = useState("stream");
  const [codeIds, setCodeIds] = useState<any[]>([]);
  const [mediaList, setMediaList] = useState<IMedia[]>([]);

  const [adsDateType, setAdsDateType] = useState("long_term");
  const [adsTimeType, setAdsTimeType] = useState("all_day");

  const [adsDate, setAdsDate] = useState("");
  const [adsTime, setAdsTime] = useState("");

  const [payMethod, setPayMethod] = useState("CPM");

  const [imgType, setImgType] = useState("horizontal");
  const [previewImgUrl, setPreviewImgUrl] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  const urlSearchParams = new URLSearchParams(window.location.search);
  const ads_id = urlSearchParams.get("ads_id");

  const getMediaListR = useRequest(getMediaList, {
    manual: true,
    onSuccess: (res) => {
      console.log("getMediaList", res);
      setMediaList(res);
    },
  });

  useEffect(() => {
    const res = mediaList.filter((i) =>
      i.apps.filter((j) => j.codes.filter((k) => k.code_type === codeType))
    );
    console.log(res);
    setCodeIds(
      res.map((i) => {
        return {
          value: i._id,
          label: i.media_name,
          children: i.apps.map((j) => {
            return {
              value: j.app_id,
              label: j.app_name,
              children: j.codes.map((k) => ({
                value: k._id,
                label: k.code_name,
              })),
            };
          }),
        };
      })
    );
  }, [codeType, mediaList]);

  const getCodeNameR = useRequest(getCodeName, {
    manual: true,
    onSuccess: (res) => {
      form.setFieldsValue({ code_info: res });
    },
  });

  const getAdsInfoR = useRequest(getAdsInfo, {
    manual: true,
    onSuccess: (res) => {
      console.log("getAdsInfo", res);
      // init
      getCodeNameR.run(res.code_id);
      form.setFieldsValue({
        ads_name: res.ads_name,
        code_type: (CODE_TYPE as any)[res.code_type],
        gender: res.directional.gender,
        location: res.directional.location,
        age: res.directional.age,
        ads_date: res.ads_date === "long_term" ? "long_term" : "custom",
        ads_time: res.ads_time === "all_day" ? "all_day" : "custom",
        pay_method: res.pay_method,
        payments: res.payments,
        img_type: res.creative_config.img_type,
        brand_title: res.creative_config.brand_title,
        location_url: res.creative_config.location_url,
        desc: res.creative_config.desc,
      });
      res.creative_config.img &&
        setPreviewImgUrl(getImgUrl(res.creative_config.img));
      setImgUrl(res.creative_config.img);
      if (res.ads_date !== "long_term") {
        console.log(res.ads_date);
        const _ads_date = JSON.parse(res.ads_date);
        const dateArr = [
          (moment as any)(_ads_date[0]),
          (moment as any)(_ads_date[1]),
        ];
        setAdsDate(JSON.stringify(dateArr));
        setAdsDateType("custom");
        form.setFieldsValue({
          ads_date_custom: dateArr,
        });
      }
      if (res.ads_time !== "all_day") {
        console.log(res.ads_time);
        const _ads_time = JSON.parse(res.ads_time);
        console.log(_ads_time);
        const timeArr = [
          (moment as any)(_ads_time[0], "HH:mm:ss"),
          (moment as any)(_ads_time[1], "HH:mm:ss"),
        ];
        setAdsTime(JSON.stringify(timeArr));
        setAdsTimeType("custom");
        form.setFieldsValue({
          ads_time_custom: timeArr,
        });
      }
    },
  });

  const showConfirm = (ads_id?: string) => {
    confirm({
      title: type === "create" ? "创建成功" : "修改成功",
      icon: <ExclamationCircleOutlined color="green" />,
      content: "你可以选择返回主页,或者修改配置",
      okText: type === "create" ? "去修改" : "继续修改",
      cancelText: "返回主页",
      onOk() {
        if (type === "create") {
          history.push(`/ads/update?ads_id=${ads_id}`);
        }
      },
      onCancel() {
        history.push("/ads");
      },
    });
  };

  const createAdsR = useRequest(creatAds, {
    manual: true,
    onSuccess: (res) => {
      message.success("创建成功");
      console.log("createAds", res);
      showConfirm(res._id);
    },
  });

  const updateAdsR = useRequest(updateAds, {
    manual: true,
    onSuccess: (res) => {
      console.log("updateAds", res);
      message.success("更新成功");
      ads_id && getAdsInfoR.run(ads_id);
      showConfirm();
    },
  });

  useMount(() => {
    getMediaListR.run();
    if (type === "update" && ads_id) {
      console.log(ads_id);
      getAdsInfoR.run(ads_id);
    } else {
      getMediaListR.run();
    }
  });

  const handleAdsDateChange = (time: any, timeString: any) => {
    console.log(timeString);
    setAdsDate(JSON.stringify(timeString));
  };

  const handleAdsTimeChange = (time: any, timeString: any) => {
    console.log(timeString);
    setAdsTime(JSON.stringify(timeString));
  };

  const handleSubmit = async () => {
    const res = await form.validateFields();
    const _res: any = {};

    _res.ads_name = res.ads_name;
    _res.code_type = res.code_type;
    if (type === "create") {
      _res.media_id = res.code_id[0];
      _res.code_id = res.code_id[2];
    }

    _res.directional = JSON.stringify({
      gender: res.gender,
      location: res.location,
      age: res.age,
    });

    if (adsDateType === "custom") {
      _res.ads_date = adsDate;
    } else {
      _res.ads_date = res.ads_date;
    }

    if (adsTimeType === "custom") {
      _res.ads_time = adsTime;
    } else {
      _res.ads_time = res.ads_time;
    }

    _res.pay_method = res.pay_method;
    _res.payments = res.payments;

    _res.creative_config = JSON.stringify({
      img_type: res.img_type,
      img: imgUrl,
      desc: res.desc,
      brand_title: res.brand_title,
      location_url: res.location_url,
    });
    console.log(_res);
    // console.log(res);
    if (type === "create") {
      createAdsR.run(_res);
    } else {
      _res.ads_id = ads_id;
      updateAdsR.run(_res);
    }
  };

  const getBase64 = (img: any, callback: any) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const props = {
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

  return (
    <AdsWrapper>
      <Affix offsetTop={10}>
        <div className="step">
          <Steps current={4} direction="vertical">
            <Step title="新建计划" />
            <Step title="定向" />
            <Step title="排期与出价" />
            <Step title="广告创意" />
          </Steps>
        </div>
      </Affix>

      <Form
        {...layout}
        style={{ width: "100%", margin: "30px" }}
        form={form}
        // 表单初始值
        initialValues={{
          code_type: "stream",
          ads_method: "confirmed",
          gender: "all",
          location: "all",
          age: "all",
          ads_date: "long_term",
          ads_time: "all_day",
          pay_method: "CPM",
          img_type: "horizontal",
        }}
        layout="horizontal"
      >
        <BoxWrapper width="100%" notCenter>
          <h2 className="bold">新建广告计划</h2>
          <div style={{ width: "600px" }}>
            <Item
              label="投放计划名称"
              name="ads_name"
              rules={[{ required: true, message: "请输入投放计划名称" }]}
            >
              <Input placeholder="请输入投放计划名称" />
            </Item>
            <Item label="投放方式" name="ads_method">
              <Radio.Group value="confirmed">
                <Radio.Button value="intelligent" disabled>
                  智能优化
                </Radio.Button>
                <Radio.Button value="confirmed">定点</Radio.Button>
              </Radio.Group>
            </Item>

            {type === "create" ? (
              <Item label="请选择广告位类型" name="code_type">
                <Radio.Group
                  value={codeType}
                  onChange={(e) => {
                    setCodeType(e.target.value);
                  }}
                >
                  <Radio.Button value="stream">信息流</Radio.Button>
                  <Radio.Button value="banner">Banner</Radio.Button>
                  <Radio.Button value="splash">开屏广告</Radio.Button>
                  <Radio.Button value="reward">激励视频</Radio.Button>
                </Radio.Group>
              </Item>
            ) : (
              <Item label="广告位类型" name="code_type">
                <Input disabled />
              </Item>
            )}
            {type === "create" ? (
              <Item
                label="请选择广告位"
                name="code_id"
                rules={[{ required: true, message: "请选择广告位" }]}
              >
                <Cascader
                  options={codeIds}
                  placeholder="请选择广告位"
                  allowClear
                />
              </Item>
            ) : (
              <Item label="广告位" name="code_info">
                <Input disabled />
              </Item>
            )}
          </div>
        </BoxWrapper>

        <BoxWrapper width="100%" notCenter>
          <h2 className="bold">定向</h2>
          <div style={{ width: "600px" }}>
            <Item label="性别" name="gender">
              <Radio.Group value="all">
                <Radio.Button value="all">不限</Radio.Button>
                <Radio.Button value="man">男</Radio.Button>
                <Radio.Button value="woman">女</Radio.Button>
              </Radio.Group>
            </Item>
            <Item label="地域" name="location">
              <Radio.Group value="all">
                <Radio.Button value="all">不限</Radio.Button>
                <Radio.Button value="detail" disabled>
                  按地域
                </Radio.Button>
              </Radio.Group>
            </Item>
            <Item label="年龄" name="age">
              <Radio.Group value="all">
                <Radio.Button value="all">不限</Radio.Button>
                <Radio.Button value="14-18">14~18</Radio.Button>
                <Radio.Button value="19-24">19~24</Radio.Button>
                <Radio.Button value="25-29">25~29</Radio.Button>
                <Radio.Button value="30-39">30~39</Radio.Button>
                <Radio.Button value="40-49">40~49</Radio.Button>
                <Radio.Button value="50岁以上">50岁以上</Radio.Button>
              </Radio.Group>
            </Item>
          </div>
        </BoxWrapper>

        <BoxWrapper width="100%" notCenter>
          <h2 className="bold">排期与定价</h2>
          <div style={{ width: "600px" }}>
            <Item label="投放日期">
              <Item name="ads_date">
                <Radio.Group
                  value="long_term"
                  onChange={(e) => setAdsDateType(e.target.value)}
                >
                  <Radio.Button value="long_term">长期</Radio.Button>
                  <Radio.Button value="custom">
                    指定开始日期与结束日期
                  </Radio.Button>
                </Radio.Group>
              </Item>

              {adsDateType === "custom" && (
                <Item name="ads_date_custom">
                  <DatePicker.RangePicker
                    format="YYYY-MM-DD"
                    onChange={handleAdsDateChange}
                  />
                </Item>
              )}
            </Item>
            <Item label="投放时间">
              <Item name="ads_time">
                <Radio.Group
                  value="all_day"
                  onChange={(e) => setAdsTimeType(e.target.value)}
                >
                  <Radio.Button value="all_day">全天</Radio.Button>
                  <Radio.Button value="custom">
                    指定开始时间与结束时间
                  </Radio.Button>
                </Radio.Group>
              </Item>

              {adsTimeType === "custom" && (
                <Item name="ads_time_custom">
                  <TimePicker.RangePicker onChange={handleAdsTimeChange} />
                </Item>
              )}
            </Item>
            <Item label="支付方式" name="pay_method">
              <Radio.Group
                value="CPM"
                onChange={(e) => setPayMethod(e.target.value)}
              >
                <Radio.Button value="CPM">
                  <Space>
                    CPM
                    <Tooltip
                      title="按每千次曝光付费"
                      color="#fff"
                      overlayInnerStyle={{ color: "#000" }}
                    >
                      <QuestionCircleFilled style={{ color: "#c4c8cc" }} />
                    </Tooltip>
                  </Space>
                </Radio.Button>
                <Radio.Button value="CPC">
                  <Space>
                    CPC
                    <Tooltip
                      title="按每次点击付费"
                      color="#fff"
                      overlayInnerStyle={{ color: "#000" }}
                    >
                      <QuestionCircleFilled style={{ color: "#c4c8cc" }} />
                    </Tooltip>
                  </Space>
                </Radio.Button>
                <Radio.Button value="oCPM" disabled>
                  <Space>
                    oCPM
                    <Tooltip title="" color="#fff">
                      <QuestionCircleFilled style={{ color: "#c4c8cc" }} />
                    </Tooltip>
                  </Space>
                </Radio.Button>
                <Radio.Button value="oCPC" disabled>
                  <Space>
                    oCPC
                    <Tooltip title="" color="#fff">
                      <QuestionCircleFilled style={{ color: "#c4c8cc" }} />
                    </Tooltip>
                  </Space>
                </Radio.Button>
              </Radio.Group>
            </Item>
            <Item label="出价">
              <Space>
                <Item
                  name="payments"
                  noStyle
                  rules={[{ required: true, message: "请出价" }]}
                >
                  <Input
                    prefix="￥"
                    suffix={payMethod === "CPM" ? "元/千次曝光" : "元/点击"}
                  />
                </Item>
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
              </Space>
            </Item>
          </div>
        </BoxWrapper>

        <BoxWrapper width="100%" notCenter>
          <h2 className="bold">广告创意</h2>
          <div className="creative">
            <div style={{ width: "600px" }}>
              <Item label="创意形式" name="img_type">
                <Radio.Group
                  value="horizontal"
                  onChange={(e) => setImgType(e.target.value)}
                >
                  <Radio.Button
                    value="horizontal"
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
              </Item>
              <Item label="上传图片" name="img">
                <ImgCrop
                  rotate
                  grid
                  aspect={imgType === "horizontal" ? 16 / 9 : 9 / 16}
                >
                  <Dragger {...props}>
                    <p>
                      <InboxOutlined />
                    </p>
                    <p>点击或拖拽到此区域上传</p>
                  </Dragger>
                </ImgCrop>
              </Item>
              <Item
                label="品牌标题"
                name="brand_title"
                rules={[{ required: true, message: "请输入品牌标题" }]}
              >
                <Input placeholder="请输入品牌标题" />
              </Item>
              <Item
                label="落地页"
                name="location_url"
                rules={[{ required: true, message: "请输入落地页网址" }]}
              >
                <Input placeholder="请输入落地页网址" />
              </Item>
              <Item
                label="广告描述"
                name="desc"
                rules={[{ required: true, message: "请输入广告描述" }]}
              >
                <Input placeholder="请输入广告描述" />
              </Item>
            </div>
            <div className="preview">
              <Image
                style={{ border: "1px dashed #d9d9d9" }}
                src={previewImgUrl}
                width={imgType === "horizontal" ? "320px" : "180px"}
                height={imgType === "horizontal" ? "180px" : "320px"}
                fallback={emptyImg}
              />
            </div>
          </div>
        </BoxWrapper>
        <FooterBtnGroup
          width="100%"
          onConfirm={handleSubmit}
          onCancel={() => history.push("/flow/ads")}
        />
      </Form>
    </AdsWrapper>
  );
};

export default Ads;
