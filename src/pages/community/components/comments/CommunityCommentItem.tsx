import CommunityCommentNode, {
  type CommunityCommentNodeProps,
} from "./CommunityCommentNode";

type CommunityCommentItemProps = Omit<CommunityCommentNodeProps, "depth">;

export default function CommunityCommentItem(props: CommunityCommentItemProps) {
  return <CommunityCommentNode {...props} depth={0} />;
}
