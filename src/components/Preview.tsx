import styled from "@emotion/styled";
import { Image } from "antd";
import { emptyImg } from "@/constants";
import phoneImg from "@/assets/images/phone.png";

const Wrapper = styled.div`
  position: relative;
  width: 270.68px;
  height: 530px;
  background: url(${phoneImg}) center;
  background-size: cover;
  .img {
    position: absolute;
    top: ${(props: { layout: string }) =>
      props.layout === "horizontal" ? "145px" : "46px"};
    left: ${(props: { layout: string }) =>
      props.layout === "horizontal" ? "28px" : "12px"};
  }
`;

interface Props {
  layout: string;
  src: string;
}

const Preview = (props: Props) => {
  const { layout, src } = props;
  return (
    <Wrapper layout={layout}>
      <div className="img">
        <Image
          // style={{ border: "1px dashed #d9d9d9" }}
          src={src}
          width={layout === "horizontal" ? "212PX" : "247px"}
          height={layout === "horizontal" ? "119.25px" : "439PX"}
          fallback={emptyImg}
        />
      </div>
    </Wrapper>
  );
};

export default Preview;
