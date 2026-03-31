

export interface MenuItem {
  title: string; 
  href: string;
  description: string;
  mainItem:boolean
}

export interface ITopNavCategories {
  categoryTitle:string;
  categoryItems:MenuItem[];
}

export interface INavigationMenuProps {
  items:ITopNavCategories[];
}