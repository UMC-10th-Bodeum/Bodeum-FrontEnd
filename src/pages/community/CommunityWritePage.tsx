import { useEffect, useRef, useState } from "react";
import { useBlocker, useNavigate } from "react-router-dom";

import { getApiErrorMessage, isUnauthorizedError } from "@/apis/apiError";
import { hasStoredAuthSession } from "@/apis/authApi";
import OnboardCancelBox from "@/components/OnboardCancelBox";
import { showToast } from "@/components/Toast";
import { communityCategoryCodeMap } from "@/constants/communityCategory";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useCreateCommunityPost } from "@/hooks/useCommunity";
import { useUserBrief } from "@/hooks/useUser";
import type { CommunityPostPayload } from "@/types/community";

import CommunityWriteForm from "./components/write/CommunityWriteForm";

export default function CommunityWritePage() {
  const navigate = useNavigate();
  const { setBreadcrumb } = useBreadcrumb();
  const allowNavigationRef = useRef(false);
  const submissionInProgressRef = useRef(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWriteAccessAllowed, setIsWriteAccessAllowed] = useState(false);
  const hasShownLoginToast = useRef(false);
  const writeAccessCheckStarted = useRef(false);
  const { refetch: refetchUserBrief } = useUserBrief();
  const { mutateAsync: createPost } = useCreateCommunityPost();
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !allowNavigationRef.current && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    setBreadcrumb([
      { label: "커뮤니티", onClick: () => navigate("/community") },
      { label: "게시글 작성" },
    ]);

    return () => setBreadcrumb([]);
  }, [navigate, setBreadcrumb]);

  useEffect(() => {
    if (blocker.state === "blocked") {
      setShowCancelModal(true);
    }
  }, [blocker.state]);

  useEffect(() => {
    if (writeAccessCheckStarted.current) {
      return;
    }

    writeAccessCheckStarted.current = true;

    const checkWriteAccess = async () => {
      const result = await refetchUserBrief();
      const canWrite =
        !result.isError && hasStoredAuthSession() && result.data?.isLoggedIn === true;

      if (canWrite) {
        setIsWriteAccessAllowed(true);
        return;
      }

      if (!hasShownLoginToast.current) {
        hasShownLoginToast.current = true;
        showToast("blue", "로그인/회원가입 후 만나보세요");
      }

      allowNavigationRef.current = true;
      navigate("/community", { replace: true });
    };

    void checkWriteAccess();
  }, [navigate, refetchUserBrief]);

  const publishPost = (payload: CommunityPostPayload) => {
    if (submissionInProgressRef.current) return;

    submissionInProgressRef.current = true;
    setIsSubmitting(true);

    void (async () => {
      let submissionStage: "upload" | "create" = "upload";

      try {
        const imageUrls: string[] = [];

        if (payload.images.length > 0) {
          const uploads = await Promise.all(
            payload.images.map((file) =>
              import("@/apis/community").then((m) => m.uploadCommunityPostImage(file)),
            ),
          );

          imageUrls.push(...uploads.filter(Boolean));
        }

        submissionStage = "create";
        await createPost({
          boardType: communityCategoryCodeMap[payload.category],
          anonymityType:
            payload.authorVisibility === "ANONYMOUS" ? "FULLY_ANONYMOUS" : "PROFILE_TAG_VISIBLE",
          title: payload.title,
          content: payload.content,
          imageUrls,
        });

        allowNavigationRef.current = true;
        showToast("green", "게시물이 성공적으로 등록됐습니다!");
        navigate("/community");
      } catch (error) {
        if (isUnauthorizedError(error)) {
          showToast("blue", "로그인/회원가입 후 만나보세요");
          setIsWriteAccessAllowed(false);
          allowNavigationRef.current = true;
          navigate("/community", { replace: true });
          return;
        }

        showToast(
          "red",
          getApiErrorMessage(
            error,
            submissionStage === "upload"
              ? "이미지 업로드에 실패했습니다."
              : "게시물을 등록하지 못했습니다.",
          ),
        );
      } finally {
        submissionInProgressRef.current = false;
        setIsSubmitting(false);
      }
    })();
  };

  const continueWriting = () => {
    setShowCancelModal(false);
    if (blocker.state === "blocked") blocker.reset();
  };

  const stopWriting = () => {
    setShowCancelModal(false);

    if (blocker.state === "blocked") {
      blocker.proceed();
      return;
    }

    allowNavigationRef.current = true;
    navigate("/community");
  };

  if (!isWriteAccessAllowed) {
    return <div className="min-h-full bg-background-100" />;
  }

  return (
    <div className="min-h-full bg-background-100 px-[24px] py-[16px]">
      <CommunityWriteForm
        onCancel={() => setShowCancelModal(true)}
        onSubmit={publishPost}
        isSubmitting={isSubmitting}
      />

      {showCancelModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto px-[20px] py-[40px]">
          <OnboardCancelBox
            title="게시글 작성을 멈추시겠어요?"
            description="지금 종료하시면 작성 중이던 내용은 저장되지 않습니다."
            leftButtonText="계속하기"
            rightButtonText="중단하기"
            className="z-[70]!"
            onLeftButtonClick={continueWriting}
            onRightButtonClick={stopWriting}
          />
        </div>
      )}
    </div>
  );
}
