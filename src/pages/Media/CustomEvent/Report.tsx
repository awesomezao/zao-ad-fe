import { useEffect } from "react";
import { Line, DualAxes } from "@ant-design/charts";
import { getAdsList } from "@/apis/ads";
import {
  getReportChart,
  getReportTable,
  IGetReportChartReq,
} from "@/apis/report";
import { useRequest, useMount } from "ahooks";
import { BoxWrapper } from "@/styles/wrapper";
import styled from "@emotion/styled";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Form,
  DatePicker,
  Radio,
  Cascader,
  Spin,
  Row,
  Col,
  Table,
  Space,
} from "antd";
import {
  getFilterBuriedList,
  IGetFilterBuriedList,
  getCustomBuriedReport,
  IGetCustomBuriedReportReq,
  getCustomTopBuried,
  IGetCustomTopBuriedRes,
} from "@/apis/buried";
import { getTime, getNameFromIndustryCode } from "@/utils";
import moment from "moment";
import { CODE_TYPE, EVENT_TYPE } from "@/constants";
import useSideMenu from "@/hooks/useSideMenu";
import AppPicker from "@/components/AppPicker";
import PageHeader from '@/components/PageHeader';

const { Item, useForm } = Form;
const { RangePicker } = DatePicker;

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

const Report = () => {
  const history = useHistory();
  const { sideMenu } = useSideMenu({
    title: "埋点",
    prePath: "/event",
    height: "100%",
    data: [
      { value: "/event/manage", label: "管理" },
      { value: "/event/report", label: "报表" },
    ],
  });
  const [form] = useForm();
  const [filterData, setFilterData] = useState<any[]>([]);
  const [indicators, setIndicators] = useState("show");
  const [showClickData, setShowClickData] = useState<any[]>([]);
  const [clickRateData, setClickRateData] = useState<any[]>([]);
  const [date, setDate] = useState("day");
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [reqConfig, setReqConfig] = useState<IGetCustomBuriedReportReq>();
  const [topShowEventsData, setTopShowEventsData] = useState<
    IGetCustomTopBuriedRes[]
  >([]);
  const [topClickEventsData, setTopClickEventsData] = useState<
    IGetCustomTopBuriedRes[]
  >([]);

  const getFilterBuriedListR = useRequest(getFilterBuriedList, {
    manual: true,
    onSuccess: (res) => {
      setFilterData(
        res.map((i) => ({
          value: i._id,
          label: i.app_name,
          children: i.events.map((j) => ({
            value: j._id,
            label: j.event,
          })),
        }))
      );
    },
  });

  const getReportR = useRequest(getCustomBuriedReport, {
    manual: true,
    onSuccess: (res) => {
      const _res1: any[] = [];
      const _res2: any[] = [];
      res.forEach((i) => {
        _res1.push({ date_string: i.date_string, type: "show", value: i.show });
        _res1.push({
          date_string: i.date_string,
          type: "click",
          value: i.click,
        });
        _res2.push({
          date_string: i.date_string,
          type: "click_rate",
          value_rate: i.click_rate,
        });
      });
      setShowClickData(_res1);
      setClickRateData(_res2);
    },
  });

  const getTopShowEventsR = useRequest(getCustomTopBuried, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      setTopShowEventsData(res);
    },
  });
  const getTopClickEventsR = useRequest(getCustomTopBuried, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      setTopClickEventsData(res);
    },
  });

  useMount(() => {
    getFilterBuriedListR.run();
  });

  const handleDateRange1Change = (time: any, timeString: any) => {
    console.log(timeString);
    setDate("");
    const req: any = {};
    req.event_id = reqConfig?.event_id;
    req.start = timeString[0];
    req.end = timeString[1];
    setReqConfig(req);
    getReportR.run(req);
  };

  const handleDateChange = (e: any) => {
    console.log(e.target.value);
    setDate(e.target.value);
    const req: any = {};
    let start = reqConfig?.start;
    let end = reqConfig?.end;
    req.event_id = reqConfig?.event_id;
    if (e.target.value === "day") {
      start = getTime("yesterday")?.start;
      end = getTime("yesterday")?.end;
    }
    if (e.target.value === "week") {
      start = getTime("week")?.start;
      end = getTime("week")?.end;
    }
    if (e.target.value === "month") {
      start = getTime("month")?.start;
      end = getTime("month")?.end;
    }
    req.start = start;
    req.end = end;
    form.setFieldsValue({
      date_range1: [moment(start), moment(end)],
    });
    setReqConfig(req);
    getReportR.run(req);
  };

  const handleCascaderChange = (e: any) => {
    const req: any = {};
    let start = reqConfig?.start;
    let end = reqConfig?.end;
    req.start = start;
    req.end = end;
    req.event_id = e[1];
    setReqConfig(req);
    getReportR.run(req);
  };

  const columns = [
    {
      title: "日期",
      dataIndex: "date_string",
      key: "date_string",
      // render: (text: any) => text,
    },
    {
      title: "应用ID",
      dataIndex: "_id",
      key: "_id",
      // render: (text: any) => text,
    },
    {
      title: "应用名称",
      dataIndex: "app_name",
      key: "app_name",
      // render: (text: any) => text,
    },
    {
      title: "行业",
      dataIndex: "industry",
      key: "industry",
      render: (text: any) => getNameFromIndustryCode(text),
    },
    {
      title: "广告位ID",
      dataIndex: "code_id",
      key: "code_id",
      // render: (text: any) => text,
    },
    {
      title: "广告位名称",
      dataIndex: "code_name",
      key: "code_name",
      // render: (text: any) => text,
    },
    {
      title: "广告位类型",
      dataIndex: "code_type",
      key: "code_type",
      render: (text: any) => (CODE_TYPE as any)[text],
    },
    {
      title: "事件名称",
      dataIndex: "event",
      key: "event",
      render: (text: any) => (EVENT_TYPE as any)[text],
    },
    {
      title: "值",
      dataIndex: "value",
      key: "value",
      // render: (text: any) => text,
    },
  ];

  const topEventsColumns = [
    {
      title: "事件名",
      dataIndex: "event_name",
      key: "event_name",
    },
    {
      title: "值",
      dataIndex: "value",
      key: "value",
    },
  ];

  const config = {
    data: [showClickData, clickRateData],
    height: 600,
    xField: "date_string",
    yField: ["value", "value_rate"],
    // seriesField: "type",
    point: {
      size: 5,
      shape: "diamond",
    },
    geometryOptions: [
      {
        geometry: "line",
        seriesField: "type",
      },
      {
        geometry: "line",
        seriesField: "type",
      },
    ],
  };

  return (
    <Spin spinning={getFilterBuriedListR.loading || getReportR.loading}>
      <Row>
        <Col span={3}>{sideMenu}</Col>
        <Col span={19} offset={1}>
          <Col>
            <BoxWrapper margin="30px 0 0 0" height="300px">
              <Row>
                <Form
                  form={form}
                  layout="vertical"
                  initialValues={{ date: "day" }}
                >
                  <Col span={15}>
                    <Item label="请选择事件" name="event_id">
                      <Cascader
                        options={filterData}
                        placeholder="请选择事件"
                        allowClear
                        onChange={handleCascaderChange}
                      />
                    </Item>
                  </Col>
                  <Item label="日期范围">
                    <Space>
                      <Item>
                        <Radio.Group value={date} onChange={handleDateChange}>
                          <Radio.Button value="day">昨日</Radio.Button>
                          <Radio.Button value="week">最近7天</Radio.Button>
                          <Radio.Button value="month">最近30天</Radio.Button>
                        </Radio.Group>
                      </Item>
                      <Item name="date_range1">
                        <RangePicker
                          format="YYYY-MM-DD"
                          onChange={handleDateRange1Change}
                        />
                      </Item>
                    </Space>
                  </Item>
                </Form>
              </Row>
            </BoxWrapper>
          </Col>
          <Col>
            <BoxWrapper>
              <PageHeader title="数据趋势" />
              <DualAxes {...config} />
            </BoxWrapper>
          </Col>
          <Col>
            <BoxWrapper margin="0 0 30px 0">
            <PageHeader title="TOP埋点事件" />
              <Col span={13}>
                <AppPicker
                  onRequestSuccess={(appList) => {
                    if (appList.length) {
                      getTopShowEventsR.run({
                        app_id: appList[0]._id,
                        type: "show",
                      });
                      getTopClickEventsR.run({
                        app_id: appList[0]._id,
                        type: "click",
                      });
                    }
                  }}
                  onAppChange={(app_id) => {
                    getTopShowEventsR.run({ app_id, type: "show" });
                    getTopClickEventsR.run({ app_id, type: "click" });
                  }}
                />
              </Col>
              <Col>
                <Row>
                  <Col span={12}>
                    <Table
                      title={() => <span className="bold">曝光量</span>}
                      columns={topEventsColumns}
                      dataSource={topShowEventsData}
                    />
                  </Col>
                  <Col span={12}>
                    <Table
                      title={() => <span className="bold">点击量</span>}
                      columns={topEventsColumns}
                      dataSource={topClickEventsData}
                    />
                  </Col>
                </Row>
              </Col>
            </BoxWrapper>
          </Col>
        </Col>
      </Row>
    </Spin>
  );
};

export default Report;
