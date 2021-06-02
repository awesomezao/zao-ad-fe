import { useUser } from "@/hooks/useUser";
import AdvertiserFinance from "@/pages/Advertiser/Finance";
import MediaFinance from "@/pages/Media/Finance";
import AdminFinance from '@/pages/Admin/Finance';

const Finance = () => {
  const { user } = useUser();
  return (
    <>
      {user.role === "advertiser" && <AdvertiserFinance />}
      {user.role === "media" && <MediaFinance />}
      {user.role === "admin" && <AdminFinance />}
    </>
  );
};

export default Finance;
