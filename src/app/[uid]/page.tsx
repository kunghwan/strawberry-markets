"use client";

import { AUTH } from "@/contexts";
import SellerIdForm from "./SellerIdForm";

const MyPage = () => {
  const { user, updateOne } = AUTH.use();

  if (!user?.sellerId) {
    return <SellerIdForm />;
  }

  //! user.sellerId 가 있어야 상품 보여줄 거임

  return <div>MyPage</div>;
};

export default MyPage;
