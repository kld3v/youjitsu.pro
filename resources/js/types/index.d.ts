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

export type SenseiReview = {
  id: number;
  feedback: string;
  description: string;
  title: string;
  status: 'pending' | 'completed' | 'completed (viewed)';
  notes?: string;
  video: {
    url: string;
    user: {
      name: string;
    };
  };
};
