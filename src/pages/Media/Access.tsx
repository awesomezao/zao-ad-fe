import PageHeader from "@/components/PageHeader";
import { BoxWrapper } from "@/styles/wrapper";
import { Row, Col } from "antd";
import ReactMarkdown from "react-markdown";
import { useState } from "react";
import AccessDoc from "./Doc/Access.md";
import { useMount } from "ahooks";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
import MarkdownNavbar from "markdown-navbar";
import "markdown-navbar/dist/navbar.css";

const components = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || "");
    return !inline && match ? (
      <SyntaxHighlighter
        style={atomOneDark}
        language={match[1]}
        PreTag="div"
        children={String(children).replace(/\n$/, "")}
        {...props}
      />
    ) : (
      <code className={className} {...props} />
    );
  },
};

const Access = () => {
  const [doc, setDoc] = useState("");
  useMount(() => {
    fetch(AccessDoc)
      .then((res) => res.text())
      .then((text) => {
        setDoc(text);
      });
  });
  return (
    <Row justify="center">
      <Col span={2}>
        <MarkdownNavbar source={doc} />
      </Col>
      <Col span={15} offset={1}>
        <BoxWrapper>
          <PageHeader title="接入文档" />
          <ReactMarkdown components={components} children={doc} />
        </BoxWrapper>
      </Col>
    </Row>
  );
};

export default Access;
