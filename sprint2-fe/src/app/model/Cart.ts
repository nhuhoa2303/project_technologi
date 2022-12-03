import {Product} from './Product';
import {Customer} from './Customer';
import {Bill} from './Bill';

export interface Cart {
  id?: number,
  name?: string,
  quantity?: number,
  priceSale?: number,
  total?: number,
  image?: string,
  product?: Product,
  customer?: Customer
  bill?: Bill
}
