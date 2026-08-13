import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AsyncState from "@/components/AsyncState";
import OnboardCancelBox from "@/components/OnboardCancelBox";
import { useBreadcrumb } from "@/contexts/BreadcrumbContext";

import CommunityWriteForm from "./components/write/CommunityWriteForm";
import { useCommunityPostEditor } from "./hooks/useCommunityPostEditor";
import { useCommunityEditorNavigation } from "./hooks/useCommunityEditorNavigation";

export default function CommunityWritePage() {
  const { postId: postIdParam } = useParams();
  const navigate = useNavigate();
  const { setBreadcrumb } = useBreadcrumb();
  const isEditRoute = postIdParam !== undefined;
  const cancelPath = isEditRoute ? `/community/${postIdParam}` : "/community";
  const navigation = useCommunityEditorNavigation({ cancelPath });
  const editor = useCommunityPostEditor({ allowNavigation: navigation.allowNavigation });

  useEffect(() => {
    setBreadcrumb([
      { label: "커뮤니티", onClick: () => navigate("/community") },
      { label: editor.isEditMode ? "게시글 수정" : "게시글 작성" },
    ]);

    return () => setBreadcrumb([]);
  }, [editor.isEditMode, navigate, setBreadcrumb]);

  if (editor.status === "checking-access" || editor.status === "redirecting") {
    return <div className="min-h-full bg-background-100" />;
  }

  if (editor.status === "loading") {
    return <AsyncState type="loading" />;
  }

  if (editor.status === "error") {
    return <AsyncState type="error" />;
  }

  return (
    <div className="min-h-full bg-background-100 px-[24px] py-[16px]">
      <CommunityWriteForm
        key={editor.post?.postId ?? "create"}
        onCancel={navigation.requestCancel}
        onSubmit={editor.submitPost}
        isSubmitting={editor.isSubmitting}
        initialValues={editor.initialValues}
        submitLabel={editor.isEditMode ? "수정하기" : undefined}
      />

      {navigation.isCancelModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto px-[20px] py-[40px]">
          <OnboardCancelBox
            title={
              editor.isEditMode
                ? "게시글 수정을 멈추시겠어요?"
                : "게시글 작성을 멈추시겠어요?"
            }
            description={
              editor.isEditMode
                ? "지금 종료하시면 수정 중이던 내용은 저장되지 않습니다."
                : "지금 종료하시면 작성 중이던 내용은 저장되지 않습니다."
            }
            leftButtonText="계속하기"
            rightButtonText="중단하기"
            className="z-[70]!"
            onLeftButtonClick={navigation.continueEditing}
            onRightButtonClick={navigation.cancelEditing}
          />
        </div>
      )}
    </div>
  );
}
