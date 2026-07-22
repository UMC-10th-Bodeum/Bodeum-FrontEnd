import PostTag from "@/components/PostTag";
import Section from "./Section"
import IntroIcon from "@/assets/icons/Paper.svg?react";

interface IntroSectionProps {
  introduction: string;
  tags: string[];
}

export default function IntroSection({
  introduction,
  tags,
}: IntroSectionProps) {
  return (
    <Section
      title="소개"
      icon={<IntroIcon className="size-5 text-gray-700" />}
    >
      <span className="text-h3-onboard text-background-600">
        {introduction}
      </span>
      <div className="mt-[14px]">
        <h4 className="mb-[8px] text-h6 text-background-500"> 
          전문 분야 
        </h4>
        <div className="flex flex-wrap gap-[10px]">
          {tags.map((tag) => (
            <PostTag
              key={tag}
              type="ETC"
              label={tag}
            />
          ))}
        </div>
      </div>
    </Section>
  );
}