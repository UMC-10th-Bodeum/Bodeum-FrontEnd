import PostTag from "@/components/PostTag";
import Section from "./Section"
import IntroIcon from "@/assets/icons/Paper.svg?react";

interface IntroSectionProps {
  // introduction: string;
  // tags: string[];
}

export default function IntroSection({
  // introduction,
  // tags,
}: IntroSectionProps) {
  return (
    <Section
      title="소개"
      icon={<IntroIcon className="h-[16px] w-[16px] text-gray-700" />}
    >
      <span className="text-h3-onboard text-background-600">
        드림발달클리닉은 강남구 소재 소아·청소년 정신건강 및 발달 전문 의원입니다. 소아정신과 전문의 2인이 상주하며 자폐스펙트럼, ADHD, 발달지연, 불안장애, 틱장애 등 다양한 발달 및 정서 문제를 다루고 있습니다.
        진단평가(발달검사, K-WISC, ADOS 등)부터 약물치료, 심리치료, 부모 코칭 프로그램까지 원스톱으로 제공하며, 발달재활서비스 바우처 연계 기관과의 협력 네트워크도 운영하고 있습니다.
        {/*  {introduction} */}
      </span>
      <div className="mt-[14px]">
        <h4 className="mb-[8px] text-h6 text-background-500">
          전문 분야
        </h4>
        <div className="flex flex-wrap gap-[10px]">
          <PostTag
            type="ETC"
            label="소아정신과"
          />
          <PostTag
            type="ETC"
            label="소아정신과"
          />
          <PostTag
            type="ETC"
            label="소아정신과"
          />
          {/* {tags.map((tag) => (
            <PostTag
              key={tag}
              type="ETC"
              label={tag}
            />
          ))} */}
        </div>
      </div>
    </Section>
  );
}