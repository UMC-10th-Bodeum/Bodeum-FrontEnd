import ProfileIcon from "@/assets/icons/Profile.svg?react";
import OnboardButton from "./OnboardButton";

interface UserSectionProps {
  type: "guest" | "parent" | "empty";
  name?: string;
  disability?: string;
  level?: number;
  age?: number;
  onButtonClick?: () => void;
}

export default function UserSection({
  type,
  name,
  disability,
  level,
  age,
  onButtonClick,
}: UserSectionProps) {
  const isGuest = type === "guest";
  const isEmpty = type === "empty";

  return (
    <div className="rounded-[8px] border border-background-300 bg-background-100">
      <div className="flex px-[8px] py-[12px]">
        <ProfileIcon className="w-[30px] h-[30px] mr-[9px]" />

        <div className="flex flex-col mr-[12px]">
          <h3 className="text-h4-list text-background-600">
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
              <p className="mt-2 text-body-sub text-background-500">
                {disability ?? "-"}
              </p>

              <p className="text-body-sub text-background-500">
                Level{level ?? "-"} · {age ?? "-"}세 아이
              </p>
            </>
          ) : null}
        </div>
      </div>

      <div className="px-[16px] pb-[12px]">
        <OnboardButton
          variant={isGuest ? "primary" : "secondary"}
          onClick={onButtonClick}
        >
          {isGuest
            ? "로그인 / 회원가입"
            : isEmpty
              ? "맞춤 프로필 생성"
              : "마이페이지"}
        </OnboardButton>
      </div>
    </div>
  );
}