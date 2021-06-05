import { Modal } from "antd";
import ReactMarkdown from "react-markdown";
import { useState, useEffect } from "react";
import { useMount } from "ahooks";
import { LightAsync as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomOneDark } from "react-syntax-highlighter/dist/esm/styles/hljs";
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

interface Props {
  doc?: string;
  show: boolean;
  onCancel: () => void;
}

const Access = (props: Props) => {
  const { show, onCancel, doc = "" } = props;

  return (
    <Modal visible={show} onCancel={onCancel} title="接入">
      <ReactMarkdown components={components} children={doc} />
    </Modal>
  );
};

export default Access;
