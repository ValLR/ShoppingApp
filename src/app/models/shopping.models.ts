export interface ShoppingItem {
  name: string;
  checked: boolean;
  image?: string;
}

export interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
}
