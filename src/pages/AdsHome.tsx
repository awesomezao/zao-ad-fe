import { useState, useEffect } from "react";
import { Button, Menu, Space, Table, Tag } from "antd";
import { getAdsList, IAds } from "@/apis/ads";
import { useRequest } from "ahooks";
import { useHistory } from "react-router-dom";
import { BoxWrapper } from "@/styles/wrapper";
import { getNameFromIndustryCode } from "@/utils";
import styled from "@emotion/styled";
import { CODE_TYPE } from "@/constants";
import { getCodeName } from "@/apis/code";
import * as moment from "moment";

const { Item, SubMenu } = Menu;

const AdsHomeWrapper = styled.div`
  .btn {
    margin-top: 20px;
    padding: 9px 0px;
  }
  .btn-text {
    color: #999;
    margin-left: 15px;
    font-size: 12px;
    display: inline-block;
  }
`;

const AdsHome = () => {
  const [current, setCurrent] = useState("/flow");
  const [data, setData] = useState<IAds[]>([]);
  const history = useHistory();

  const getAdsListR = useRequest(getAdsList, {
    manual: true,
    onSuccess: async (res) => {
      let data: any[] = [];
      res.forEach(async (i, index) => {
        const codeName = await getCodeName(i.code_id);
        data.push({ ...i, key: i._id, code_name: codeName });
        if (index === res.length - 1) {
          setData(data);
        }
      });
    },
  });

  useEffect(() => {
    setCurrent(history.location.pathname);
    getAdsListR.run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const columns = [
    {
      title: "投放ID",
      dataIndex: "_id",
      key: "_id",
      // render: (text: any) => text,
    },
    {
      title: "投放名称",
      dataIndex: "ads_name",
      key: "ads_name",
      // render: (text: any) => text,
    },
    {
      title: "代码位类型",
      dataIndex: "code_type",
      key: "code_type",
      render: (text: any) => (
        <>
          <Tag color="default">{(CODE_TYPE as any)[text]}</Tag>
        </>
      ),
    },
    {
      title: "代码位ID",
      dataIndex: "code_id",
      key: "code_id",
      // render: (text: any) => text,
    },
    {
      title: "代码位名称",
      key: "code_name",
      dataIndex: "code_name",
      // render: async (text: any) => {
      //   console.log(text);
      //   let codeName = "";
      //   if (text.code_id) {
      //     codeName = await getCodeName(text.code_id);
      //     console.log(codeName);
      //   }

      //   return <>{codeName}</>;
      // },
    },
    {
      title: "投放日期",
      dataIndex: "ads_date",
      key: "ads_date",
      render: (text: any) => {
        if (text === "long_term") {
          return "长期";
        } else {
          const time = JSON.parse(text);
          return `${(moment as any)(time[0]).format(
            "YYYY-MM-DD"
          )}~${(moment as any)(time[1]).format("YYYY-MM-DD")}`;
        }
      },
    },
    {
      title: "投放时间",
      dataIndex: "ads_time",
      key: "ads_time",
      render: (text: any) => {
        if (text === "all_day") {
          return "全天";
        } else {
          const time = JSON.parse(text);
          return `${time[0]}~${time[1]}`;
        }
      },
    },
    {
      title: "支付方式",
      dataIndex: "pay_method",
      key: "pay_method",
      // render: (text: any) => text,
    },
    {
      title: "支付数额",
      dataIndex: "payments",
      key: "payments",
    },
    {
      title: "操作",
      key: "action",
      render: (text: any, record: any) => (
        <Space>
          <a>编辑</a>
          <a>数据</a>
        </Space>
      ),
    },
  ];
  const handleClick = (e: any) => {
    setCurrent(e.key);
    history.push(e.key);
  };
  return (
    <AdsHomeWrapper style={{ display: "flex" }}>
      <BoxWrapper
        width="100%"
        height="800px"
        notCenter
        css={{ margin: "30px" }}
      >
        <h2 className="bold">投放</h2>
        <div className="btn">
          <Button
            type="primary"
            onClick={() => history.push("/ads/create")}
          >
            +新建广告
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          loading={getAdsListR.loading}
        />
      </BoxWrapper>
    </AdsHomeWrapper>
  );
};

export default AdsHome;
