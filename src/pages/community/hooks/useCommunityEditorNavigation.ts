import { useCallback, useEffect, useRef, useState } from "react";
import { useBlocker, useNavigate } from "react-router-dom";

interface UseCommunityEditorNavigationParams {
  cancelPath: string;
}

export function useCommunityEditorNavigation({
  cancelPath,
}: UseCommunityEditorNavigationParams) {
  const navigate = useNavigate();
  const allowNavigationRef = useRef(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !allowNavigationRef.current && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    if (blocker.state === "blocked") {
      setIsCancelModalOpen(true);
    }
  }, [blocker.state]);

  const allowNavigation = useCallback(() => {
    allowNavigationRef.current = true;
  }, []);

  const requestCancel = useCallback(() => {
    setIsCancelModalOpen(true);
  }, []);

  const continueEditing = useCallback(() => {
    setIsCancelModalOpen(false);
    if (blocker.state === "blocked") blocker.reset();
  }, [blocker]);

  const cancelEditing = useCallback(() => {
    setIsCancelModalOpen(false);

    if (blocker.state === "blocked") {
      blocker.proceed();
      return;
    }

    allowNavigationRef.current = true;
    navigate(cancelPath);
  }, [blocker, cancelPath, navigate]);

  return {
    isCancelModalOpen,
    allowNavigation,
    requestCancel,
    continueEditing,
    cancelEditing,
  };
}
