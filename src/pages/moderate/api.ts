import type { ApiResponse } from '@/api/core/types';
import type { Post } from '@/types';

export interface PostRequest {
  page?: number;
  pageSize?: number;
  dateFrom?: string;
  dateTo?: string;
  keyword?: string;
}

export interface PostResponse {
  total: number;
  list: Post[];
}

const mockPosts: Post[] = [
  {
    id: 101,
    user: {
      id: 501,
      nickname: '极客小明',
    },
    text: '今天的天气真不错，适合出去写代码 ☀️',
    tags: ['生活', '摄影'],
    media: [
      {
        type: 'image',
        url: 'https://picsum.photos/id/10/800/600',
      },
      {
        type: 'image',
        url: 'https://picsum.photos/id/11/800/600',
      },
    ],
    stats: {
      commentCount: 12,
      avgScore: 4.8,
      scoreCount: 45,
    },
    createdAt: '2025-12-15T10:30:00Z',
  },
  {
    id: 102,
    user: {
      id: 502,
      nickname: 'TechGuru',
    },
    text: '分享一个关于 TypeScript 高级技巧的短视频，干货满满！',
    tags: ['编程', 'TypeScript', '教程'],
    media: [
      {
        type: 'video',
        url: 'https://www.w3schools.com/html/mov_bbb.mp4',
      },
    ],
    stats: {
      commentCount: 85,
      avgScore: 4.9,
      scoreCount: 320,
    },
    createdAt: '2025-12-16T08:15:00Z',
  },
  {
    id: 103,
    user: {
      id: 503,
      nickname: '美食家老张',
    },
    text: '这家店的拉面味道真的很正宗，强烈推荐！',
    tags: ['美食探店', '日常'],
    media: [
      {
        type: 'image',
        url: 'https://picsum.photos/id/292/800/600',
      },
    ],
    stats: {
      commentCount: 5,
      avgScore: 4.2,
      scoreCount: 18,
    },
    createdAt: '2025-12-16T18:45:22Z',
  },
  {
    id: 104,
    user: {
      id: 504,
      nickname: '旅行者Echo',
    },
    text: '从雪山脚下发来的问候。❄️',
    tags: ['旅行', '风景', '自然'],
    media: [],
    stats: {
      commentCount: 23,
      avgScore: 4.7,
      scoreCount: 112,
    },
    createdAt: '2025-12-17T09:00:00Z',
  },
  {
    id: 105,
    user: {
      id: 505,
      nickname: 'AI狂热者',
    },
    text: '最近的 AI 模型更新速度太快了，大家对此怎么看？',
    tags: ['AI', '科技趋势'],
    media: [
      {
        type: 'image',
        url: 'https://picsum.photos/id/180/800/600',
      },
    ],
    stats: {
      commentCount: 156,
      avgScore: 3.5,
      scoreCount: 502,
    },
    createdAt: '2025-12-17T14:20:00Z',
  },
];

export const fetchPosts = (): Promise<ApiResponse<PostResponse>> => {
  return new Promise<ApiResponse<PostResponse>>((resolve) => {
    setTimeout(() => {
      resolve({
        code: 0,
        msg: 'success',
        data: {
          total: 10,
          list: mockPosts,
        },
      });
    }, 1000);
  });
};
