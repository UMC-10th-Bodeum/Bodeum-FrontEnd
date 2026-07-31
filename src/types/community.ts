import type { DiagnosisType } from "./diagnosis";
import type { CommunityCategory } from "@/constants/communityCategory";

export interface CommunityPost {
  id: number;
  category: CommunityCategory;
  diagnosis: DiagnosisType;
  author: string;
  createdAt: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  views: number;
  imageCount: number;
}

export interface CommunityComment {
  id: number;
  author: string;
  createdAt: string;
  content: string;
  likes: number;
  replies?: CommunityComment[];
}
