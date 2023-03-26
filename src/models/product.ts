import { IUser } from './user';

export interface IProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  image_link?: string;
  color: string;
  type: string;
  user?: IUser;
}
