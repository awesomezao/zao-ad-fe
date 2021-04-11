import styled from "@emotion/styled";
import { css } from "@emotion/react";

interface IContainerWrapper {
  center?: boolean;
  horizontalCenter?: boolean; // 水平居中
  verticalCenter?: boolean; // 垂直居中
  top?: string;
}
const containerWrapperCss = (props: IContainerWrapper) => {
  if (props.center) {
    return css`
      margin: 0 auto;
      top: 50%;
      transform: translateY(-50%);
    `;
  }
  if (props.horizontalCenter) {
    return css`
      top: ${props.top};
      margin: 0 auto;
    `;
  }
  if (props.verticalCenter) {
    return css`
      top: 50%;
      transform: translateY(-50%);
    `;
  }
  if (props.top) {
    return css`
      top: ${props.top};
    `;
  }
};
export const ContainerWrapper = styled.div`
  position: relative;
  ${containerWrapperCss}
`;

interface IFlexWrapper {
  flexColumn?: boolean;
  flexCenter?: boolean;
  justifyContentCenter?: boolean;
  alignItemsCenter?: boolean;
  justifyContent?:
    | "flex-start"
    | "flex-end"
    | "center"
    | "space-between"
    | "space-around"
    | "initial"
    | "inherit";
  alignItems?:
    | "stretch"
    | "center"
    | "flex-start"
    | "flex-end"
    | "baseline"
    | "initial"
    | "inherit";
}
export const FlexWrapper = styled(ContainerWrapper)`
  display: flex;
  flex-direction: ${(props: IFlexWrapper) => (props.flexColumn ? "column" : "row")};
  justify-content: ${(props: IFlexWrapper) => {
    if (props.flexCenter || props.justifyContentCenter) {
      return "center";
    } else {
      return props.justifyContent;
    }
  }};
  align-items: ${(props: IFlexWrapper) => {
    if (props.flexCenter || props.alignItemsCenter) {
      return "center";
    } else {
      return props.justifyContent;
    }
  }};
`;
