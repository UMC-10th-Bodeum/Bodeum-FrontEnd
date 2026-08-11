import ProfileIcon from "@/assets/icons/Profile.svg?react";
import OnboardButton from "./OnboardButton";
import { useNavigate } from "react-router-dom";

interface UserSectionProps {
  type: "guest" | "parent" | "empty";
  name?: string;
  disability?: string;
  level?: number;
  age?: number;
  profileImageUrl?: string | null;
  onButtonClick?: () => void;
}

export default function UserSection({
  type,
  name,
  disability,
  level,
  age,
  profileImageUrl,
  onButtonClick,
}: UserSectionProps) {
  const navigate = useNavigate();

  const isGuest = type === "guest";
  const isEmpty = type === "empty";

  const childSummary = [
    level !== undefined ? `Level${level}` : null,
    age !== undefined ? `${age}세 아이` : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <div className="rounded-[8px] border border-background-250 bg-background-100">
      <div className="flex w-[181px] px-[8px] py-[12px]">
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt="프로필"
            className="mr-[9px] h-[30px] w-[30px] shrink-0 rounded-full object-cover"
          />
        ) : (
          <ProfileIcon className="mr-[9px] h-[30px] w-[30px] shrink-0" />
        )}

        <div className="mr-[4px] flex min-w-0 flex-1 flex-col">
          <h3 className="truncate text-h4-list text-background-600">
            {isGuest ? "환영합니다!" : `${name ?? "___"}님`}
          </h3>

          {isGuest ? (
            <p className="mt-2 text-body-sub text-background-500">
              회원가입을 통해 더 많은
              <br />
              기능을 확인할 수 있어요
            </p>
          ) : !isEmpty ? (
            <>
              <p
                className="mt-2 truncate text-body-sub text-background-500"
                title={disability}
              >
                {disability ?? "-"}
              </p>

              <p className="text-body-sub text-background-500">
                {childSummary || "자녀 정보 미등록"}
              </p>
            </>
          ) : null}
        </div>
      </div>

      <div className="px-[8px] pb-[12px]">
        {isEmpty ? (
          <div className="flex flex-col gap-2">
            <OnboardButton
              variant="profile"
              onClick={onButtonClick}
            >
              맞춤 프로필 생성
            </OnboardButton>

            <OnboardButton
              variant="secondary"
              onClick={() => navigate("/mypage")}
            >
              마이페이지
            </OnboardButton>
          </div>
        ) : (
          <OnboardButton
            variant={isGuest ? "primary" : "secondary"}
            onClick={onButtonClick}
          >
            {isGuest ? "로그인 / 회원가입" : "마이페이지"}
          </OnboardButton>
        )}
      </div>
    </div>
  );
}
