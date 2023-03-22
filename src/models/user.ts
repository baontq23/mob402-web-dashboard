export type UserStatus = 'verified' | 'pending';

export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar?: string | null;
  role?: string;
  isEmailVerified?: boolean;
  createAt?: string;
  updateAt?: string;
}
