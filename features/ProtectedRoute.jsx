
'use client';

import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
      } else {
        setIsAuth(true);
      }
    }
  }, []);

  if (isAuth === null) return null;

  return children;
}
