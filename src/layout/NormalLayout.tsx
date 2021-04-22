import React from "react";
import Header from "@/components/Header";

const NormalLayout: React.FC<{}> = ({ children }) => {
  return (
    <div>
      <Header />
      <div>{children}</div>
    </div>
  );
};

export default NormalLayout;
