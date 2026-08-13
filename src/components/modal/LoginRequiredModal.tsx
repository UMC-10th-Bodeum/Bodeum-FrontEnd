import { useNavigate } from "react-router-dom";
import OnboardCancelBox from "@/components/OnboardCancelBox";
import Modal from "./Modal";

interface LoginRequiredModalProps {
  open: boolean;
  onClose: () => void;
}

export default function LoginRequiredModal({
  open,
  onClose,
}: LoginRequiredModalProps) {
  const navigate = useNavigate();

  return (
    <Modal open={open} onClose={onClose}>
      <OnboardCancelBox
        title="로그인하고 더 많은 기능을 이용해 보세요!"
        description={`회원가입 후 프로필을 등록하시면,
          AI 챗봇 질문, 정보 저장, 커뮤니티 활동을 제한 없이
          자유롭게 이용하실 수 있습니다.`}
        leftButtonText="둘러보기"
        rightButtonText="로그인/회원가입"
        onLeftButtonClick={onClose}
        onRightButtonClick={() => navigate("/auth")}
      />
    </Modal>
  );
}