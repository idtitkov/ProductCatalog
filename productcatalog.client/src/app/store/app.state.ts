import { CategoryState } from "./category/category.reducer";
import { ProductState } from "./product/product.reducer";
import { UserState } from "./user/user.reducer";

export interface AppState {
  users: UserState;
  products: ProductState;
  categories: CategoryState;
}
