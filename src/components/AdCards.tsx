import React from "react";
import {
  streamImgURL,
  bannerImgURL,
  splashImgURL,
  rewardImgURL,
} from "@/constants";
import { BoxWrapper } from "@/styles/wrapper";
import styled from "@emotion/styled";

const Wrapper = styled.div`
  display: flex;
  justify-content:space-around;
  flex-wrap: wrap;
  .box {
    cursor: pointer;
    transition: all 0.2s ease-in;
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
    img {
      width: 72px;
      height: 72px;
    }
    .title {
      font-size: 16px;
      line-height: 22px;
      font-weight: 500;
      color: #333;
      margin: 12px;
    }
    .desc {
      font-size: 14px;
      line-height: 20px;
      color: #999;
      text-align: center;
    }
    &:hover {
      box-shadow: 0 1px 5px 0 rgb(18 18 18 / 30%);
      transform: translateY(-10px);
    }
  }
`;

interface Props {
  onClick: (type: string) => void;
}

const AdCards = ({ onClick }: Props) => {
  const config = [
    {
      key: "stream",
      type: "stream",
      url: streamImgURL,
      title: "信息流",
      desc: "APP推荐页、详情页的图文广告",
    },
    {
      key: "banner",
      type: "banner",
      url: bannerImgURL,
      title: "Banner",
      desc: "APP界面顶部、中部或底部的图文广告",
    },
    {
      key: "splash",
      type: "splash",
      url: splashImgURL,
      title: "开屏",
      desc: "APP开启展示的广告",
    },
    {
      key: "reward",
      type: "reward",
      url: rewardImgURL,
      title: "激励视频",
      desc: "用户可以选择观看全屏视频广告来换取应用或游戏内的奖励",
    },
  ];
  return (
    <Wrapper>
      {config.map((i) => (
        <BoxWrapper
          key={i.key}
          width="200px"
          className="box"
          onClick={() => onClick(i.type)}
        >
          <img src={i.url} />
          <div className="title">{i.title}</div>
          <div className="desc">{i.desc}</div>
        </BoxWrapper>
      ))}
    </Wrapper>
  );
};

export default AdCards;
