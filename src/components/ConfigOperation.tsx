import { Button } from "antd";
import styled from "@emotion/styled";

interface Props {
  text: string;
  onClick: () => void;
  extra?: string;
}

const Wrapper = styled.div`
  padding: 9px 0px;
  .btn-text {
    color: #999;
    margin-left: 15px;
    font-size: 12px;
    display: inline-block;
  }
`;

const ConfigOperation = ({ text, onClick, extra = "" }: Props) => {
  return (
    <Wrapper>
      <Button type="primary" onClick={onClick}>
        {text}
      </Button>
      {extra ? <div className="btn-text">{extra}</div> : null}
    </Wrapper>
  );
};

export default ConfigOperation;
