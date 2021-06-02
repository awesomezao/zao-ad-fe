import { useState, useEffect } from "react";
import { Menu } from "antd";
import { useHistory } from "react-router-dom";
const { Item, SubMenu } = Menu;

interface Props {
  title: string;
  prePath: string;
  data: { value: string; label: string }[];
  height?: "100vh" | "100%";
}

const useSideMenu = (props: Props) => {
  const { title, prePath, data, height = "100vh" } = props;
  const [current, setCurrent] = useState(prePath);
  const history = useHistory();

  const handleClick = (e: any) => {
    setCurrent(e.key);
    history.push(e.key);
  };

  useEffect(() => {
    setCurrent(history.location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sideMenu = (
    <Menu
      className="menu"
      onClick={handleClick}
      selectedKeys={[current]}
      mode="inline"
      style={{
        width: "100%",
        height: height === "100vh" ? "calc(100vh - 51px)" : "100%",
      }}
      defaultOpenKeys={[prePath]}
      defaultSelectedKeys={[current]}
    >
      <SubMenu key={prePath} title={title}>
        {data.map((i) => (
          <Item key={i.value}>{i.label}</Item>
        ))}
      </SubMenu>
    </Menu>
  );

  return { sideMenu };
};

export default useSideMenu;
