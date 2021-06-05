## 快速入门

本平台只提供混合开发的 SDK，对于原生开发的 App，项目将提供网络接口供开发者使用

1. 使用开发者身份登录平台后，创建 App
2. 开发者在创建 App 后，通过创建代码位进行接入
3. 开发者引入 SDK
4. 在项目中保存平台上创建的 app_id，code_id，event

## 下载

```shell
git clone https://github.com/lyandzao/SDK.git
```

## 流程

1. 开发者在接入时，需要先获取广告，根据下文的`getAd`或者`getSplashAd`
2. 在获取了广告后，开发者可以根据自己的需要组织广告信息，在列表、banner、开屏上展示
3. 每当广告显示时会发送曝光事件、每当广告被点击时会发送点击事件
4. 开屏广告位需要用 SDK 提供的`Splash`组件接入

## 方法

- getAd

  ```typescript
  import { getAd } from "./SDK";

  // stream
  const ads = getAd("stream", CODE_ID);

  // banner
  const ads = getAd("banner", CODE_ID);

  // 定向
  const ads = getAd("stream", CODE_ID, { gender: "man" });
  ```

- getSplashAd

  ```typescript
  import { getSplashAd } from "./SDK";

  // 接入开屏广告需要开发者在平台上创建开屏广告位，并记下code_id
  const splashAds = getSplashAd("CODE_ID");
  ```

- sendClickEvent

  ```typescript
  import { sendClickEvent } from "./SDK";

  const handleClick = () => {
    sendClickEvent("ads_id", "CODE_ID");
  };
  ```

- sendCustomEvent

  ```typescript
  import { sendCustomEvent } from "./SDK";

  const handleShow = () => {
    sendCustomEvent("app_id", "event", "show");
  };

  const handleClick = () => {
    sendCustomEvent("app_id", "event", "click");
  };
  ```

- sendShowEvent

  ```typescript
  import { sendShowEvent } from "./SDK";

  const handleShow = () => {
    sendShowEvent("ads_id", "CODE_ID");
  };
  ```

- Splash

  ```tsx
  interface Splash {
    splashCodeId: string; //开屏广告位
    run: boolean; // 触发开屏
    onGetAdSuccess?: () => void; // 当成功获取到开屏广告
    onCountdown?: () => void; // 当倒计时结束
    onPressBtn?: () => void; // 当点击跳过
  }

  <Splash splashCodeId={SPLASH_CODE_ID} run={showAd} />;
  ```

## example

```typescript
import { useState, useEffect } from "react";
import { View, text, Image } from "react-native";
import { getAd, sendShowEvent, sendClickEvent } from "@/zao/SDK";
import { getNews } from "./apis/news";
import { HOME_STREAM_CODE_ID } from "./constants";

const Home = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const adInfo = await getAd("stream", HOME_STREAM_CODE_ID, {
      gender: "man",
    });
    const news = await getNews();
    const _list = news;
    _list.splice(2, 0, adInfo);
    setList(_list);
  }, []);

  const handleAdShow = (ads_id: string) => {
    sendShowEvent(ads_id, HOME_STREAM_CODE_ID);
  };

  const handleAdClick = (ads_id: string) => {
    sendClickEvent(ads_id, HOME_STREAM_CODE_ID);
  };

  return (
    <View>
      {list.map((i) => (
        <View
          onShow={() => handleAdShow(i.ads_id)}
          onClick={() => handleAdClick(i.ads_id)}
        >
          <Image source={{ uri: i.img }} />
          <Text>{i.title}</Text>
        </View>
      ))}
    </View>
  );
};
```
