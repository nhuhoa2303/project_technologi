import {Cart} from './Cart';


export interface Bill {
  id?: number,
  code?: string,
  creationDate?: string ,
  isDeleted?: boolean,
  cartList?: Cart[],
}
