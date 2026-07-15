import type { DiagnosisType } from "./diagnosis";

export interface CommunityPost {
  id: number;
  diagnosis: DiagnosisType;
  author: string;
  createdAt: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  views: number;
}