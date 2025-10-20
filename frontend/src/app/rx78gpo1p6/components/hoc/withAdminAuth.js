"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const withAdminAuth = (WrappedComponent) => {
  return function Protected(props) {
    const router = useRouter();
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem("adminToken");
      console.log("Cek token:", token); // tambahkan ini

      if (!token) {
        router.replace("/rx78gpo1p6/login");
      } else {
        setIsAllowed(true);
      }
    }, []);

    if (!isAllowed) return null;
    console.log(
      "Token yang dicek di admin:",
      localStorage.getItem("adminToken")
    );

    return <WrappedComponent {...props} />;
  };
};

export default withAdminAuth;
