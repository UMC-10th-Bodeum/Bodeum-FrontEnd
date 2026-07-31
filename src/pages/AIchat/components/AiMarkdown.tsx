import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

type AiMarkdownProps = {
  children: string;
};

const markdownComponents: Components = {
  a: ({ children, href }) => {
    if (!href) return <>{children}</>;

    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-main-400 underline underline-offset-2"
      >
        {children}
      </a>
    );
  },
  img: ({ alt }) => (alt ? <span>{alt}</span> : null),
};

export default function AiMarkdown({ children }: AiMarkdownProps) {
  return (
    <div
      className="w-full min-w-0 break-words text-h3-onboard text-background-600
        [&_p]:whitespace-pre-wrap [&_p:not(:first-child)]:mt-[10px]
        [&_h1]:text-h3-category [&_h2]:text-h3-category-sub
        [&_h3]:text-h3-category-sub [&_h4]:font-medium [&_h5]:font-medium
        [&_h6]:font-medium [&_h1:not(:first-child)]:mt-[14px]
        [&_h2:not(:first-child)]:mt-[14px] [&_h3:not(:first-child)]:mt-[12px]
        [&_h4:not(:first-child)]:mt-[12px] [&_h5:not(:first-child)]:mt-[12px]
        [&_h6:not(:first-child)]:mt-[12px] [&_ul]:my-[8px] [&_ul]:list-disc
        [&_ul]:pl-[22px] [&_ol]:my-[8px] [&_ol]:list-decimal [&_ol]:pl-[22px]
        [&_li+li]:mt-[4px] [&_li>p]:mt-0 [&_blockquote]:my-[10px]
        [&_blockquote]:border-l-[3px] [&_blockquote]:border-main-300
        [&_blockquote]:pl-[12px] [&_blockquote]:text-background-500
        [&_code]:rounded-[4px] [&_code]:bg-background-200 [&_code]:px-[4px]
        [&_code]:py-[1px] [&_pre]:my-[10px] [&_pre]:overflow-x-auto
        [&_pre]:rounded-[8px] [&_pre]:bg-background-200 [&_pre]:p-[12px]
        [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_hr]:my-[12px]
        [&_hr]:border-background-250 [&_table]:my-[10px] [&_table]:w-full
        [&_table]:border-collapse [&_th]:border [&_th]:border-background-250
        [&_th]:bg-background-200 [&_th]:px-[8px] [&_th]:py-[6px]
        [&_th]:text-left [&_td]:border [&_td]:border-background-250
        [&_td]:px-[8px] [&_td]:py-[6px] [&_input]:mr-[6px]"
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={markdownComponents}
        skipHtml
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
