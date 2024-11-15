import { Category } from "./category.model";

export interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    note: string;
    specialNote: string;
    category: Category;
}
