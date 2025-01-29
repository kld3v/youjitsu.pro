import { Config } from 'ziggy-js';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  role: 'student' | 'sensei';
}

export type PageProps<
  T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
  auth: {
    user: User;
  };
  ziggy: Config & { location: string };
};

export type Dojo = {
  id: number;
  name: string;
};

interface Reviewer {
  name: string;
}
export interface IVideo {
  id: number;
  title: string;
  path: string;
  description?: string;
}

export type StudentReview = {
  id: number;
  feedback: string;
  reviewer: Reviewer;
  review_video: IVideo;
};

export type SenseiReview = {
  id: number;
  feedback: string;
  description: string;
  title: string;
  status: 'pending' | 'completed' | 'completed (viewed)';
  notes?: string;
  video: IVideo & {
    user: {
      name: string;
    };
  };
};
