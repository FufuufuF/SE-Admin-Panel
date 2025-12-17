export interface Post {
  id: number;
  user: {
    id: number;
    nickname: string;
  };
  text: string;
  tags: string[];
  media: {
    type: 'image' | 'video';
    url: string;
  }[];
  stats: {
    commentCount: number;
    avgScore: number;
    scoreCount: number;
  };
  createdAt: string;
  status?: 'pending' | 'passed' | 'failed';
}
