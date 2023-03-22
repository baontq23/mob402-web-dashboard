import { IUser } from './user';

export interface IProduct {
  id: string;
  name: string;
  price: number;
  image: string;
  color: string;
  type: string;
  user?: IUser;
}
