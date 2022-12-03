import {Category} from "./Category";

export interface Product {
  id?: number,
  name?: string,
  createDate?: string,
  quantity?: number,
  price?: number,
  priceSale?: number,
  madeIn?: string,
  specifications?: string,
  category?: Category,
  image?: string,
  isDelete?: number,
  detail?: string,
}
