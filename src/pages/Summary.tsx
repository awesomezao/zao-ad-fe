import { useUser } from "@/hooks/useUser";
import AdvertiserSummary from "@/pages/Advertiser/Summary";
import MediaSummary from "@/pages/Media/Summary";
import { useMount } from "ahooks";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";
// import Review from "@/pages/Admin/Review";

const Summary = () => {
  const { user } = useUser();
  const history = useHistory();

  useMount(() => {
    console.log(user);
    if (user.role === "admin") {
      history.push("/admin/app");
    }
  });
  return (
    <>
      {user.role === "media" && <MediaSummary />}
      {user.role === "advertiser" && <AdvertiserSummary />}
      {/* {user.role === "admin" && <Review />} */}
    </>
  );
};

export default Summary;
