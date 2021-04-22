import { ReactElement, useState } from "react";
import styled from "@emotion/styled";
import { useUpdateEffect } from "ahooks";
import userEmptyImg from "@/assets/images/user_empty.png";

interface Props {
  bind: any;
  className?: string;
  initialData?: any;
  showEdit?: boolean;
  allowEdit?: boolean;
}

const AvatarWrapper = styled.div`
  display: flex;
  justify-content: center;
  label {
    img {
      display: block;
      border-radius: 50%;
      background-size: 80px 80px;
      width: 80px;
      height: 80px;
      box-shadow: 0 1px 3px 0 rgb(18 18 18 / 10%);
    }
    input {
      width: 0;
      height: 0;
      opacity: 0;
    }

    a {
      display: block;
      cursor: pointer;
      text-decoration: underline;
      color: rgba(61, 171, 255, 1);
      line-height: 20px;
      text-align: center;
      margin-top: 10px;
    }
  }
`;

function Avatar({
  bind,
  className,
  showEdit,
  allowEdit,
  initialData = userEmptyImg,
}: Props): ReactElement {
  const [avatar, setAvatar] = useState(initialData);
  const uploadImg = (e: any) => {
    const files = e.target.files;
    if (files && files[0]) {
      let reader: FileReader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (e) => {
        setAvatar(e.target?.result);
        bind(files[0]);
      };
    }
  };
  useUpdateEffect(() => {
    if (typeof initialData === "string") {
      setAvatar(initialData);
    } else {
      let reader: FileReader = new FileReader();
      reader.readAsDataURL(initialData);
      reader.onload = (e) => {
        setAvatar(e.target?.result);
      };
    }
  }, [initialData]);
  return (
    <AvatarWrapper>
      <label>
        <img src={avatar} alt="" />
        {allowEdit ? <input onChange={uploadImg} type="file" /> : null}
        {showEdit ? <a>编辑</a> : null}
      </label>
    </AvatarWrapper>
  );
}

export default Avatar;
