export interface Comment {
  content: string;
  createdAt: string;
  id: number;
  replies?: Comment[];
  avatar?: string;
  name: string;
  isContributor: boolean;
  parentCommentId?: number;
}