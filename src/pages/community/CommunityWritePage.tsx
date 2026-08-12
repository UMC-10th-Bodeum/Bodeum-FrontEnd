import { useEffect, useRef, useState } from "react";
import { useBlocker, useNavigate, useParams } from "react-router-dom";

import { getApiErrorMessage, isUnauthorizedError } from "@/apis/apiError";
import { uploadCommunityPostImage } from "@/apis/community";
import OnboardCancelBox from "@/components/OnboardCancelBox";
import AsyncState from "@/components/AsyncState";
import { showToast } from "@/components/Toast";
import {
  communityCategoryCodeMap,
  getCommunityCategoryByCode,
} from "@/constants/communityCategory";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";
import {
  useCommunityPost,
  useCreateCommunityPost,
  useUpdateCommunityPost,
} from "@/hooks/useCommunity";
import { useLoginCheck } from "@/hooks/useLoginCheck";
import type { CommunityPostPayload } from "@/types/community";

import CommunityWriteForm from "./components/write/CommunityWriteForm";

export default function CommunityWritePage() {
  const { postId: postIdParam } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumb } = useBreadcrumb();
  const allowNavigationRef = useRef(false);
  const submissionInProgressRef = useRef(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isWriteAccessAllowed, setIsWriteAccessAllowed] = useState(false);
  const hasHandledLoginRequired = useRef(false);
  const { runAfterLoginCheck } = useLoginCheck();
  const { mutateAsync: createPost } = useCreateCommunityPost();
  const isEditMode = postIdParam !== undefined;
  const parsedPostId = postIdParam && /^\d+$/.test(postIdParam) ? Number(postIdParam) : undefined;
  const editPostId =
    parsedPostId !== undefined && Number.isSafeInteger(parsedPostId) && parsedPostId > 0
      ? parsedPostId
      : undefined;
  const {
    data: post,
    isPending: isPostPending,
    isError: isPostError,
  } = useCommunityPost(isEditMode && isWriteAccessAllowed ? editPostId : undefined);
  const { mutateAsync: updatePost } = useUpdateCommunityPost(editPostId ?? 0);
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      !allowNavigationRef.current && currentLocation.pathname !== nextLocation.pathname,
  );

  useEffect(() => {
    setBreadcrumb([
      { label: "커뮤니티", onClick: () => navigate("/community") },
      { label: isEditMode ? "게시글 수정" : "게시글 작성" },
    ]);

    return () => setBreadcrumb([]);
  }, [isEditMode, navigate, setBreadcrumb]);

  useEffect(() => {
    if (!isEditMode || !post || post.isMine) return;

    allowNavigationRef.current = true;
    showToast("red", "본인이 작성한 게시글만 수정할 수 있습니다.");
    navigate(`/community/${post.postId}`, { replace: true });
  }, [isEditMode, navigate, post]);

  useEffect(() => {
    if (blocker.state === "blocked") {
      setShowCancelModal(true);
    }
  }, [blocker.state]);

  useEffect(() => {
    void runAfterLoginCheck(
      () => {
        setIsWriteAccessAllowed(true);
      },
      () => {
        if (hasHandledLoginRequired.current) return;
        hasHandledLoginRequired.current = true;

        allowNavigationRef.current = true;
        navigate("/community", { replace: true, state: { showLoginModal: true } });
      },
    );
  }, [navigate, runAfterLoginCheck]);

  const publishPost = (payload: CommunityPostPayload) => {
    if (submissionInProgressRef.current) return;

    submissionInProgressRef.current = true;
    setIsSubmitting(true);

    void (async () => {
      let submissionStage: "upload" | "create" | "update" = "upload";

      try {
        const uploadedImageUrls: string[] = [];

        if (payload.images.length > 0) {
          const uploads = await Promise.all(payload.images.map(uploadCommunityPostImage));

          uploadedImageUrls.push(...uploads.filter(Boolean));
        }

        const request = {
          boardType: communityCategoryCodeMap[payload.category],
          anonymityType:
            payload.authorVisibility === "ANONYMOUS"
              ? ("FULLY_ANONYMOUS" as const)
              : ("PROFILE_TAG_VISIBLE" as const),
          title: payload.title,
          content: payload.content,
          imageUrls: isEditMode
            ? [...payload.existingImageUrls, ...uploadedImageUrls]
            : uploadedImageUrls,
        };

        if (isEditMode) {
          submissionStage = "update";
          await updatePost(request);
        } else {
          submissionStage = "create";
          await createPost(request);
        }

        allowNavigationRef.current = true;
        showToast(
          "green",
          isEditMode ? "게시글이 수정되었습니다." : "게시물이 성공적으로 등록됐습니다!",
        );
        navigate(isEditMode && editPostId ? `/community/${editPostId}` : "/community");
      } catch (error) {
        if (isUnauthorizedError(error)) {
          setIsWriteAccessAllowed(false);
          allowNavigationRef.current = true;
          navigate("/community", { replace: true, state: { showLoginModal: true } });
          return;
        }

        showToast(
          "red",
          getApiErrorMessage(
            error,
            submissionStage === "upload"
              ? "이미지 업로드에 실패했습니다."
              : submissionStage === "update"
                ? "게시글을 수정하지 못했습니다."
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
    navigate(isEditMode && editPostId ? `/community/${editPostId}` : "/community");
  };

  if (!isWriteAccessAllowed) {
    return <div className="min-h-full bg-background-100" />;
  }

  if (isEditMode && editPostId === undefined) {
    return <AsyncState type="error" />;
  }

  if (isEditMode && isPostPending) {
    return <AsyncState type="loading" />;
  }

  if (isEditMode && (isPostError || !post || !post.isMine)) {
    return post && !post.isMine ? null : <AsyncState type="error" />;
  }

  const initialValues = post
    ? {
        category: getCommunityCategoryByCode(post.boardType),
        authorVisibility:
          post.anonymityType === "FULLY_ANONYMOUS" ? ("ANONYMOUS" as const) : ("PROFILE" as const),
        title: post.title,
        content: post.content,
        existingImageUrls: post.imageUrls,
      }
    : undefined;

  return (
    <div className="min-h-full bg-background-100 px-[24px] py-[16px]">
      <CommunityWriteForm
        key={post?.postId ?? "create"}
        onCancel={() => setShowCancelModal(true)}
        onSubmit={publishPost}
        isSubmitting={isSubmitting}
        initialValues={initialValues}
        submitLabel={isEditMode ? "수정하기" : undefined}
      />

      {showCancelModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto px-[20px] py-[40px]">
          <OnboardCancelBox
            title={
              isEditMode
                ? "게시글 수정을 멈추시겠어요?"
                : "게시글 작성을 멈추시겠어요?"
            }
            description={
              isEditMode
                ? "지금 종료하시면 수정 중이던 내용은 저장되지 않습니다."
                : "지금 종료하시면 작성 중이던 내용은 저장되지 않습니다."
            }
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
