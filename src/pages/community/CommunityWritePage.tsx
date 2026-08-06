import { useEffect, useRef, useState } from "react";
import { useBlocker, useNavigate } from "react-router-dom";

import { getApiErrorMessage } from "@/apis/apiError";
import OnboardCancelBox from "@/components/OnboardCancelBox";
import { showToast } from "@/components/Toast";
import { communityCategoryCodeMap } from "@/constants/communityCategory";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import { useCreateCommunityPost } from "@/hooks/useCommunity";
import type { CommunityPostPayload } from "@/types/community";

import CommunityWriteForm from "./components/write/CommunityWriteForm";

export default function CommunityWritePage() {
  const navigate = useNavigate();
  const { setBreadcrumb } = useBreadcrumb();
  const allowNavigationRef = useRef(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const { mutate: createPost, isPending: isCreatingPost } = useCreateCommunityPost();
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

  const publishPost = (payload: CommunityPostPayload) => {
    if (payload.images.length > 0) {
      showToast("red", "이미지를 등록하려면 커뮤니티 이미지 업로드 API가 필요합니다.");
      return;
    }

    createPost(
      {
        boardType: communityCategoryCodeMap[payload.category],
        anonymityType:
          payload.authorVisibility === "ANONYMOUS" ? "FULLY_ANONYMOUS" : "PROFILE_TAG_VISIBLE",
        title: payload.title,
        content: payload.content,
        disabilityTypes: [],
        imageUrls: [],
      },
      {
        onSuccess: () => {
          allowNavigationRef.current = true;
          showToast("green", "게시물이 성공적으로 등록됐습니다!");
          navigate("/community");
        },
        onError: (error) =>
          showToast("red", getApiErrorMessage(error, "게시물을 등록하지 못했습니다.")),
      },
    );
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

  return (
    <div className="min-h-full bg-background-100 px-[24px] py-[16px]">
      <CommunityWriteForm
        onCancel={() => setShowCancelModal(true)}
        onSubmit={publishPost}
        isSubmitting={isCreatingPost}
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
