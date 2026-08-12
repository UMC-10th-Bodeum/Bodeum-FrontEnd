import { useEffect, useRef, useState, type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { AUTH_STATE_CHANGED_EVENT, hasStoredAuthSession } from "@/apis/authApi";
import { showToast } from "@/components/Toast";

interface ProtectedRouteProps {
  children: ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(hasStoredAuthSession);
  const hasShownLoginRequiredToast = useRef(false);

  useEffect(() => {
    const syncAuthState = () => {
      setIsLoggedIn(hasStoredAuthSession());
    };

    window.addEventListener(AUTH_STATE_CHANGED_EVENT, syncAuthState);

    return () => {
      window.removeEventListener(AUTH_STATE_CHANGED_EVENT, syncAuthState);
    };
  }, []);

  useEffect(() => {
    if (isLoggedIn || hasShownLoginRequiredToast.current) {
      return;
    }

    hasShownLoginRequiredToast.current = true;
    showToast("blue", "로그인/회원가입 후 만나보세요");
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return children;
}
