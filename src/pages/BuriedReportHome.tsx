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
import { getCodeName } from "@/apis/code";
import styled from "@emotion/styled";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Select,
  Form,
  DatePicker,
  Radio,
  Cascader,
  Spin,
  Row,
  Col,
  Checkbox,
  Tag,
  Table,
  Space,
  Menu,
} from "antd";
import { getAppInfoList } from "@/apis/app";
import { getTime, getNameFromIndustryCode } from "@/utils";
import moment from "moment";
import { CODE_TYPE, EVENT_TYPE } from "@/constants";

const { SubMenu } = Menu;
const { Item, useForm } = Form;
const { RangePicker } = DatePicker;

const ReportWrapper = styled.div`
  display: flex;
  .ant-form-item-label {
    text-align: left;
  }
`;

const layout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 19 },
};

const MediaReport = () => {
  const [currentPath, setCurrentPath] = useState("/buried");
  const [data, setData] = useState<any[]>([]);
  const [tableData, setTableData] = useState<any[]>([]);
  const [appInfoListData, setAppInfoListData] = useState<any[]>([]);
  const history = useHistory();
  const [initCodeId, setInitCodeId] = useState("");
  const [reqConfig, setReqConfig] = useState<IGetReportChartReq>();
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [form] = useForm();

  const [indicators, setIndicators] = useState("show");
  const [date, setDate] = useState("day");

  const getAppInfoListR = useRequest(getAppInfoList, {
    manual: true,
    onSuccess: (res) => {
      let initCount = 0;
      const _res = res.map((i) => {
        return {
          value: i._id,
          label: i.app_name,
          children: i.codes.map((j) => {
            if (j._id && initCount === 0) {
              form.setFieldsValue({
                code_id: [i._id, j._id],
              });
              setInitCodeId(j._id);
              initCount = initCount + 1;
            }
            return { value: j._id, label: j.code_name };
          }),
        };
      });
      setAppInfoListData(_res);
    },
  });

  const getReportChartR = useRequest(getReportChart, {
    manual: true,
    onSuccess: (res) => {
      console.log(res);
      setData(res);
    },
  });

  const getReportTableR = useRequest(getReportTable, {
    manual: true,
    onSuccess: (res) => {
      setTableData(res.data);
      setTotal(res.pagination.total);
    },
  });

  useEffect(() => {
    if (initCodeId) {
      const start = getTime("yesterday")?.start;
      const end = getTime("yesterday")?.end;
      const req = {
        code_id: initCodeId,
        type: "show",
        start,
        end,
      };
      form.setFieldsValue({
        date_range1: [moment(start), moment(end)],
      });
      setReqConfig(req);
      getReportChartR.run(req);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initCodeId]);

  useMount(() => {
    getAppInfoListR.run();
  });

  const handleDateRange1Change = (time: any, timeString: any) => {
    console.log(timeString);
    setDate("");
    const req: any = {};
    req.code_id = reqConfig?.code_id;
    req.type = reqConfig?.type;
    req.start = timeString[0];
    req.end = timeString[1];
    setReqConfig(req);
    getReportChartR.run(req);
  };

  const handleDateChange = (e: any) => {
    console.log(e.target.value);
    setDate(e.target.value);
    const req: any = {};
    let start = reqConfig?.start;
    let end = reqConfig?.end;
    req.code_id = reqConfig?.code_id;
    req.type = reqConfig?.type;
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
    getReportChartR.run(req);
  };

  const handleCodeIdChange = (e: any) => {
    console.log(e);
    const req: any = reqConfig;
    if (e.length > 1) {
      req.code_id = e[1];
      setReqConfig(req);
      getReportChartR.run(req);
    }
  };

  const handleIndicatorsChange = (e: any) => {
    setIndicators(e);
    const req: any = {
      code_id: reqConfig?.code_id,
      type: e,
      start: reqConfig?.start,
      end: reqConfig?.end,
    };
    setReqConfig(req);
    getReportChartR.run(req);
  };

  useMount(() => {
    setCurrentPath(history.location.pathname);
    getReportTableR.run({ current, page_size: pageSize });
  });

  const config = {
    data: data,
    height: 400,
    xField: "date_string",
    yField: "value",
    seriesField: "event",
    point: {
      size: 5,
      shape: "diamond",
    },
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
      title: "代码位ID",
      dataIndex: "code_id",
      key: "code_id",
      // render: (text: any) => text,
    },
    {
      title: "代码位名称",
      dataIndex: "code_name",
      key: "code_name",
      // render: (text: any) => text,
    },
    {
      title: "代码位类型",
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
  const handleClick = (e: any) => {
    setCurrent(e.key);
    history.push(e.key);
  };
  return (
    <ReportWrapper>
      <Menu
        className="menu"
        onClick={handleClick}
        selectedKeys={[currentPath]}
        mode="inline"
        style={{ width: "256px", height: "calc(100% - 51px)" }}
        defaultOpenKeys={["/buried"]}
        defaultSelectedKeys={[currentPath]}
      >
        <SubMenu key="/buried" title="埋点">
          <Menu.Item key="/buried/manage">管理</Menu.Item>
          <Menu.Item key="/buried/report">报表</Menu.Item>
        </SubMenu>
      </Menu>
      <div css={{ margin: "30px" }}>
        <Spin spinning={getAppInfoListR.loading}>
          <BoxWrapper width="100%" notCenter>
            <Form
              {...layout}
              form={form}
              style={{ width: "600px" }}
              initialValues={{ date: "day" }}
            >
              <Item label="请选择广告位" name="code_id">
                <Cascader
                  placeholder="请选择广告位"
                  options={appInfoListData}
                  onChange={handleCodeIdChange}
                />
              </Item>
              <Item label="日期范围">
                <Row gutter={8}>
                  <Col span={12}>
                    <Item noStyle>
                      <Radio.Group value={date} onChange={handleDateChange}>
                        <Radio.Button value="day">昨日</Radio.Button>
                        <Radio.Button value="week">最近7天</Radio.Button>
                        <Radio.Button value="month">最近30天</Radio.Button>
                      </Radio.Group>
                    </Item>
                  </Col>
                  <Col span={12}>
                    <Item name="date_range1" noStyle>
                      <RangePicker
                        format="YYYY-MM-DD"
                        onChange={handleDateRange1Change}
                      />
                    </Item>
                  </Col>
                </Row>
              </Item>
              <Item label="指标">
                <Select
                  placeholder="请选择指标"
                  value={indicators}
                  onChange={handleIndicatorsChange}
                >
                  <Select.Option value="show">曝光量</Select.Option>
                  <Select.Option value="click">点击量</Select.Option>
                  <Select.Option value="click_rate">点击率</Select.Option>
                </Select>
              </Item>
            </Form>
          </BoxWrapper>
        </Spin>
        <BoxWrapper width="100%" notCenter>
          <Line {...config} />
        </BoxWrapper>
        <BoxWrapper width="100%" notCenter>
          <Table
            columns={columns}
            dataSource={tableData}
            loading={getReportTableR.loading}
            pagination={{
              total,
              pageSize,
              current,
              showTotal: (total) => `共${total}项`,
            }}
            onChange={(e) => {
              setPageSize(e.pageSize as any);
              setCurrent(e.current as any);
              getReportTableR.run({
                page_size: e.pageSize as any,
                current: e.current as any,
              });
            }}
          />
        </BoxWrapper>
      </div>
    </ReportWrapper>
  );
};

export default MediaReport;
