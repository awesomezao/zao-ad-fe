import { useState, useEffect } from "react";
import { Menu } from "antd";
import { useHistory } from "react-router-dom";
const { Item, SubMenu } = Menu;

interface Props {
  title: string;
  prePath: string;
  data: { value: string; label: string }[];
}

const useSideMenu = (props: Props) => {
  const { title, prePath, data } = props;
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
      style={{ width: "100%", height: "calc(100vh - 51px)" }}
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