import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { uploadCommunityPostImage } from "@/apis/communityApi";
import { showToast } from "@/components/Toast";
import {
  communityCategoryCodeMap,
  getCommunityCategoryByCode,
} from "@/constants/communityCategory";
import {
  useCommunityPost,
  useCreateCommunityPost,
  useUpdateCommunityPost,
} from "@/hooks/useCommunity";
import { useLoginCheck } from "@/hooks/useLoginCheck";
import type {
  CommunityPostFormInitialValues,
  CommunityPostFormValues,
} from "@/types/community";
import useCommunityMutationError from "./useCommunityMutationError";

type EditorStatus = "checking-access" | "loading" | "error" | "redirecting" | "ready";
type SubmissionStage = "upload" | "create" | "update";

interface UseCommunityPostEditorParams {
  allowNavigation: () => void;
}

function parsePostId(value: string | undefined) {
  if (!value || !/^\d+$/.test(value)) return undefined;

  const postId = Number(value);
  return Number.isSafeInteger(postId) && postId > 0 ? postId : undefined;
}

export function useCommunityPostEditor({ allowNavigation }: UseCommunityPostEditorParams) {
  const { postId: postIdParam } = useParams();
  const navigate = useNavigate();
  const [isPageAccessAllowed, setIsPageAccessAllowed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasHandledLoginRequired = useRef(false);
  const submissionInProgressRef = useRef(false);
  const { runAfterLoginCheck } = useLoginCheck();
  const { mutateAsync: createPost } = useCreateCommunityPost();
  const isEditMode = postIdParam !== undefined;
  const postId = parsePostId(postIdParam);
  const {
    data: post,
    isPending: isPostPending,
    isError: isPostError,
  } = useCommunityPost(isEditMode && isPageAccessAllowed ? postId : undefined);
  const { mutateAsync: updatePost } = useUpdateCommunityPost(postId ?? 0);
  const cancelPath = isEditMode && postId ? `/community/${postId}` : "/community";

  const redirectToLogin = useCallback(() => {
    if (hasHandledLoginRequired.current) return;
    hasHandledLoginRequired.current = true;
    setIsPageAccessAllowed(false);
    allowNavigation();
    navigate("/community", { replace: true, state: { showLoginModal: true } });
  }, [allowNavigation, navigate]);
  const showMutationError = useCommunityMutationError(redirectToLogin);

  useEffect(() => {
    void runAfterLoginCheck(
      () => setIsPageAccessAllowed(true),
      redirectToLogin,
    );
  }, [redirectToLogin, runAfterLoginCheck]);

  useEffect(() => {
    if (!isEditMode || !post || post.isMine) return;

    allowNavigation();
    showToast("red", "본인이 작성한 게시글만 수정할 수 있습니다.");
    navigate(`/community/${post.postId}`, { replace: true });
  }, [allowNavigation, isEditMode, navigate, post]);

  const initialValues = useMemo<CommunityPostFormInitialValues | undefined>(
    () =>
      post
        ? {
            category: getCommunityCategoryByCode(post.boardType),
            authorVisibility:
              post.anonymityType === "FULLY_ANONYMOUS" ? "ANONYMOUS" : "PROFILE",
            title: post.title,
            content: post.content,
            existingImageUrls: post.imageUrls,
          }
        : undefined,
    [post],
  );

  const submitPost = useCallback(
    async (payload: CommunityPostFormValues) => {
      if (submissionInProgressRef.current) return;

      submissionInProgressRef.current = true;
      setIsSubmitting(true);
      let submissionStage: SubmissionStage = "upload";

      try {
        const uploadedImageUrls = await Promise.all(
          payload.images.map(uploadCommunityPostImage),
        );
        const request = {
          boardType: communityCategoryCodeMap[payload.category],
          anonymityType:
            payload.authorVisibility === "ANONYMOUS"
              ? ("FULLY_ANONYMOUS" as const)
              : ("PROFILE_TAG_VISIBLE" as const),
          title: payload.title,
          content: payload.content,
          imageUrls: isEditMode
            ? [...payload.existingImageUrls, ...uploadedImageUrls.filter(Boolean)]
            : uploadedImageUrls.filter(Boolean),
        };

        if (isEditMode) {
          submissionStage = "update";
          await updatePost(request);
        } else {
          submissionStage = "create";
          await createPost(request);
        }

        allowNavigation();
        showToast(
          "green",
          isEditMode ? "게시글이 수정되었습니다." : "게시물이 성공적으로 등록됐습니다!",
        );
        navigate(cancelPath);
      } catch (error) {
        const fallbackMessage =
          submissionStage === "upload"
            ? "이미지 업로드에 실패했습니다."
            : submissionStage === "update"
              ? "게시글을 수정하지 못했습니다."
              : "게시물을 등록하지 못했습니다.";
        showMutationError(error, fallbackMessage);
      } finally {
        submissionInProgressRef.current = false;
        setIsSubmitting(false);
      }
    },
    [
      allowNavigation,
      cancelPath,
      createPost,
      isEditMode,
      navigate,
      showMutationError,
      updatePost,
    ],
  );

  let status: EditorStatus = "ready";
  if (!isPageAccessAllowed) status = "checking-access";
  else if (isEditMode && postId === undefined) status = "error";
  else if (isEditMode && isPostPending) status = "loading";
  else if (isEditMode && (isPostError || !post)) status = "error";
  else if (isEditMode && post && !post.isMine) status = "redirecting";

  return {
    status,
    isEditMode,
    postId,
    post,
    initialValues,
    isSubmitting,
    submitPost,
  };
}
