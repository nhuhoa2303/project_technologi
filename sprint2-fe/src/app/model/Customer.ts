import {Cart} from './Cart';
import {AppUser} from './AppUser';

export interface Customer {
  id?: number;
  name?: string;
  image?: string;
  email?: string;
  birthday?: string;
  phoneNumber?: string;
  address?: string,
  gender?: string,
  isDelete?: boolean;
  appUser?: AppUser;
  cart?: Cart[];
}
